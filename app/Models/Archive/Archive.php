<?php

namespace App\Models\Archive;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class Archive extends Model
{
    const TYPE_FOLDER = 0;
    const TYPE_PAGE = 1;
    const TYPE_FILE = 2;

    const FLAGS_VISIBLE = 0x01;
    const FLAGS_WRITABLE = 0x02;

    protected $table = "archive";

    protected $fillable = [
        'parent_id',
        'type',
        'short_name',
        'content_type',
        'archive_link',
        'created_at',
    ];

    /**
     * Return the parent (root) Archive
     * @return Archive
     */
    public static function root()
    {
        $archive = new Archive();
        $archive->id = 0;
        $archive->title = 'Archive';
        $archive->path = '';
        $archive->version = 0;
        $archive->language = 'en';
        $archive->short_name = null;
        return $archive;
    }

    public function shortNameId()
    {
        if (!empty($this->short_name) && !is_numeric($this->short_name))
            return $this->short_name;
        return $this->id;
    }

    public function isFolder()
    {
        return ($this->type == Archive::TYPE_FOLDER);
    }

    public function isPage()
    {
        return ($this->type == Archive::TYPE_PAGE);
    }

    public function isFile()
    {
        return ($this->type == Archive::TYPE_FILE);
    }

    public static function get($path)
    {
        $archive = null;
        $parentID = 0;
        $titles = explode('/', $path);
        foreach ($titles as $title) {
            $archive = Archive::where('title', '=', $title)->where('parent_id', $parentID)->where('related_id', 0)->first();
            if (empty($archive)) {
                $archive = new Archive();
                $archive->title = $title;
                $archive->parent_id = $parentID;
                $archive->type = 0;
                $archive->apply();
                $parentID = $archive->id;
            } else {
                $parentID = $archive->id;
            }
        }
        return $archive;
    }

    public static function getWithName($path, $name)
    {
        $archive = null;
        $parentID = 0;
        $titles = explode('/', $path);
        foreach ($titles as $title) {
            $archive = Archive::where('title', '=', $title)->where('parent_id', $parentID)->where('related_id', 0)->first();
            if (empty($archive)) {
                $archive = new Archive();
                $archive->title = $title;
                $archive->sub_title = $name;
                $archive->parent_id = $parentID;
                $archive->type = 0;
                $archive->apply();
                $parentID = $archive->id;
            } else {
                $parentID = $archive->id;
            }
        }
        return $archive;
    }

    public static function locate($shortNameOrId) {

        if(is_numeric($shortNameOrId))
            return Archive::find($shortNameOrId);

        return Archive::where('short_name', '=', $shortNameOrId)->where('related_id', 0)->first();
    }

    public function updateLocalDocument($path) {

        if(!Storage::disk('local')->exists($path)) return;

        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $applicationType = Storage::disk('local')->mimeType($path);

        $archive = $this;
        if(!isEn()) {
            $archive = $archive->getLocale();
        }

        $destPath = $archive->getLocale($archive->language)->calculatePath();
        Storage::disk('local')->delete($destPath);

        $archive->extension = $extension;
        $archive->application_type = $applicationType;
        $archive->saveFTS();

        $destPath = $archive->getLocale($archive->language)->calculatePath();
        Storage::disk('local')->copy($path,  $destPath);

        $archive->size = $archive->calculateSize();
        $archive->path = $archive->parent->calculatePath();
        $archive->saveFTS();
        $archive->refresh();

        return true;
    }

    public function locateChild($shortNameOrId)
    {

        $parentsIds = Archive::where('parent_id', $this->id)->where('related_id', 0)->whereIn('content_type', ['group', 'folder'])->pluck('id')->toArray();
        $parentsIds[] = $this->id;

        if (is_numeric($shortNameOrId))
            return Archive::whereIn('parent_id', $parentsIds)->where('related_id', 0)->where('id', $shortNameOrId)->first();

        return Archive::whereIn('parent_id', $parentsIds)->where('related_id', 0)->where('short_name', $shortNameOrId)->first();
    }

    public function findFarChildByShortName($shortName)
    {

        return Archive::where('short_name', '=', $shortName)
            ->where('path', 'like', $this->path . "%")
            ->where('related_id', '=', 0)
            ->first();
    }

    public function farChildren()
    {
        return Archive::where('path', 'like', $this->path . "%")
            ->where('related_id', '=', 0);
    }

    public function findChildByShortName($shortName)
    {
        return Archive::where('short_name', '=', $shortName)
            ->where('parent_id', '=', $this->id)
            ->where('related_id', '=', 0)
            ->first();
    }

    public function findChildByTitle($title)
    {

        return Archive::where('title', '=', $title)->where('parent_id', '=', $this->id)->where('related_id', 0)->first();
    }

    public function findChildByContentType($contentType)
    {

        return Archive::where('content_type', 'like', $contentType)->where('parent_id', '=', $this->id)->where('related_id', 0)->first();
    }

    public function findChildsByContentType($contentType)
    {
        return Archive::where('content_type', '=', $contentType)->where('parent_id', '=', $this->id)->where('related_id', 0)->get();
    }

    public function checkChildsTitle($title, $languag, $exceptId = 0)
    {

        return (Archive::where('title', '=', $title)->where('id', '!=', $exceptId)->where('parent_id', '=', $this->id)->where('language', '=', $languag)->count() == 0);
    }

    public function user()
    {

        return $this->belongsTo(User::class, 'user_id')->withDefault([
            'id' => 0,
            'en_full_name' => 'System'
        ]);
    }

    public function childrenWithType($contentType){
        return $this->hasMany(Archive::class , 'parent_id')->where('related_id', 0)->where('content_type', '=', $contentType);
    }

    public function childrenWithAnyType(){
        return $this->hasMany(Archive::class , 'parent_id')->where('related_id', 0)->whereNotNull('content_type');
    }

    public function locale($language = null)
    {

        $archive = $this->getLocale($language);
        return $archive->belongsTo(Archive::class, 'id');
    }

    public function getLocale($language = null)
    {

        if ($this->id == 0) return $this;

        if (empty($language))
            $language = app()->getLocale();

        if ($language == $this->language)
            return $this;

        $archive = Archive::where('related_id', $this->id)->where('language', $language)->first();
        if ($archive)
            return $archive;

        $archive = new Archive();
        $archive->parent_id = $this->parent_id;
        $archive->related_id = $this->id;
        $archive->short_name = $this->short_name;
        $archive->user_id = auth()->id();
        $archive->language = $language;
        $archive->title = $this->title;
        $archive->type = $this->type;
        $archive->archive_link = $this->archive_link;
        $archive->created_at = $this->created_at;
        $archive->size = 0;
        $archive->extension = $this->extension;
        $archive->sub_title = $this->sub_title;
        $archive->description = $this->description;
        $archive->saveFTS();

        $archive->updatePath();

        return $archive;
    }

    public function parent()
    {
        return $this->belongsTo(Archive::class, 'parent_id')->withDefault([
            'id' => 0,
            'title' => 'Archive'
        ]);
    }

    public function archiveTypes()
    {
        return $this->hasMany(Archive::class, 'parent_id')
            ->select('content_type')
            ->join('documents_types', 'documents_types.type', 'archive.content_type')
            ->where('archive.type', '=', 2)
            ->groupBy('archive.content_type', 'documents_types.id')
            ->orderBy('documents_types.id')
            ->pluck('archive.content_type')
            ->toArray();
    }

    public function childrenWithShortName($shortName)
    {
        return $this->hasMany(Archive::class, 'parent_id')->where('related_id', 0)->where('short_name', '=', $shortName)->orderBy('order');
    }

    public function childrenWithContentType($contentType)
    {
        return $this->hasMany(Archive::class, 'parent_id')->where('related_id', 0)->where('content_type', '=', $contentType)->orderBy('order');
    }

    public function childrenWithAnyContentType()
    {
        return $this->hasMany(Archive::class, 'parent_id')->where('related_id', 0)->whereNotNull('content_type')->orderBy('order');
    }

    /**
     * return the children of the archive
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function children()
    {
        return $this->hasMany(Archive::class, 'parent_id')->where('related_id', 0)->orderBy('order')->orderBy('id');
    }

    public function childrenNews()
    {
        return $this->hasMany(Archive::class, 'parent_id')->where('related_id', 0)->orderBy('created_at','DESC');
    }

    public function related()
    {
        return $this->hasMany(Archive::class, 'related_id');
    }

    public function childrenFolders()
    {
        return $this->hasMany(Archive::class, 'parent_id')->where('related_id', 0)->where('type', '=', 0)->orderBy('order')->orderBy('id');
    }

    public function childrenPages($orderBy = 'order', $orderDirection = 'ASC')
    {
        return $this->hasMany(Archive::class, 'parent_id')->where('related_id', 0)->where('type', '=', 1)->orderBy($orderBy, $orderDirection)->orderBy('id');
    }

    public function childrenFiles()
    {
        return $this->hasMany(Archive::class, 'parent_id')->where('related_id', 0)->where('type', '=', 2)->orderBy('order')->orderBy('id');
    }

    public function brothers()
    {
        return $this->hasMany(Archive::class, 'parent_id', 'parent_id')->where('related_id', 0)->where('id', '!=', $this->id);
    }

    public function getPageImagesFolder()
    {
        $folder = $this->parent->findChildByContentType("images");
        if (empty($folder))
            $folder = $this->parent->addFolder("images", "images");
        return $folder;
    }

    public function findNonEmptyPage() {
        if(!$this->isPage()) return $this;
        $content = $this->locale->page();
        $text = trim("".$content);
        if(strlen($text)==0) {
            if(lang()=='en'){
                return $this->getLocale('ar');
            }
            else {
                return $this;
            }
        }
        return $this->locale;
    }

    public function updatePage($content, $direct = false)
    {

        $archive = ($direct) ? $this : $this->getLocale();

        $content = Archive::extractImages($content, $this);

        Storage::disk('local')->put($archive->calculatePath(), $content);
        $archive->size = $archive->calculateSize();
        return $archive->save();
    }

    public function page()
    {
        if (!Storage::disk('local')->exists($this->calculatePath()))
            return "";
        return Storage::disk('local')->get($this->calculatePath());
    }


    public function content()
    {
        if (!Storage::disk('local')->exists($this->calculatePath()))
            return null;
        return Storage::disk('local')->get($this->calculatePath());
    }

    public function updatePath()
    {

        $this->path = $this->parent->calculatePath();
        $this->save();

        foreach ($this->children as $archive) {
            $archive->updatePath();
        }

        foreach ($this->related as $archive) {
            $archive->updatePath();
        }
    }

    public function rename($newTitle, $direct = false)
    {

        $archive = ($direct) ? $this : $this->getLocale();


        if ($newTitle == $archive->title)  return response()->json(['new' => $newTitle , 'old' => $archive->title], 200);

        $appendID = false;
        if (!$archive->parent->checkChildsTitle($newTitle, $archive->language, $archive->id)) {
            $appendID = true;
        }

        $oldPath = $archive->calculatePath();
        $archive->title = $newTitle;
        if ($appendID) {
            $archive->title = $newTitle . '.' . $archive->id;
        }
        $archive->saveFTS();
        $newPath = $archive->calculatePath();
        if (Storage::disk('local')->exists($oldPath)) {
            Storage::disk('local')->move($oldPath, $newPath);
        }

        if ($this->isFolder()) {
            $this->updatePath();
        }
    }

    public function doMove($newParentPath)
    {
        Storage::disk('local')->makeDirectory($newParentPath);
        $result = Storage::disk('local')->move($this->calculatePath(), $newParentPath . "/" . $this->name());
        \Log::info('Request:', [$this->calculatePath(), $newParentPath . "/" . $this->name(), $result]);
    }

    public function move($newParentId)
    {
        //Same Parent -> no change
        if ($this->parent_id == $newParentId) {
            return false;
        }

        $newParentPath = "";
        if ($newParentId != 0) {
            $newParent = Archive::find($newParentId);

            $parent = $newParent;
            while ($parent->id != 0) {
                if ($parent->id == $this->id) {
                    return false;
                }
                $parent = $parent->parent;
            }

            $newParentPath = $newParent->calculatePath();
        }
        if (empty($newParentId)) $newParentId = 0;

        if (Storage::disk('local')->exists($this->calculatePath())) {
            $this->doMove($newParentPath);
        }
        $this->parent_id = $newParentId;
        $this->save();
        $this->refresh();

        foreach ($this->related as $archive) {

            $newParentPath = $newParent->getLocale($archive->language)->calculatePath();
            if (Storage::disk('local')->exists($archive->calculatePath())) {
                $archive->doMove($newParentPath);
            }

            $archive->parent_id = $newParentId;
            $archive->save();
            $archive->refresh();
        }

        $this->updatePath();

        return true;
    }

    private static $copyMap = [];

    public function copy($newParentId, $userId = null, $newTitle = null, $filesOnly = false, $relatedId = 0, $rootCall = true)
    {

        if ($rootCall) {
            Archive::$copyMap = [];
        }

        $newParent = ($newParentId != 0) ? Archive::find($newParentId) : Archive::root();

        $appendID = false;
        if (empty($newTitle)) $newTitle = $this->title;
        if (!$newParent->checkChildsTitle($newTitle, $this->language)) {
            $appendID = true;
        }

        $newArchive = $this->replicate();
        $newArchive->parent_id = $newParentId;
        $newArchive->title = $newTitle . '.' . Archive::nextID();
        $newArchive->order = $newParent->children()->max('order') + 1;
        $newArchive->user_id = ($userId === null) ? auth()->id() : $userId;
        $newArchive->related_id = $relatedId;
        $newArchive->save();

        if ($appendID) {
            $newArchive->title = $newTitle . '.' . $newArchive->id;
        } else {
            $newArchive->title = $newTitle;
        }

        $newArchive->saveFTS();

        Archive::$copyMap[$this->id] = $newArchive->id;


        if ($this->type != 0 && Storage::disk('local')->exists($this->calculatePath())) {
            Storage::disk('local')->copy($this->calculatePath(), $newParent->getLocale($newArchive->language)->calculatePath() . "/" . $newArchive->name());
        }

        $newArchive->apply(false);

        foreach ($this->related as $archive) {
            if ($archive->copy($newParentId, $userId, null, false, $newArchive->id, false) === false)
                return false;
        }

        if ($relatedId == 0) { //related archive has no children

            foreach ($this->children as $archive) {
                if ($archive->id == $newArchive->id || ($archive->type == 0 && $filesOnly))
                    continue;
                if ($archive->copy($newArchive->id, $userId, null, false, 0, false) === false)
                    return false;
            }
        }

        if ($rootCall) {
            $newArchive->fixCopiedPages();
        }

        return $newArchive;
    }

    public function fixCopiedPage()
    {
        $page = $this->page();
        foreach (Archive::$copyMap as $oldId => $newId) {
            \Log::info('Conversion:', ["archive/download/$oldId", "archive/download/$newId"]);
            $page = mb_ereg_replace("archive/download/$oldId", "archive/download/$newId", $page);
        }
        $this->updatePage($page, true);
    }

    public function fixCopiedPages()
    {
        foreach ($this->children as $archive) {
            $archive->fixCopiedPages();
        }

        if ($this->isPage()) {
            $this->fixCopiedPage();
            foreach ($this->related as $archive) {
                $archive->fixCopiedPage();
            }
        }
    }

    public function setFlags($flags)
    {
        $this->flags = $flags;
        $this->save();
        foreach ($this->children as $child) {
            $child->setFlags($flags);
        }
    }

    public function apply($makeLocale = true) {

        if($this->id==0) {
            $this->order = Archive::where('parent_id','=',$this->parent_id)->max('order')+1;
        }

        if($this->type==1) {
            $this->extension = "html";
        }

        $this->path = $this->parent->calculatePath();

        if ($this->type != 0) {
            $this->size = $this->calculateSize();
        } else {
            $this->size = 0;
        }

        $this->saveFTS();

        if($makeLocale && !isEn()){
            $this->getLocale();
        }
    }

    public function updateFile($file) {

        $archive = $this;
        if(!isEn()) {
            $archive = $archive->getLocale();
        }

        $title = str_replace(".".$file->getClientOriginalExtension(),'',$file->getClientOriginalName()); //pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();

        Storage::disk('local')->delete($archive->calculatePath());

        if(!$archive->parent->checkChildsTitle($title, $archive->language, $archive->id))
            $archive->title = $title.'.'.$archive->id;
        else
            $archive->title = $title;
        $archive->extension = strtolower($extension);
        $archive->application_type = $file->getMimeType();
        $archive->saveFTS();

        Storage::disk('local')->putFileAs($archive->parent->getLocale($archive->language)->calculatePath(), $file, $archive->name());

        $archive->size = $archive->calculateSize();
        $archive->path = $archive->parent->calculatePath();
        $archive->saveFTS();
        $archive->refresh();

        return true;
    }

    public function addFolder($title, $contentType = null)
    {

        $appendID = false;
        if (!$this->checkChildsTitle($title, $this->language)) {
            $appendID = true;
        }

        $archive = new Archive();
        $archive->order = Archive::where('parent_id', '=', $archive->id)->max('order') + 1;
        $archive->title = $title . '.' . Archive::nextID();
        $archive->user_id = auth()->id();
        $archive->parent_id = $this->id;
        $archive->type = 0;
        $archive->content_type = $contentType;
        $archive->save();

        if ($appendID) {
            $archive->title = $title . '.' . $archive->id;
        } else {
            $archive->title = $title;
        }

        $archive->size = 0;
        $archive->path = $this->calculatePath();
        $archive->saveFTS();

        return $archive;
    }

    public function addFile($file, $contentType = null , $order = null) {
        $title = str_replace(".".$file->getClientOriginalExtension(),'',$file->getClientOriginalName());
        $extension = $file->getClientOriginalExtension();

        $appendID = false;
        if(!$this->checkChildsTitle($title, $this->language)) {
            $appendID = true;
        }

        $archive = new Archive();
        $archive->order = $order?$order:Archive::select('order')->where('parent_id', '=', $this->id)->max('order')+1;
        $archive->title = $title.'.'.Archive::nextID();
        $archive->user_id = auth()->id();
        $archive->extension = strtolower($extension);
        $archive->parent_id = $this->id;
        $archive->type = 2;
        $archive->application_type = $file->getMimeType();
        $archive->content_type = $contentType;
        $archive->save();

        if($appendID){
            $archive->title = $title.'.'.$archive->id;
        }
        else {
            $archive->title = $title;
        }

        if(!isEn()) {
            $archive->updateFile($file);
            $locale = $archive->getLocale();
            Storage::disk('local')->copy($locale->calculatePath(), $this->calculatePath()."/".$archive->name());
        } else {
            Storage::disk('local')->putFileAs($this->calculatePath(), $file, $archive->name());
        }

        $archive->size = $archive->calculateSize();
        $archive->path = $this->calculatePath();
        $archive->saveFTS();
        $archive->refresh();

        if($archive->size > 20971520)
        {
            $archive->delete();
            return false;   
        }

        return $archive;
    }

    public function addDocumentFolder($document, $contentType = null)
    {

        $appendID = false;
        if (!$this->checkChildsTitle($document->title, $this->language)) {
            $appendID = true;
        }

        $archive = new Archive();
        $archive->order = Archive::where('parent_id', '=', $archive->id)->max('order') + 1;
        $archive->title =  $document->title . '.' . Archive::nextID();
        $archive->user_id = auth()->id();
        $archive->short_name = $document->short_name;
        $archive->document_type_id = $document->category;
        $archive->document_id = $document->id;
        $archive->parent_id = $this->id;
        $archive->type = 0;
        $archive->content_type = $contentType;
        $archive->save();

        if ($appendID) {
            $archive->title = $document->title . '.' . $archive->id;
        } else {
            $archive->title = $document->title;
        }

        $archive->size = 0;
        $archive->path = $this->calculatePath();
        $archive->saveFTS();

        return $archive;
    }

    public function addDocumentWithShortName($file,  $contentType = null , $title , $short_name ) {

        $extension = $file->getClientOriginalExtension();
        $appendID = false;
        if(!$this->checkChildsTitle($title, $this->language)) {
            $appendID = true;
        }

        $archive = new Archive();
        $archive->order =  Archive::select('order')->where('parent_id', '=', $this->id)->max('order')+1;
        $archive->title = $title.'.'.Archive::nextID();
        $archive->short_name = $short_name;
        $archive->user_id = auth()->id();
        $archive->extension = strtolower($extension);
        $archive->parent_id = $this->id;
        $archive->type = 2;
        $archive->application_type = $file->getMimeType();
        $archive->content_type = $contentType;
        $archive->save();

        if($appendID){
            $archive->title = $title.'.'.$archive->id;
        }
        else {
            $archive->title = $title;
        }

        if(!isEn()) {
            $archive->updateFile($file);
            $locale = $archive->getLocale();
            Storage::disk('local')->copy($locale->calculatePath(),$this->calculatePath()."/".$archive->name());
        } else {
            Storage::disk('local')->putFileAs(   $this->calculatePath() , $file, $archive->name());
        }

        $archive->size = $archive->calculateSize();
        $archive->path = $this->calculatePath();
        $archive->saveFTS();
        $archive->refresh();

        return $archive;
    }

    public function addDocument($file,  $contentType = null , $title , $document , $withFolder) {

        $extension = $file->getClientOriginalExtension();
        $appendID = false;
        if(!$this->checkChildsTitle($title, $this->language)) {
            $appendID = true;
        }
        $folder = null;
        if ($withFolder && $document->parent) {
            $folder = $this->findChildByTitle($document->parent->title) ? $this->findChildByTitle($document->parent->title) : $this->addDocumentFolder($document->parent , $contentType);
        }
        $archive = new Archive();
        $archive->order =  Archive::select('order')->where('parent_id', '=', $folder ? $folder->id : $this->id)->max('order')+1;
        $archive->title = $title.'.'.Archive::nextID();
        $archive->short_name = $document->short_name;
        $archive->document_type_id = $document->category;
        $archive->document_id = $document->id;
        $archive->user_id = auth()->id();
        $archive->extension = strtolower($extension);
        $archive->parent_id = $folder ? $folder->id : $this->id;
        $archive->type = 2;
        $archive->application_type = $file->getMimeType();
        $archive->content_type = $contentType;
        $archive->size = $archive->calculateSize();
       
        $archive->save();
        
       

        if($appendID){
            $archive->title = $title.'.'.$archive->id;
        }
        else {
            $archive->title = $title;
        }

        if(!isEn()) {
            $archive->updateFile($file);
            $locale = $archive->getLocale();
            Storage::disk('local')->copy($locale->calculatePath(),$folder ? $folder->calculatePath() : $this->calculatePath()."/".$archive->name());
        } else {
            Storage::disk('local')->putFileAs(  $folder ? $folder->calculatePath() : $this->calculatePath() , $file, $archive->name());
        }

        $archive->size = $archive->calculateSize();
        $archive->path =$folder ? $folder->calculatePath() : $this->calculatePath();
        $archive->saveFTS();
        $archive->refresh();

        if($archive->size > 20971520)
        {
            $archive->delete();
            return false;   
        }

        return $archive;
    }
    
    public function checkDocument($document){
       return (self::whereParentIdAndDocumentId($this->id , $document->id)->count() > 0);
    }

    public function addLocalDocument($path , $title , $document , $withFolder , $date) {
        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $folder = null;
        // $folder = null;
        // if ($withFolder && $document->parent) {
        //     $folder = $this->findChildByTitle($document->parent->title) ? $this->findChildByTitle($document->parent->title) : $this->addDocumentFolder($document->parent);
        // }

        // $appendID = false;
        // // $myFolder = $folder? $folder : $this;
        // if(!$this->checkDocument($document)) {
        //     $appendID = true;
        // }
        // 
        // dd($title , $document , strtolower($extension) , $this);
        
        if(!$this->checkDocument($document)){
            $archive = new Archive();
            $archive->order = 0 ; //  Archive::select('order')->where('parent_id', '=', $folder ? $folder->id : $this->id)->max('order')+1;
            $archive->title = $title ; //substr($title,0,200);
            $archive->short_name = $document->short_name;
            $archive->document_type_id = $document->category;
            $archive->document_id = $document->id;
            $archive->created_at = $date;
            // $archive->updated_at = $date;
            // $archive->user_id = auth()->id();
            $archive->extension = strtolower($extension);
            $archive->parent_id =  $this->id;
            $archive->type = 2;
            $archive->save();
//            Storage::disk('local')->put($archive->calculatePath(), $content);
            if(Storage::disk('local')->exists($path)) {
                Storage::disk('local')->copy($path, $archive->calculatePath());
            }

            // if (!isEn()) {
            //     $local = $archive->getLocale();
            //     $local->extension = strtolower($extension);
            //     if(Storage::disk('local')->exists($path)) {
            //         Storage::disk('local')->copy($path, $local->calculatePath());
            //     }
            //     $local->size = $local->calculateSize();
            //     $local->path = $this->getLocale()->calculatePath();
            //     $local->application_type = $local->mimeType();
            //     $local->save();
            // }
            $archive->size = $archive->calculateSize();
            $archive->path = $this->calculatePath();
            $archive->saveFTS();
            $archive->refresh();

            return $archive;
        }
    }

    public function updateDocument($file) {
        $archive = $this;
        if(!isEn()) {
            $archive = $archive->getLocale();
        }
        Storage::disk('local')->delete($archive->calculatePath());

        $extension = $file->getClientOriginalExtension();
        $archive->extension = strtolower($extension);
        $archive->application_type = $file->getMimeType();
        $archive->saveFTS();

        Storage::disk('local')->putFileAs($archive->parent->getLocale($archive->language)->calculatePath(), $file, $archive->name());
        $archive->size = $archive->calculateSize();
        $archive->path = $archive->parent->calculatePath();
       
        if($archive->size > 20971520)
        {
            return false;
        }
        $archive->saveFTS();
        $archive->refresh();
        return true;
    }

    public function addLocalFile($fileName, $content, $contentType = null)
    {

        $title = pathinfo($fileName, PATHINFO_FILENAME);
        $extension = pathinfo($fileName, PATHINFO_EXTENSION);

        $appendID = false;
        if (!$this->checkChildsTitle($title, $this->language)) {
            $appendID = true;
        }

        $archive = new Archive();
        $archive->order = Archive::where('parent_id', '=', $this->id)->max('order') + 1;
        $archive->title = $title . '.' . Archive::nextID();
        $archive->user_id = auth()->id();
        $archive->extension = strtolower($extension);
        $archive->parent_id = $this->id;
        $archive->type = 2;
        $archive->content_type = $contentType;
        $archive->save();

        if ($appendID) {
            $archive->title = $title . '.' . $archive->id;
        } else {
            $archive->title = $title;
        }

        Storage::disk('local')->put($archive->calculatePath(), $content);

        $archive->size = $archive->calculateSize();
        $archive->path = $this->calculatePath();
        $archive->application_type = $archive->mimeType();
        $archive->saveFTS();

        if (!isEn()) {

            $local = $archive->getLocale();
            $local->extension = strtolower($extension);

            \Log::info('calculatePath:', [$local->calculatePath()]);
            Storage::disk('local')->put($local->calculatePath(), $content);

            $local->size = $local->calculateSize();
            $local->path = $this->getLocale()->calculatePath();
            $local->application_type = $local->mimeType();
            $local->save();
        }


        return $archive;
    }

    public function addRemoteFile($url, $contentType = null)
    {

        $url = htmlspecialchars_decode($url);

        $name = substr($url, strrpos($url, '/') + 1);

        try {
            $contents = file_get_contents($url);
        } catch (\Throwable $e) {
        }

        //old eng.asu.edu.eg problem
        if (empty($contents)) {
            $url = str_replace("/../..", "/..", $url);
        }

        try {
            $contents = file_get_contents($url);
        } catch (\Throwable $e) {
            return null;
        }

        try {
            return $this->addLocalFile($name, $contents, $contentType);
        } catch (\Throwable $e) {
            return null;
        }
    }

    public function addPage($title, $content, $contentType)
    {

        $extension = "html";

        $appendID = false;
        if (!$this->checkChildsTitle($title, $this->language)) {
            $appendID = true;
        }

        $archive = new Archive();
        $archive->order = Archive::where('parent_id', '=', $this->id)->max('order') + 1;
        $archive->title = $title . '.' . Archive::nextID();
        $archive->user_id = auth()->id();
        $archive->extension = $extension;
        $archive->parent_id = $this->id;
        $archive->type = Archive::TYPE_PAGE;
        $archive->content_type = $contentType;
        $archive->save();

        if ($appendID) {
            $archive->title = $title . '.' . $archive->id;
        } else {
            $archive->title = $title;
        }

        if (empty($content))
            Storage::disk('local')->put($archive->calculatePath(), "");
        else
            Storage::disk('local')->put($archive->calculatePath(), $content);

        $archive->size = $archive->calculateSize();
        $archive->path = $this->calculatePath();
        $archive->application_type = "text/html";
        $archive->saveFTS();

        if (!isEn()) {

            $local = $archive->getLocale();
            $local->extension = strtolower($extension);

            Storage::disk('local')->put($local->calculatePath(), $content);

            $local->size = $local->calculateSize();
            $local->path = $this->getLocale()->calculatePath();
            $local->application_type = "text/html";
            $local->save();
        }


        return $archive;
    }

    public function name()
    {
        $name = $this->title;
        if (!empty($this->extension)) $name = $name . "." . $this->extension;
        return $name;
    }

    public function physicalPath()
    {
        return storage_path('app') . "/" . $this->calculatePath();
    }

    public function calculatePath()
    {
        $archive = $this;
        $path = "";
        while (true) {
            if (!empty($path)) $path = "/" . $path;
            $title = ($archive->id != 0) ? $archive->title : "";
            $path = $title . $path;
           $extension  = (strlen($archive->extension) > 10) ? "pdf" : $archive->extension;
            if (!empty($archive->extension)) $path = $path .".".$extension;
            if ($archive->parent_id == 0)
                break;
            $archive = $archive->parent->getLocale($archive->language);
        }

        if ($this->language == null || $this->language == "en")
            return $path;

        return $this->language . "/" . $path;
    }

    public function empty($removeFolders = true)
    {
        foreach ($this->children as $child) {
            if (!$child->isFolder() || $removeFolders) {
                $child->delete();
            }
        }
    }

    public function delete()
    {
        if ($this->related_id == 0) {
            foreach ($this->children as $archive) {
                $archive->delete();
            }
        }

        foreach ($this->related as $archive) {
            $archive->delete();
        }

        if ($this->type == 0) { // Type Folder
            Storage::disk('local')->deleteDirectory($this->calculatePath());
        } else { // File or Html Files
            Storage::disk('local')->delete($this->calculatePath());
        }

        parent::delete();
    }

    public function exists()
    {

        return Storage::disk('local')->exists($this->calculatePath());
    }

    public function filemtime()
    {
        if (!$this->exists()) return null;
        $time = Storage::disk('local')->lastModified($this->calculatePath());
        return Carbon::createFromTimestamp($time);
    }

    public function mimeType()
    {
        if (!$this->exists()) return null;
        return Storage::disk('local')->mimeType($this->calculatePath());
    }

    public function calculateSize()
    {
        if ($this->exists())
            return Storage::disk('local')->size($this->calculatePath());
        return 0;
    }

    public function sizeText()
    {
        $size = (int)$this->calculateSize();

        if ($size < 1024)
            return (int)($size) . " Byte";

        if ($size < 1024 * 1024)
            return (int)($size / 1024) . " KB";

        if ($size < 1024 * 1024 * 1204)
            return (int)($size / (1024 * 1024)) . " MB";

        return (int)($size / (1024 * 1024 * 1204)) . " GB";
    }

    /**
     * return the Types of the Content of the archive âœ”ðŸ’ª
     * @return array
     */
    public static function types()
    {
        return [
            0 => 'Folder',
            1 => 'Page',
            2 => 'File'
        ];
    }

    public static function contentTypes()
    {
        return Archive::select('content_type')->whereNotNull('content_type')->distinct()->pluck('content_type', 'content_type')->toArray();
    }

    public static function dashReport()
    {
        $report = (object)[];
        $date = Carbon::now()->subYears(1);
        $report->monthlyCount = [];
        $average = 0;
        for ($i = 0; $i < 12; $i++) {
            $start = $date->copy();
            $average += $report->monthlyCount[] = Archive::where('created_at', '>', $start)->where('created_at', '<', $date->addMonths(1))->count();
        }
        $average /= 12;
        if ($average > 0)
            $report->change = 100 * ($report->monthlyCount[11] - $average) / $average;
        else
            $report->change = 0;
        if ($report->change < 1)
            $report->change = 0;
        $report->changeLabel = number_format($report->change, 1) . "%";

        $report->plot = "";
        for ($i = 0; $i < 12; $i++) {
            $count = $report->monthlyCount[$i];
            $report->plot .= "" . ($i * 10) . " " . (30 - 15 * $count / $average) . " ";
            $report->monthlyCount[] = $count;
        }

        $report->activeCount = $report->monthlyCount[11];

        return $report;
    }


    public function isMyArchive()
    {

        $user = auth()->user();
        $archive = $this;

        if ($user->archive_id == $archive->id) return true;

        $archiveUser = ArchiveUser::where('archive_id', $archive->id)
            ->where('user_id', $user->id)
            ->first();
        if ($archiveUser) return true;

        $userRoles = $user->roles;
        foreach ($userRoles as $role) {
            $archiveRole = ArchiveRole::where('role_id', $role->id)->where('archive_id', $archive->id)->first();
            if ($archiveRole) return true;
        }

        return false;
    }

    public function isOwner($user = null)
    {

        $user = ($user) ? $user : auth()->user();
        $tempArchivesIDs = Session::get("archive_temp_owner:" . $user->id);

        $archive = $this;
        while ($archive->id != 0) {

            if ($user->archive_id == $archive->id) return true;

            if ($tempArchivesIDs && in_array($archive->id, $tempArchivesIDs))
                return true;

            $archiveUser = ArchiveUser::where('archive_id', $archive->id)
                ->where('user_id', $user->id)
                ->first();

            if ($archiveUser)
                return true;

            $archive = $archive->parent;
        }

        return ($this->user_id == $user->id || can('admin_archive', $user));
    }

    public function canDownload($user = null)
    {

        return $this->canAccess($user);
    }

    public function canEdit($user = null)
    {

        if (!can('edit_archive', $user))
            return false;

        return $this->isOwner($user);
    }

    public function canDelete($user = null)
    {

        if (!can('edit_archive', $user))
            return false;

        return $this->isOwner($user);
    }

    public function setTempOwner()
    {
        $tempArchivesIDs = Session::get("archive_temp_owner:" . auth()->id());
        if (empty($tempArchivesIDs) || !is_array($tempArchivesIDs)) $tempArchivesIDs = [];
        $tempArchivesIDs[] = $this->id;
        Session::put("archive_temp_owner:" . auth()->id(), $tempArchivesIDs);
    }

    public static function extractImages($content, $archive)
    {

        return preg_replace_callback('#data:(image/[^;]*);base64,([a-zA-Z0-9+/=]*)#',
            function ($matches) use ($archive) {
                $map = array(
                    'image/jpg' => 'jpg',
                    'image/jpeg' => 'jpg',
                    'image/png' => 'png',
                    'image/gif' => 'gif',
                );
                list(, $type, $base64) = $matches;
                if ($type == 'image/*') {
                    $type = 'image/png';
                }

                $folder = $archive->getPageImagesFolder();

                $image = $folder->addLocalFile(uniqid() . "." . $map[$type], base64_decode($base64), "page_image");

                return route('download_file', ['archive' => $image->id]);
            }, $content);
    }

    public function download()
    {

        $locale = [];

        if ($this->exists())
            $locale[$this->language] = $this;

        foreach ($this->related as $related) {
            if ($related->exists())
                $locale[$related->language] = $related;
        }

        $archive = null;
        if (array_key_exists(app()->getLocale(), $locale)) {
            $archive = $locale[app()->getLocale()];
        } else if (count($locale) > 0) {
            $archive = array_values($locale)[0];
        }

        $file = Storage::disk('local')->get($archive->calculatePath());

        $seconds_to_cache = 3600;
        $ts = gmdate("D, d M Y H:i:s", time() + $seconds_to_cache) . " GMT";

        return response($file, 200, [
            'Content-Type' => $this->application_type,
            'Expires' => "$ts",
            'Pragma' => 'cache',
            'Cache-Control' => "max-age=$seconds_to_cache",
            'Content-Disposition' => 'inline; filename="' . $this->name() . '"',
        ]);
    }

    public function getSearchText()
    {

        $searchText = "";
        $searchText .= ", " . getFTS($this->id);
        $searchText .= ", " . getFTS($this->title);
        $searchText .= ", " . getFTS($this->description);
        $searchText .= ", " . getFTS($this->short_name);

        return $searchText;
    }

    public function saveFTS()
    {

        $this->search_text = "";
        $this->search_text .= $this->getSearchText();
//        foreach ($this->related as $related) {
//            $this->search_text .= ",".$related->getSearchText();
//        }
        $this->save();
    }

    public function getPageImages($locale = 'en')
    {
        $page = $this->page();
        $page = strtolower($page);
        preg_match_all('/<img(.*?)src=("|\'|)(.*?)archive\/download\/(.*?)("|\'| )(.*?)>/s', $page, $matches);
        $images = [];
        foreach ($matches[4] as $id) {
            $image = Archive::find($id);
            if ($image)
                $images[] = $image;
        }
        return $images;
    }

    public function getPageImage()
    {
        $page = $this->locale->page();
        $page = strtolower($page);
        preg_match_all('/<img(.*?)src=("|\'|)(.*?)archive\/download\/(.*?)("|\'| )(.*?)>/s', $page, $matches);
        $images = [];
        foreach ($matches[4] as $id) {
            $image = Archive::find($id);
            if ($image)
                return $image;
        }
        return null;
    }

    public function getNoneEmptyPageImage()
    {
        $page = $this->getLocale('ar')->page();
        if ($this->empty($page)){
            $page =  $this->getLocale('en')->page();
        }
        $page = strtolower($page);
        preg_match_all('/<img(.*?)src=("|\'|)(.*?)archive\/download\/(.*?)("|\'| )(.*?)>/s', $page, $matches);
        $images = [];
        foreach ($matches[4] as $id) {
            $image = Archive::find($id);
            if ($image)
                return $image;
        }
        return null;
    }

    public function updateFTS()
    {

        $this->saveFTS();

        foreach ($this->children as $archive) {
            $archive->updateFTS();
        }

        foreach ($this->related as $archive) {
            $archive->updateFTS();
        }
    }

    public function ids()
    {

        $ids = [];

        $ids[] = $this->id;

        foreach ($this->children as $archive) {
            $ids = array_merge($ids, $archive->ids());
        }

        return $ids;
    }

    public function export()
    {

        $ids = $this->ids();
        $archives = Archive::whereIn('id', $ids)->get()->toArray();


        $zipPath = "/temp_folders/$this->id.zip";
        Storage::disk('local')->delete($zipPath);
        $zipPath = storage_path('app') . $zipPath;

        $zip = new ZipArchive;
        if (!$zip->open($zipPath, ZipArchive::CREATE))
            abort(500);

        $zip->addFromString("data.json", json_encode($archives));

        foreach ($ids as $id) {
            $file = Archive::find($id);
            if ($file) {
                if ($file->isPage() || $file->isFile()) {
                    $destPath = "$file->id - $file->title.$file->extension";
                    $zip->addFile($file->physicalPath(), $destPath);
                }
            }
        }

        $zip->close();


        //$this->import($zipPath);

        return response()->download(
            $zipPath,
            "$this->title.zip",
            array('Content-Type: ' . mime_content_type($zipPath)));
    }

    public function import($zipPath) {

        $path = '/temp_folders/'.uniqid();
        $zip = new ZipArchive;
        $res = $zip->open($zipPath);
        if($res!==TRUE)
            abort();
        $zip->extractTo(storage_path("app$path"));
        $zip->close();

        $data = Storage::disk('local')->get($path.'/data.json');
        $items = json_decode($data);
        Archive::$copyMap = [];
        $rootArchive = null;

        $maxId = Archive::max('id');
        foreach ($items as $item) {
            if($item->id > $maxId) {
                $maxId = $item->id;
            }
        }
        $maxId++;
        \DB::statement("ALTER TABLE archive AUTO_INCREMENT = $maxId");
        \Log::info('COPY:', [$maxId]);

        foreach ($items as $item) {

            $archive = new Archive();
            $archive->version = $item->version;
            $archive->language = $item->language;
            $archive->short_name = $item->short_name;
            $archive->type = $item->type;
            $archive->order = $item->order;
            $archive->flags = $item->flags;
            $archive->user_id = auth()->id();
            $archive->title = $item->title;
            $archive->sub_title = $item->sub_title;
            $archive->description = $item->description;
            $archive->extension = $item->extension;
            $archive->application_type = $item->application_type;
            $archive->content_type = $item->content_type;
            $archive->search_text = $item->search_text;

            $appendId = false;
            if(empty($rootArchive)) {
                if(!$this->checkChildsTitle($item->title, $item->language)) {
                    $appendId = true;
                }
            }

            $archive->save();

            if($appendId){
                $archive->title = $archive->title.'.'.$archive->id;
            }

            if(empty($rootArchive)) {
                $rootArchive = $archive;
            }

            Archive::$copyMap[$item->id] = $archive->id;
        }

        foreach ($items as $item) {

            $id =  Archive::$copyMap[$item->id];
            $archive = Archive::find($id);

            if(array_key_exists($item->related_id, Archive::$copyMap))
                $archive->related_id = Archive::$copyMap[$item->related_id];
            else
                $archive->related_id = 0;

            if(array_key_exists($item->parent_id, Archive::$copyMap))
                $archive->parent_id = Archive::$copyMap[$item->parent_id];
            else
                $archive->parent_id = $this->id;

            $archive->save();
        }

        foreach ($items as $item) {

            $id =  Archive::$copyMap[$item->id];
            $archive = Archive::find($id);

            if($archive->isPage()||$archive->isFile()) {
                $filePath = $path."/$item->id - $item->title.$item->extension";
                \Log::info('COPY:', [$archive->parent_id, $archive->calculatePath()]);
                if(Storage::disk('local')->exists($filePath))
                    Storage::disk('local')->move($filePath, $archive->calculatePath());
            }

            $archive->size = $archive->calculateSize();
            $archive->path = $archive->parent->calculatePath();
            $archive->save();
        }

        Storage::disk('local')->deleteDirectory($path);

        \Log::info('copyMap:', [Archive::$copyMap]);

        if($rootArchive)$rootArchive->fixCopiedPages();
    }

    public function parents($includeSelf = false)
    {

        $items = [];
        if ($includeSelf)
            $items[] = $this;

        $parent = $this;
        while ($parent->id != 0) {
            $parent = $parent->parent;
            array_unshift($items, $parent);
        }

        return $items;
    }

    public function subChildren($type = null)
    {
        $archives = [];
        foreach ($this->children as $archive) {

            if ($type == null || $type == $archive->type) {
                $archives[] = $archive;
            }

            if ($archive->isFolder()) {
                $archives = array_merge($archive->subChildren($type), $archives);
            }
        }

        return $archives;
    }

    public function getContent()
    {
        if ($this->type == Archive::TYPE_PAGE || $this->type == Archive::TYPE_FILE) {
            if (Storage::disk('local')->exists($this->calculatePath()))
                return Storage::disk('local')->get($this->calculatePath());
        }
        return null;
    }

    public function addPageAdvanced($title, $body, $contentType)
    {

        $archive = new Archive();
        $archive->parent_id = $this->id;
        $archive->title = $title;
        $archive->extension = "html";
        $archive->user_id = auth()->id();
        $archive->type = Archive::TYPE_PAGE;
        $archive->application_type = "text/html";
        $archive->content_type = $contentType;
        $archive->save();
        $archive->updatePage($body);
        $archive->size = $archive->calculateSize();
        $archive->path = $this->calculatePath();
        $archive->save();

        return $archive;
    }

    public function useOneLanguage()
    {

        $fileUpdateAt = $this->filemtime();

        foreach ($this->related as $archive) {

            $relatedFileUpdateAt = $archive->filemtime();

            if (!empty($relatedFileUpdateAt) && (empty($fileUpdateAt) || $relatedFileUpdateAt->gt($fileUpdateAt))) {

                if (!empty($fileUpdateAt)) {
                    Storage::disk('local')->delete($this->calculatePath());
                }

                Storage::disk('local')->move($archive->calculatePath(), $this->calculatePath());
                $this->title = $archive->title;
                $this->sub_title = $archive->sub_title;
                $this->description = $archive->description;
            }
        }

        foreach ($this->children as $archive) {
            $archive->useOneLanguage();
        }

        foreach ($this->related as $archive) {
            $archive->delete();
        }

        $this->path = $this->parent->calculatePath();
        $this->size = $this->calculateSize();
        $this->saveFTS();
    }

    public function users()
    {
        return $this->belongsToMany('App\Models\User', 'archive_users', 'archive_id', 'user_id');
    }

    public function roles()
    {
        return $this->belongsToMany('Spatie\Permission\Models\Role', 'archive_roles', 'archive_id', 'role_id');
    }

    public function secret()
    {
        //encryptData("$this->id, $this->updated_at", env("WEBSITE_SHARED_KEY", NULL));
        return "$this->id,$this->updated_at";
    }


    public function canAccess($user = null)
    {

        $path = "/$this->path/$this->title/";
        if (strstr($path, "/website/")) {
            return true;
        }

        $user = ($user) ? $user : auth()->user();
        $userRoles = $user->roles;

        $tempArchivesIDs = Session::get("archive_temp_owner:" . $user->id);

        if (can('admin_archive', $user)) return true;

        $archive = $this;
        while ($archive->id != 0) {

            if ($user->archive_id == $archive->id) return true;
            if ($tempArchivesIDs && in_array($archive->id, $tempArchivesIDs)) return true;

            $archiveUser = ArchiveUser::where('user_id', $user->id)->where('archive_id', $archive->id)->first();
            if ($archiveUser) return true;

            foreach ($userRoles as $role) {
                $archiveRole = ArchiveRole::where('role_id', $role->id)->where('archive_id', $archive->id)->first();
                if ($archiveRole) return true;
            }

            $archive = $archive->parent;
        }

        return false;
    }

    public function fixOwner()
    {

        $owner = env('APP_STORAGE_OWNER', null);

        if ($owner) {
            try {
                echo "<p>" . $this->physicalPath() . "</p>";
                chmod($this->physicalPath(), 0775);
                echo "<p>done</p>";
                echo "<p></p>";
            } catch (\Throwable $e) {
                echo "<p>" . $e->getMessage() . "</p>";
                echo "<p></p>";
            }
            foreach ($this->children as $archive) {
                $archive->fixOwner();
            }
        }
    }

    public function isReadOnly($user = null)
    {

        if ($this->isOwner($user))
            return false;

        return true;
    }

    public static function nextID()
    {
        $maxID = Archive::max('id');
        if ($maxID === null) return 1;
        return $maxID + 1;
    }

    public function url()
    {
        if ($this->short_name) {
            if (strpos($this->short_name, 'http') === 0)
                return url($this->short_name);
            else if (lang() != 'en')
                return url(lang() . '/' . $this->short_name);
            else
                return url($this->short_name);
        }
        return '#';
    }

    public function access()
    {
        \DB::statement("UPDATE archive SET access_count = access_count + 1 WHERE id = $this->id;");
    }
}
