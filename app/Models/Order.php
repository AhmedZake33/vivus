<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Archive\Archive;

class Order extends Model
{
    use HasFactory;
    protected $fillable = ['Quantity','details','categories','user_id','location_id'];
    // protected $with = ['archive'];
    protected $casts = [
        'categories' => 'array',
    ];

    // public function category()
    // {
    //     return $this->belongsTo(category::class);
    // }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }  

    public static function checkLocation($location_id)
    {
        $location = Location::find($location_id);
        $status = Location::checkAvaiablity($location);
        if($status)
        {
            return true;
        }else{
            return false;
        }
    }

    public function archive()
    {
        if (empty($this->archive_id)) {
            $this->createArchive();
        }
        return $this->belongsTo(Archive::class, 'archive_id', 'id');
    }

    public function createArchive()
    {
        if ($this->archive_id) return $this->archive_id;
        $archive = Archive::get("orders/order_$this->id");
        $this->archive_id = $archive->id;
        $this->save();
        return $this->archive_id;
    }

    public function save(array $options = [])
    {
        $text = "#$this->id, $this->Quantity, $this->details";
        $this->search_text = $text;
        parent::save($options);
    }
}
