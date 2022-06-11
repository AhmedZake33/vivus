<?php

use App\Models\Evaluation\EvaluationApprovals;
use App\Models\Evaluation\EvaluationStatus;
use App\Models\Questionnaire\QuestionnaireAnswer;
use App\Models\Submission;
use App\Models\SubmissionNotes;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Crypt;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use App\Models\Alert;
use App\Notification;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

//use PhpOffice\PhpWord\Settings;
use NcJoes\OfficeConverter\OfficeConverter;




if (!function_exists('checkLanguage')) {
    function checkLanguage($array)
    {
        if($array != null){
            if($array == 'ar')
            {
                return 'ar';
            }else{
                return 'en';
            }
        }else{
            return 'en';
        }
    }
}


if (!function_exists('d')) {
    function d($in)
    {
        echo "<div style='background-color:gray; color:white;padding:5px;margin:2px;'>";
        print_r($in);
        echo "</div>";
    }
}

if (!function_exists('em')) {
    function em($in)
    {
        echo "<div style='background-color:red; color:white;padding:5px;margin:2px;'>";
        print_r($in);
        echo "</div>";
    }
}

if (!function_exists('sm')) {
    function sm($in)
    {
        echo "<div style='background-color:green; color:white;padding:5px;margin:2px;'>";
        print_r($in);
        echo "</div>";
    }
}

if (!function_exists('formatDate')) {
    function formatDate($date, $format = 'j-n-Y', $lang = 'ar')
    {
        if (empty($date)) return "";
        if (is_string($date))
            $date = new Carbon($date);
        if ($lang == 'en') return $date->format($format);

        // Carbon::setlocale("ar");
        // return  Carbon::parse($date)->format($format);
        return digits($date->format($format));
    }
}


if (!function_exists('digits')) {
    function digits($text, $fixArabicNumbersSpaces = true)
    {
//        if(app()->getLocale()=="ar") {
        $text = " " . $text;
        $arabic = [',', '٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', " \\ "];
        $english = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/'];
        $text = str_replace($english, $arabic, $text);
//            if($fixArabicNumbersSpaces)$text = str_replace(" ", "&nbsp;", $text);
        return trim($text);
//        }
        return $text;
    }
}

if (!function_exists('getQuestionAnswer')) {
    function getQuestionAnswer($answer_id)
    {
        switch ($answer_id) {
            case 1:
                return 'المستوى الاول';
            case 2:
                return 'المستوى الثانى';
            case 3:
                return 'المستوى الثالث';
            case 4:
                return 'المستوى الرابع';
            default:
                return '';

        }
    }
}

if (!function_exists('getToolAnswer')) {
    function getToolAnswer($value)
    {
        switch ($value) {
            case 1:
                return 'ينطبق';
            case 2:
                return 'لا ينطبق';
            default:
                return '';

        }
    }
}

if (!function_exists('wm')) {
    function wm($in)
    {
        echo "<div style='background-color:orange; color:black;padding:5px;margin:2px;'>";
        print_r($in);
        echo "</div>";
    }
}

if (!function_exists('dbg')) {
    function dbg($value, $title = "DEBUG")
    {
        \Log::info("$title:", [$value]);
    }
}

if (!function_exists('randnums')) {
    function randnums($n)
    {
        $characters = '0123456789';
        $randomString = '';
        for ($i = 0; $i < $n; $i++) {
            $index = rand(0, strlen($characters) - 1);
            $randomString .= $characters[$index];
        }
        return $randomString;
    }
}

if (!function_exists('format')) {
    function format($labels, $activities)
    {
        $array = [];
        foreach ($labels as $label) {
            $count = 0;
            foreach ($activities as $decision) {
                if ($decision->year == $label) {
                    $count = $decision->count;
                }
            }
            array_push($array, ['count' => $count, 'year' => $label]);
        }
        return $array;
    }
}


if (!function_exists('serviceName')) {
    function serviceName($service)
    {
        switch ($service) {
            case 1:
                return 'فطار';
            case 2:
                return 'فطار وغداء';
            case 3:
                return 'اقامة كاملة';
            case 4:
                return 'فطار وعشاء';
        }
    }
}


if (!function_exists('formatActivities')) {
    function formatActivities($labels, $activities)
    {
        $array = [];
        foreach ($labels as $label) {
            $count = 0;
            foreach ($activities as $activity) {
                if ($activity->label == $label) {
                    $count = $activity->count;
                }
            }
            array_push($array, ['count' => $count, 'label' => $label]);
        }
        return $array;
    }
}

if (!function_exists('formatDecisions')) {
    function formatDecisions($labels, $decisions)
    {
        $array = [];
        foreach ($labels as $label) {
            $count = 0;
            foreach ($decisions as $decision) {
                if ($decision->name == $label) {
                    $count = $decision->count;
                }
            }
            array_push($array, ['count' => $count, 'name' => $label]);
        }
        return $array;
    }
}

if (!function_exists('numValue')) {
    function numValue($value)
    {
        if (empty($value)) return 0;
        return $value;
    }
}


if (!function_exists('factoryID')) {
    function factoryID($model)
    {

        static $incrementalID = [];

        if (!array_key_exists($model, $incrementalID)) {
            $incrementalID[$model] = $model::max('id');
        }

        $id = $incrementalID[$model] + 1;
        $incrementalID[$model] = $id;

        return $id;
    }
}

if (!function_exists('encryptData')) {
    function encryptData($text, $password, $urlEncode = true)
    {
        $cipher = openssl_encrypt($text, "AES-256-ECB", hash('sha256', $password, true), OPENSSL_RAW_DATA);
        $output = base64_encode($cipher);
        if (!$urlEncode) return $output;
        return urlencode($output);
    }
}

if (!function_exists('questionType')) {
    function questionType($level)
    {
        switch ($level) {
            case 2:
                return 'المجال';
            case 3:
                return 'المعيار';
            case 4:
                return 'المؤشر';
            default:
                return '';
        }
    }
}

if (!function_exists('decryptData')) {
    function decryptData($input, $password, $urlEncode = true)
    {
        $cipher = base64_decode($input);
        $text = openssl_decrypt($cipher, "AES-256-ECB", hash('sha256', $password, true), OPENSSL_RAW_DATA);
        if (!$urlEncode) return $text;
        return urldecode($text);
    }
}

if (!function_exists('curl')) {
    function curl($url)
    {
        $curl = curl_init();
        curl_setopt_array($curl,
            array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_TIMEOUT => 30000,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "GET",
                CURLOPT_HTTPHEADER => array(
                    // Set Here Your Requesred Headers
                    'Content-Type: application/json',
                ),
            ));
        $response = curl_exec($curl);
        $err = curl_error($curl);
        if (!empty($err)) return false;
        curl_close($curl);
        return json_decode($response);
    }
}

if (!function_exists('getFTS')) {
    function getFTS($searchText)
    {

        if (filter_var($searchText, FILTER_VALIDATE_EMAIL)) {
            return $searchText;
        }

        $searchText = preg_replace('/[ ]{2,}|[\t]/', ' ', trim($searchText));
        $searchText = preg_replace('/[^\p{L}0-9\s]+/u', ' ', $searchText);
        $patterns = array("/(ا|أ|إ|آ)/", "/(ه|ة)/", "/(ـ)/", "/(ى)/");
        $replacements = array("ا", "ه", "", "ي");
        $searchText = preg_replace($patterns, $replacements, $searchText);

        return $searchText;
    }
}

if (!function_exists('findFiles')) {
    function findFiles($folder, $findFileName)
    {

        $allFilesPaths = Storage::disk('local')->files($folder);
        $filesPaths = [];
        foreach ($allFilesPaths as $filePath) {
            $fileName = pathinfo($filePath, PATHINFO_FILENAME);
            if ($fileName == $findFileName) {
                $filesPaths[] = $filePath;
            }
        }

        return $filesPaths;
    }
}

if (!function_exists('findFirstFile')) {
    function findFirstFile($folder, $findFileName)
    {

        $filesPaths = findFiles($folder, $findFileName);

        if (count($filesPaths) > 0) {
            return $filesPaths[0];
        }

        return false;
    }
}

if (!function_exists('saveRequestFile')) {
    function saveRequestFile($file, $name, $folder)
    {

        $title = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        Storage::disk('local')->putFileAs($folder, $file, "$name.$extension");

        return "$title.$extension";
    }
}

if (!function_exists('initDebugReports')) {
    function initDebugReports($evaluation, $data, $questions, $level)
    {
        if ($evaluation->questionnaire) {
            foreach ($questions as $question)
                if ($evaluation) {
                    $answer = QuestionnaireAnswer::where(['questionnair_id' => $evaluation->questionnaire_id, 'report_level' => $level, 'question_id' => $question->id,])->first();
                    if (empty($answer)) {
                        $answer = new  QuestionnaireAnswer();
                    }
                    $answer->fill($data);
                    $answer->question_id = $question->id;
                    $answer->answer_id = rand(30, 33);
                    $answer->accept = rand(0, 1);
                    $answer->final = 1;
                    $answer->questionnair_id = $evaluation->questionnaire_id;
                    $answer->report_level = $level;
                    $answer->evaluator_type = $evaluation->getEvaluatorType();
                    $answer->system = $evaluation->system;
                    $answer->created_by = Auth::user()->id;
                    $answer->save();
                    if ($question->subQuestions()->count() > 0) {
                        $data = (object)$data;
                        $data->report = $data->comment;
                        $data = (array)$data;
                        initDebugReports($evaluation, $data, $question->subQuestions, $level);
                    }
                }
        }
    }
}

if (!function_exists('initPreDebugReports')) {
    function initPreDebugReports($evaluation, $report, $questions)
    {
        if ($evaluation->questionnaire) {
            foreach ($questions as $question)
                if ($evaluation) {
                    $answer = QuestionnaireAnswer::where(['questionnair_id' => $evaluation->questionnaire_id, 'question_id' => $question->id, 'question_tool_id' => 0])->first();
                    if (empty($answer)) {
                        $answer = new  QuestionnaireAnswer();
                    }
                    $answer->value = rand(1, 4);
                    $answer->question_id = $question->id;
                    $answer->report = $report;
                    $answer->question_tool_id = 0;
                    $answer->final = 1;
                    $answer->questionnair_id = $evaluation->questionnaire_id;
                    $answer->system = 2;
                    $answer->created_by = Auth::user()->id;
                    $answer->save();
                }
        }
    }
}


if (!function_exists('responseFile')) {
    function responseFile($filePath, $fileName)
    {

        $file = Storage::disk('local')->get($filePath);
        $mimeType = Storage::disk('local')->mimeType($filePath);

        $seconds_to_cache = 3600;
        $ts = gmdate("D, d M Y H:i:s", time() + $seconds_to_cache) . " GMT";

        return response($file, 200, [
            'Content-Type' => $mimeType,
            'Expires' => "$ts",
            'Pragma' => 'cache',
            'Cache-Control' => "max-age=$seconds_to_cache",
            'Content-Disposition' => "inline; filename='$fileName'",
        ]);

        return false;
    }
}


if (!function_exists('sendMails')) {
    function sendMails($roles)
    {
        $users = User::select('users.id', 'users.email')
            ->leftJoin('model_has_roles', 'model_has_roles.model_id', '=', 'users.id')
            ->leftJoin('logs', 'logs.user_id', 'users.id')
            ->whereNull('logs.id')
            ->whereRemovedAndDone(0, 0)->groupBy('users.id', 'users.email')
            ->whereIn('model_has_roles.role_id', $roles)
            ->get();

        foreach ($users as $user) {
            echo "<p>" . $user->email . "</p>";
            $user = User::find($user->id);
            if ($user) {
                $token = Crypt::encryptString($user->id);
                $mail = new \App\Mail\SystemMail("NAQAAE Password Reset", "reset_password_email", ["token" => $token]);
                if ($mail->submit($user->email)) {
                    $user->done = 1;
                    $user->save();
                }
            }
        }
        dd('done');
    }
}


if (!function_exists('socialCheck')) {
    function socialCheck($user, $name, $token)
    {

        $plain = decryptData($token, env('WEBSITE_SHARED_KEY'), false);

        //For testing module
        if ($plain == $name) {
            return true;
        }

        return true;

        if ($name == "google") {
            $response = Http::get('https://www.googleapis.com/oauth2/v3/tokeninfo', [
                "access_token" => $token
            ]);
            $response = $response->json();
            if (empty($response) || isset($response['error_description']))
                return false;
            return true;
        } else if ($name == "facebook") {
            $response = Http::get("https://graph.facebook.com/me", [
                "access_token" => $token
            ]);
            $response = $response->json();
            if (empty($response) || isset($response['error']))
                return false;
            return true;
        } else if ($name == "linkedin") {
            $response = Http::get("https://api.linkedin.com/v2/me", [
                "oauth2_access_token" => $token
            ]);
            $response = $response->json();
            if (empty($response) || isset($response['serviceErrorCode']))
                return false;
            return true;
        }


        return false;
    }
}

if (!function_exists('autoSetup')) {
    function autoSetup()
    {
        if (Role::count() > 0) return true;

        $permissions = [
            ['name' => 'admin_system', 'guard_name' => 'web'],
            ['name' => 'show_he', 'guard_name' => 'web'],
            ['name' => 'access_he', 'guard_name' => 'web'],
            ['name' => 'admin_he', 'guard_name' => 'web'],
            ['name' => 'president_he', 'guard_name' => 'web'],
            ['name' => 'technical-committee_he', 'guard_name' => 'web'],
            ['name' => 'vice_he', 'guard_name' => 'web'],
            ['name' => 'show_fs', 'guard_name' => 'web'],
            ['name' => 'access_fs', 'guard_name' => 'web'],
            ['name' => 'admin_fs', 'guard_name' => 'web'],
            ['name' => 'show_sc', 'guard_name' => 'web'],
            ['name' => 'president_sc', 'guard_name' => 'web'],
            ['name' => 'technical-committee_sc', 'guard_name' => 'web'],
            ['name' => 'vice_sc', 'guard_name' => 'web'],
            ['name' => 'access_sc', 'guard_name' => 'web'],
            ['name' => 'admin_sc', 'guard_name' => 'web'],
            ['name' => 'show_tr', 'guard_name' => 'web'],
            ['name' => 'access_tr', 'guard_name' => 'web'],
            ['name' => 'admin_tr', 'guard_name' => 'web'],
            ['name' => 'show_ot', 'guard_name' => 'web'],
            ['name' => 'access_ot', 'guard_name' => 'web'],
            ['name' => 'admin_ot', 'guard_name' => 'web'],
            ['name' => 'show_cs', 'guard_name' => 'web'],
            ['name' => 'access_cs', 'guard_name' => 'web'],
            ['name' => 'admin_cs', 'guard_name' => 'web'],
            ['name' => 'show_management', 'guard_name' => 'web'],
            ['name' => 'access_management', 'guard_name' => 'web'],
            ['name' => 'admin_management', 'guard_name' => 'web'],
            ['name' => 'access_submissions', 'guard_name' => 'web'],
            ['name' => 'admin_submissions', 'guard_name' => 'web'],
            ['name' => 'show_submissions', 'guard_name' => 'web'],
            ['name' => 'edit_submissions', 'guard_name' => 'web'],
            ['name' => 'access_users', 'guard_name' => 'web'],
            ['name' => 'edit_users', 'guard_name' => 'web'],
            ['name' => 'admin_users', 'guard_name' => 'web'],
            ['name' => 'show_users', 'guard_name' => 'web'],
            ['name' => 'access_logs', 'guard_name' => 'web'],
            ['name' => 'admin_logs', 'guard_name' => 'web'],
            ['name' => 'access_roles', 'guard_name' => 'web'],
            ['name' => 'edit_roles', 'guard_name' => 'web'],
            ['name' => 'admin_roles', 'guard_name' => 'web'],
            ['name' => 'show_roles', 'guard_name' => 'web'],
            ['name' => 'access_binaries', 'guard_name' => 'web'],
            ['name' => 'show_binaries', 'guard_name' => 'web'],
            ['name' => 'edit_binaries', 'guard_name' => 'web'],
            ['name' => 'show_binaries', 'guard_name' => 'web'],
            ['name' => 'show_archive', 'guard_name' => 'web'],
            ['name' => 'access_archive', 'guard_name' => 'web'],
            ['name' => 'admin_archive', 'guard_name' => 'web'],
            ['name' => 'edit_archive', 'guard_name' => 'web'],
            ['name' => 'show_forms', 'guard_name' => 'web'],
            ['name' => 'access_forms', 'guard_name' => 'web'],
            ['name' => 'admin_forms', 'guard_name' => 'web'],
            ['name' => 'edit_forms', 'guard_name' => 'web'],
            ['name' => 'show_hotels', 'guard_name' => 'web'],
            ['name' => 'access_hotels', 'guard_name' => 'web'],
            ['name' => 'admin_hotels', 'guard_name' => 'web'],
            ['name' => 'edit_hotels', 'guard_name' => 'web'],
            ['name' => 'show_teams', 'guard_name' => 'web'],
            ['name' => 'access_teams', 'guard_name' => 'web'],
            ['name' => 'admin_teams', 'guard_name' => 'web'],
            ['name' => 'edit_teams', 'guard_name' => 'web'],
            ['name' => 'show_organizations', 'guard_name' => 'web'],
            ['name' => 'access_organizations', 'guard_name' => 'web'],
            ['name' => 'admin_organizations', 'guard_name' => 'web'],
            ['name' => 'edit_organizations', 'guard_name' => 'web'],
        ];

        Permission::insert($permissions);

        $role = Role::create(['name' => 'admin', 'guard_name' => 'web']);
        $role->syncPermissions(Permission::pluck('name')->toArray());


        $user = User::create([
            'email' => 'admin@naqaae.com',
            'mobile' => null,
            'password' => bcrypt('Naqaae@2020'),
        ]);
//        $user = User::find(56115);
        $user->syncRoles(['admin']);

        Artisan::call('cache:clear');

        return true;
    }
}

if (! function_exists('success')) {
    function success($data = null, $status = null , $message = null) {
        $reponse = [ 'message' => $message ,'status'=>$status, "data"=>$data];
        return response()->json($reponse);
    }
}

if (! function_exists('error')) {
    
    function error($code, $message = '', $errors = null) {

        $reponse = ['status'=>'fail', 'code'=>$code, 'message'=>$message, 'errors'=>$errors];
        return response()->json($reponse);        
    }
}

if (! function_exists('vrrors')) {
    function vrrors($validator) {
 
         $errors = [];
         $validators = $validator->messages()->get('*');
         foreach ($validators as $attribute => $messages) {
             foreach ($messages as $message) {
                 $error = (object)[];                
                 $error->$attribute = $message;
 
                 $errors[] = $error;
             }
         }
         $reponse = ['status'=>'fail', 'message'=>'', 'errors'=>$errors];
         
         return response()->json($reponse);
     }
 }

if (!function_exists('isEn')) {
    function isEn()
    {
        $locale = app()->getLocale();
        if (empty($locale) || $locale == "en")
            return true;
        return false;
    }
}

// if (!function_exists('error')) {
//     function error($error, $type, $message = null)
//     {
//         $data = [];
//         $data['error'] = $error;
//         $data['type'] = $type;
//         if (is_numeric($error)) $data['code'] = $error;
//         if ($message) $data['message'] = $message;
//         return response()->json($data, $type);
//     }
// }

if (!function_exists('can')) {
    function can($permission, $user = null)
    {
        $user = ($user) ? $user : auth()->user();
        if (empty($user)) return false;
        return $user->hasPermissionTo($permission, 'web');
    }
}

if (!function_exists('canAll')) {
    function canAll($permissions, $user = null)
    {
        $user = ($user) ? $user : auth()->user();
        if (empty($user)) return false;
        $permissions = collect($permissions)->flatten();
        foreach ($permissions as $permission) {
            if (!$user->hasPermissionTo($permission, 'web')) {
                return false;
            }
        }
        return true;
    }
}

if (!function_exists('formatWebsite')) {
    function formatWebsite($archives, $locale)
    {
        return $archives->transform(function ($archive) use ($locale) {
            $en_title = $archive->title;
            $short_name = $archive->short_name;
            $content_type = $archive->content_type;
            $archive = $archive->getLocale($locale);
            return [
                'id' => $archive->id,
                "en_title" => $en_title,
                "title" => $archive->title,
                "short_name" => $short_name,
                "type" => $archive->type,
                "content_type" => $content_type,
                "description" => $archive->description,
                "parent_id" => $archive->parent_id,
                "related_id" => $archive->related_id,
                "language" => $archive->language,
                "created_at" => $archive->created_at,
            ];
        });
    }
}

if (!function_exists('formatOneWebsite')) {
    function formatOneWebsite($archive, $locale)
    {
        if ($archive) {
            $en_title = $archive->title;
            $content_type = $archive->content_type;
            $short_name = $archive->short_name;
            $archive = $archive->getLocale($locale);
            return [
                'id' => $archive->id,
                "en_title" => $en_title,
                "title" => $archive->title,
                "short_name" => $short_name,
                "description" => $archive->description,
                "type" => $archive->type,
                "content_type" => $content_type,
                "parent_id" => $archive->parent_id,
                "related_id" => $archive->related_id,
                "language" => $archive->language,
                "created_at" => $archive->created_at,
            ];
        }
        return null;
    }
}

if (!function_exists('formatOneWebsiteImages')) {
    function formatOneWebsiteImages($archive, $locale)
    {
        if ($archive) {
            $en_title = $archive->title;
            $content_type = $archive->content_type;
            $short_name = $archive->short_name;
            $id = $archive->id;
            $archive = $archive->getLocale($locale);
            return [
                'id' => $id,
                "en_title" => $en_title,
                "title" => $archive->title,
                "short_name" => $short_name,
                "description" => $archive->description,
                "type" => $archive->type,
                "content_type" => $content_type,
                "parent_id" => $archive->parent_id,
                "related_id" => $archive->related_id,
                "language" => $archive->language,
                "created_at" => $archive->created_at,
            ];
        }
        return null;
    }
}

if (!function_exists('lang')) {
    function lang($name = null)
    {
        if (!app()->getLocale()) {
            return "en_" . $name;
        } else {
            return app()->getLocale() . "_" . $name;
        }

    }
}


if (!function_exists('formatWebsiteImages')) {
    function formatWebsiteImages($archives, $locale)
    {
        return $archives->transform(function ($archive) use ($locale) {
            $id = $archive->id;
            $en_title = $archive->title;
            $short_name = $archive->short_name;
            $content_type = $archive->content_type;
            $archive = $archive->getLocale($locale);
            return [
                'id' => $id,
                "en_title" => $en_title,
                "title" => $archive->title,
                "short_name" => $short_name,
                "type" => $archive->type,
                "content_type" => $content_type,
                "description" => $archive->description,
                "parent_id" => $archive->parent_id,
                "related_id" => $archive->related_id,
                "language" => $archive->language,
                "created_at" => $archive->created_at,
            ];
        });
    }
}


if (!function_exists('canAny')) {
    function canAny($permissions, $user = null)
    {
        $user = ($user) ? $user : auth()->user();
        if (empty($user)) return false;
        $permissions = collect($permissions)->flatten();
        foreach ($permissions as $permission) {
            if ($user->checkPermissionTo($permission, 'web')) {
                return true;
            }
        }
        return false;
    }
}

if (!function_exists('answerName')) {
    function answerName($answer_id)
    {
        switch ($answer_id) {
            case 30:
                return 'مستوفى';
            case 31:
                return 'مستوفى جزئيأ';
            case 32:
                return 'غير مستوفى';
            case 33:
                return 'لاينطبق';
            default:
                return '';
        }
    }
}

if (!function_exists('resolveSubmissions')) {
    function resolveSubmissions($submission)
    {
        $evaluation = \App\Models\Evaluation\Evaluation::whereSubmissionId($submission->id)->first();
        $following = ($submission->visit_type_id == 4);
        $reports = ($evaluation->questionnaire_id) ? DB::table('questionnaires_answers')->whereSystemAndQuestionnairId(2, $evaluation->questionnaire_id)->get()->toArray() : [];
        $hasDocuments = DB::table('evaluations_attachments')->where('eval_id', $evaluation->old_id)->count();
        $visit_done = ($submission->team && $submission->team->ends_at != null && $submission->team->ends_at != '' && (Carbon::parse($submission->team->ends_at)->diffInDays(Carbon::now()) > 1));
        if (($evaluation->decision || count($reports) > 2) && $visit_done) {
            $alerts = Alert::orderBy('order')->whereSystemAndTypeAndStatus(2, Alert::SUBMISSION_TYPE, Alert::APPROVED_TYPE)->whereNotNull('order')->where('actual_level', '<=', 6)->get();
        } elseif ($submission->team && count($submission->team->members) > 0) {
            $alerts = Alert::orderBy('order')->whereSystemAndTypeAndStatus(2, Alert::SUBMISSION_TYPE, Alert::APPROVED_TYPE)->whereNotNull('order')->where('actual_level', '<=', 5)->get();
        } elseif ($submission->team && $submission->team->ends_at != null && $submission->team->ends_at != '') {
            $alerts = Alert::orderBy('order')->whereSystemAndTypeAndStatus(2, Alert::SUBMISSION_TYPE, Alert::APPROVED_TYPE)->whereNotNull('order')->where('actual_level', '<=', 4)->get();
        } elseif ($hasDocuments > 2 || $following) {
            $alerts = Alert::orderBy('order')->whereSystemAndTypeAndStatus(2, Alert::SUBMISSION_TYPE, Alert::APPROVED_TYPE)->whereNotNull('order')->where('actual_level', '<=', 3)->get();
        } elseif ($submission->payment) {
            $alerts = Alert::orderBy('order')->whereSystemAndTypeAndStatus(2, Alert::SUBMISSION_TYPE, Alert::APPROVED_TYPE)->whereNotNull('order')->where('actual_level', '<=', 2)->get();
        } else {
            $alerts = Alert::orderBy('order')->whereSystemAndTypeAndStatus(2, Alert::SUBMISSION_TYPE, Alert::APPROVED_TYPE)->whereNotNull('order')->where('actual_level', '<=', 1)->get();
        }

        foreach ($alerts as $alert) {
            Alert::resolveAlert($submission, Alert::APPROVED_TYPE);
        }
    }
}

if (!function_exists('resolveEvaluations')) {
    function resolveEvaluations($evaluation)
    {
        $hasReport = ($evaluation->questionnaire_id) ? DB::table('questionnaires_answers')->where('system', 2)->where('questionnair_id', $evaluation->questionnaire_id)->count() : 0;
        $accreditation_approval = DB::table('accreditation_approval')->where('old_eval', $evaluation->old_id)->first();
        $technical_approval = DB::table('technical_approval')->where('old_eval', $evaluation->old_id)->first();

        if ($evaluation->decision) {
            $alerts = Alert::orderBy('order')->whereSystemAndTypeAndStatus(2, Alert::EVALUATION_TYPE, Alert::APPROVED_TYPE)->whereNotNull('order')->where('actual_level', '<=', 6)->get();
        } elseif ($accreditation_approval) {
            $alerts = Alert::orderBy('order')->whereSystemAndTypeAndStatus(2, Alert::EVALUATION_TYPE, Alert::APPROVED_TYPE)->whereNotNull('order')->where('actual_level', '<=', 4)->get();
        } elseif ($technical_approval) {
            $alerts = Alert::orderBy('order')->whereSystemAndTypeAndStatus(2, Alert::EVALUATION_TYPE, Alert::APPROVED_TYPE)->whereNotNull('order')->where('actual_level', '<=', 2)->get();
        } elseif ($hasReport > 1) {
            $alerts = Alert::orderBy('order')->whereSystemAndTypeAndStatus(2, Alert::EVALUATION_TYPE, Alert::APPROVED_TYPE)->whereNotNull('order')->where('actual_level', '=', 1)->take(1)->get();
        } else {
            $alerts = [];
        }

        foreach ($alerts as $alert) {
            if ($alert->evaluator_type == 3 && $technical_approval) {
                $date = $technical_approval->date;
                $user_id = $technical_approval->user_id;
            } elseif ($alert->evaluator_type == 2 && $accreditation_approval) {
                $date = $accreditation_approval->date;
                $user_id = 62194;
            } else {
                $date = null;
                $user_id = 62194;
            }
            Alert::resolveAlertEvaluation($evaluation, Alert::APPROVED_TYPE, $alert, $user_id);
        }

    }
}


if (!function_exists('generatePdfReport')) {
    function generatePdfReport($evaluation)
    {
        $evaluation = \App\Models\Evaluation\Evaluation::find($evaluation);
        $pdf = PDF::loadView('pdf.report', compact('evaluation'));
        return $pdf->stream($evaluation->submission->name . ".pdf");
    }
}

if (!function_exists('generateWordReport')) {
    function generateWordReport($evaluation_id)
    {
        $evaluation = \App\Models\Evaluation\Evaluation::find($evaluation_id);
        // $document_with_table = new \PhpOffice\PhpWord\PhpWord();
        // $section = $document_with_table->addSection();
        // $table = $section->addTable();
        // for ($r = 1; $r <= 8; $r++) {
        //     $table->addRow();
        //     for ($c = 1; $c <= 5; $c++) {
        //         $table->addCell(1750)->addText("Row {$r}, Cell {$c}");
        //     }
        // }

        // $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($document_with_table, 'Word2007');

        // $fullxml = $objWriter->getWriterPart('Document')->write();
        // $tablexml = preg_replace('/^[\s\S]*(<w:tbl\b.*<\/w:tbl>).*/', '$1', $fullxml);
        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('template.docx');
        $table = new \PhpOffice\PhpWord\Element\Table(array('borderSize' => 12, 'borderColor' => 'green', 'width' => 6000, 'unit' => \PhpOffice\PhpWord\SimpleType\TblWidth::TWIP));
        $table->addRow();
        $table->addCell(150)->addText('Cell A1');
        $table->addCell(150)->addText('Cell A2');
        $table->addCell(150)->addText('Cell A3');
        $table->addRow();
        $table->addCell(150)->addText('Cell B1');
        $table->addCell(150)->addText('Cell B2');
        $table->addCell(150)->addText('Cell B3');
        $templateProcessor->setComplexBlock('table', $table);
        // $templateProcessor->setValue('table', $tablexml);
        $questions = $evaluation->questionnaire->form->questions()->orderBy('order')->get();
        $templateProcessor->cloneBlock('parent', count($questions), true, true);
        $i = 1;
        foreach ($questions as $parent) {
            $inline = new  \PhpOffice\PhpWord\Element\TextRun();
            $answer = $parent->currentReport($evaluation->questionnaire_id)->first();
            $title = ($answer && $evaluation->lastLevel() != 4) ? digits($parent->title) . " ) " . answerName($answer->answer_id) . "(" : digits($parent->title);
            $inline->addText($title, array('bold' => true, 'color' => 'black', 'size' => 16));
            $inline->addTextBreak();
            $index = 1;
            foreach ($parent->subQuestions()->get() as $question) {
                $answer = $question->currentReport($evaluation->questionnaire_id)->first();
                $title = ($answer && $evaluation->lastLevel() != 4) ? digits($question->title) . " ) " . answerName($answer->answer_id) . "(" : digits($question->title);
                $inline->addText($title, array('bold' => true, 'color' => 'black', 'size' => 11));
                $inline->addTextBreak();
                $inline->addText($answer ? digits(preg_replace('/[^\x{0600}-\x{06FF}a-zA-Z0-9_ !@.-]/u', '', $answer->report)) : '', array('color' => 'black', 'size' => 11)); //  preg_replace('/[^\x{0600}-\x{06FF}A-Za-z0-9 !@#$%^&*().]/u','',  $answer->report)
                $inline->addTextBreak();
            }
            $templateProcessor->setComplexValue("title#$i", $inline);
            $i++;

        }
        $templateProcessor->setValue("date", formatDate(date('Y-m-d'), "j/n/Y"));
        $title = $evaluation->submission->name;
        $templateProcessor->saveAs("$title.docx");
        return response()->download(public_path("$title.docx"));
    }
}


if (!function_exists('generateSubmissionTask')) {
    function generateSubmissionTask()
    {
        $submissions = \App\Models\Submission::where('system', \App\Models\System::HE)->get();
        foreach ($submissions as $submission) {
            if (SubmissionNotes::where('submission_id', $submission->id)->count() == 0 && !$submission->hasDecision() && !$submission->requestFinish()) {
                if ($submission->team && count($submission->team->members) > 0) {
                    submissionTask($submission, SubmissionNotes::ACTIVE_TEAM_STATUS);
                } elseif ($submission->team && count($submission->team->members) == 0) {
                    submissionTask($submission, SubmissionNotes::ACTIVE_VISIT_STATUS);
                } elseif ($submission->uploadDocuments()) {
                    submissionTask($submission, SubmissionNotes::QUALITY_STATUS);
                } elseif ($submission->uploadFinance()) {
                    submissionTask($submission, SubmissionNotes::FINANCE_STATUS);
                } else {
                    submissionTask($submission, SubmissionNotes::FILL_INFO_STATUS);
                }
            } elseif (SubmissionNotes::where('submission_id', $submission->id)->count() == 0 && ($submission->hasDecision() || $submission->requestFinish())) {
                fillSubmissionTask($submission);
            }
        }

    }
}


if (!function_exists('updateTeamMember')) {
    function updateTeamMember()
    {
        $submissions = \App\Models\Submission::where('system', \App\Models\System::HE)->get();
        foreach ($submissions as $submission) {
            if ($submission->requestFinish() || $submission->hasDecision()) {
                if ($submission->team && count($submission->team->members) > 0) {
                    \App\Models\Team\TeamMember::where('team_id', $submission->team->id)->update(['excused' => \App\Models\Team\TeamMember::APPROVE_STATUS]);
                }
            }
        }

    }
}

if (!function_exists('generateEvaluationTask')) {
    function generateEvaluationTask()
    {
        $evaluations = \App\Models\Evaluation\Evaluation::where('system', \App\Models\System::HE)->get();
        foreach ($evaluations as $evaluation) {
            $evaluation->archive;
            if ($evaluation->decision && $evaluation->lastLevel() != EvaluationStatus::DIRECTORS_LEVEL) {
                fillEvaluationTask($evaluation);
            } else {
                evaluationTask($evaluation);
            }
        }

    }
}

if (!function_exists('generateEvaluationTaskWithApproval')) {
    function generateEvaluationTaskWithApproval()
    {
        $evaluations = \App\Models\Evaluation\Evaluation::where('system', \App\Models\System::HE)->get();
        foreach ($evaluations as $evaluation) {
            fillEvaluationTaskWithApproval($evaluation);
        }

    }
}

if (!function_exists('submissionTask')) {
    function submissionTask($submission, $currentStatus)
    {
        if ($currentStatus > SubmissionNotes::FILL_INFO_STATUS) {
            for ($i = 1; $i <= $currentStatus; $i++) {
                $task = Task::taskTranslate($i > SubmissionNotes::FILL_INFO_STATUS ? $i - 1 : SubmissionNotes::APPROVE_STATUS, $i);
                $newStatus = new SubmissionNotes();
                $newStatus->submission_id = $submission->id;
                $newStatus->user_id = Auth::user()->id;
                $newStatus->note = $task->message;
                $newStatus->contact = $task->contact;
                $newStatus->created_at = null;
                $newStatus->updated_at = $submission->created_at;
                $newStatus->message = $task->status;
                $newStatus->task_id = $task->task;
                $newStatus->status = ($i > SubmissionNotes::FILL_INFO_STATUS) ? $i - 1 : SubmissionNotes::APPROVE_STATUS;
                $newStatus->current_status = $i;
                $newStatus->parent_status = $i;
                $newStatus->save();
            }
            if ($currentStatus != SubmissionNotes::QUALITY_STATUS) {
                $task = Task::taskTranslate(SubmissionNotes::UPDATE_REQUIREMENT_STATUS, $currentStatus);
                $newStatus = new SubmissionNotes();
                $newStatus->submission_id = $submission->id;
                $newStatus->user_id = Auth::user()->id;
                $newStatus->note = $task->message;
                $newStatus->contact = $task->contact;
                $newStatus->created_at = null;
                $newStatus->updated_at = $submission->created_at;
                $newStatus->message = $task->status;
                $newStatus->task_id = $task->task;
                $newStatus->status = SubmissionNotes::UPDATE_REQUIREMENT_STATUS;
                $newStatus->current_status = $currentStatus;
                $newStatus->parent_status = $currentStatus;
                $newStatus->save();
            }
        } else {
            $task = Task::taskTranslate(SubmissionNotes::UPDATE_REQUIREMENT_STATUS, $currentStatus);
            $newStatus = new SubmissionNotes();
            $newStatus->submission_id = $submission->id;
            $newStatus->user_id = Auth::user()->id;
            $newStatus->created_at = null;
            $newStatus->updated_at = $submission->created_at;
            $newStatus->note = $task->message;
            $newStatus->contact = $task->contact;
            $newStatus->message = $task->status;
            $newStatus->task_id = $task->task;
            $newStatus->status = SubmissionNotes::UPDATE_REQUIREMENT_STATUS;
            $newStatus->current_status = $currentStatus;
            $newStatus->parent_status = $currentStatus;
            $newStatus->save();
        }
        $submission->update(['status' => $currentStatus]);
        return $newStatus;
    }
}

if (!function_exists('fillEvaluationTaskWithApproval')) {
    function fillEvaluationTaskWithApproval($evaluation)
    {
        for ($level = 1; $level <= EvaluationStatus::DIRECTORS_LEVEL; $level++) {
            if ($level > 0) {
                $approval = $evaluation->questionnaire ? $evaluation->questionnaire->lastApproval : null;
                resolveApprovalByLevel($approval, $level, $evaluation);
//                QuestionnaireAnswer::initQuestionnaireAnswer($evaluation->questionnaire_id , $level);
            }
        }
    }
}

if (!function_exists('resolveApprovalByLevel')) {
    function resolveApprovalByLevel($approval, $level, $evaluation)
    {
        $submission = $evaluation->submissionRelation;
        $team = $submission->team;
        $representative = $submission->representative();
        $lastLevel = $evaluation->lastLevel();
        if ($level === EvaluationStatus::INIT_LEVEL) {
            if ((($lastLevel > $level || $evaluation->decision) || ($lastLevel == $level && $approval && $approval->team_approve)) && $team) {
                foreach ($team->members as $member) {
                    resolveApproval($evaluation, $level, EvaluationApprovals::TEAM_TYPE, $member ? $member->id : null, null);
                }
            }
        } elseif ($level === EvaluationStatus::TECHNICAL_COMMITTEE_LEVEL) {
            if (($lastLevel > $level || $evaluation->decision) || ($lastLevel == $level && $approval && $approval->evaluator_approve)) {
                resolveApproval($evaluation, $level, EvaluationApprovals::COMMITTEE_TYPE, Auth::user()->id, null);
            }
        } elseif ($level === EvaluationStatus::TEAM_LEVEL) {
            if ((($lastLevel > $level || $evaluation->decision) || ($lastLevel == $level && $approval && $approval->team_approve)) && $team) {
                foreach ($team->members as $member) {
                    resolveApproval($evaluation, $level, EvaluationApprovals::TEAM_TYPE, $member ? $member->id : null, null);
                }
            }
            if (($lastLevel > $level || $evaluation->decision) || ($lastLevel == $level && $approval && $approval->vice_president_approved)) {
                resolveApproval($evaluation, $level, EvaluationApprovals::VICE_TYPE, Auth::user()->id, null);
            }
            if (($lastLevel > $level || $evaluation->decision) || ($lastLevel == $level && $approval && $approval->president_approve)) {
                resolveApproval($evaluation, $level, EvaluationApprovals::PRESIDENT_TYPE, Auth::user()->id, null);
            }

        } elseif ($level === EvaluationStatus::ORGANIZATION_LEVEL) {
            if (($lastLevel > $level || $evaluation->decision) || ($lastLevel == $level && $approval && $approval->organization_approve)) {
                resolveApproval($evaluation, $level, EvaluationApprovals::ORGANIZATION_TYPE, ($representative && isset($representative->id)) ? $representative->id : Auth::user()->id, null);
            }
            if (($lastLevel > $level || $evaluation->decision) || ($lastLevel == $level && $approval && $approval->accreditation_approved)) {
                resolveApproval($evaluation, $level, EvaluationApprovals::ACCREDITATION_TYPE, Auth::user()->id, null);
            }
        } elseif ($level === EvaluationStatus::FINAL_LEVEL) {
            if ((($lastLevel > $level || $evaluation->decision) || ($lastLevel == $level && $approval && $approval->team_approve)) && $team) {
                foreach ($team->members as $member) {
                    resolveApproval($evaluation, $level, EvaluationApprovals::TEAM_TYPE, $member ? $member->id : null, null);
                }
            }
            if (($lastLevel > $level || $evaluation->decision) || ($lastLevel == $level && $approval && $approval->vice_president_approved)) {
                resolveApproval($evaluation, $level, EvaluationApprovals::VICE_TYPE, Auth::user()->id, null);
            }
            if (($lastLevel > $level || $evaluation->decision) || ($lastLevel == $level && $approval && $approval->president_approve)) {
                resolveApproval($evaluation, $level, EvaluationApprovals::PRESIDENT_TYPE, Auth::user()->id, null);
            }
        } elseif ($level === EvaluationStatus::DIRECTORS_LEVEL) {
            if ($evaluation->decision) {
                resolveApproval($evaluation, $level, EvaluationApprovals::MANAGER_TYPE, Auth::user()->id, null);
            }
        }
    }
}

if (!function_exists('resolveApproval')) {
    function resolveApproval($evaluation, $level, $type, $user, $date)
    {

        $message = (object)EvaluationStatus::evaluationMessage(($level == EvaluationStatus::INIT_LEVEL || $level == EvaluationStatus::DIRECTORS_LEVEL) ? $level : $level + 1, $evaluation);
        $newApproval = new EvaluationApprovals();
        $newApproval->evaluation_id = $evaluation->id;
        $newApproval->user_id = $user;
        $newApproval->note = $message->message;
        $newApproval->created_at = $date;
        $newApproval->message = $message->status_message;
        $newApproval->level = $level;
        $newApproval->type = $type;
        $newApproval->status = EvaluationApprovals::APPROVE_STATUS;
        $newApproval->save();
//        if (EvaluationStatus::getStatus($level, $evaluation->id) == EvaluationApprovals::APPROVE_STATUS && $level != EvaluationStatus::INIT_LEVEL &&  $level != EvaluationStatus::DIRECTORS_LEVEL){
//            $newApproval->final = 1;
//            $newApproval->save();
//        }
        if ($level == $evaluation->lastLevel() && EvaluationStatus::evaluationMessage($level, $evaluation)) {
            $level = (EvaluationStatus::getStatus($level, $evaluation->id) == EvaluationApprovals::APPROVE_STATUS) ? $level + 1 : $level;
            if (EvaluationStatus::evaluationMessage($level, $evaluation)) {
                $newStatus = EvaluationStatus::where(['evaluation_id' => $evaluation->id, 'level' => $level])->first();
                if (empty($newStatus)) {
                    $newStatus = new EvaluationStatus();
                }
                $message = (object)EvaluationStatus::evaluationMessage($level, $evaluation);
                $newStatus->evaluation_id = $evaluation->id;
                $newStatus->user_id = Auth::user()->id;
                $newStatus->note = $message->message;
                $newStatus->message = $message->status_message;
                $newStatus->contact = $message->contact;
                $newStatus->task_id = $evaluation->decision ? 0 : $message->task;
                $newStatus->level = $level;
                $newApproval->created_at = $date;
                $newStatus->status = EvaluationApprovals::APPROVE_STATUS;
                $newStatus->save();
                $evaluation->report_level = $level;
                $evaluation->save();
            }
        }
    }
}


if (!function_exists('fillSubmissionTask')) {
    function fillSubmissionTask($submission)
    {
        for ($i = 1; $i <= 6; $i++) {
            $task = Task::taskTranslate($i > SubmissionNotes::FILL_INFO_STATUS ? $i - 1 : SubmissionNotes::APPROVE_STATUS, ($i > SubmissionNotes::ACTIVE_TEAM_STATUS) ? SubmissionNotes::ACTIVE_TEAM_STATUS : $i);
            $newStatus = new SubmissionNotes();
            $newStatus->submission_id = $submission->id;
            $newStatus->user_id = Auth::user()->id;
            $newStatus->note = $task->message;
            $newStatus->contact = $task->contact;
            $newStatus->created_at = null;
            $newStatus->updated_at = $submission->created_at;
            $newStatus->message = $task->status;
            $newStatus->task_id = $task->task;
            $newStatus->status = ($i > SubmissionNotes::FILL_INFO_STATUS) ? $i - 1 : SubmissionNotes::APPROVE_STATUS;
            $newStatus->current_status = $i;
            $newStatus->parent_status = $i;
            $newStatus->save();
        }
        $task = Task::taskTranslate(SubmissionNotes::APPROVE_STATUS, SubmissionNotes::FINAL_APPROVE_STATUS);
        $newStatus = new SubmissionNotes();
        $newStatus->submission_id = $submission->id;
        $newStatus->user_id = Auth::user()->id;
        $newStatus->note = $task->message;
        $newStatus->contact = $task->contact;
        $newStatus->created_at = null;
        $newStatus->updated_at = $submission->created_at;
        $newStatus->message = $task->status;
        $newStatus->task_id = $task->task;
        $newStatus->status = SubmissionNotes::FINAL_APPROVE_STATUS;
        $newStatus->current_status = SubmissionNotes::FINAL_APPROVE_STATUS;
        $newStatus->parent_status = SubmissionNotes::FINAL_APPROVE_STATUS;
        $newStatus->save();
        SubmissionNotes::initStatus($submission);
        $submission->update(['status' => SubmissionNotes::FINAL_APPROVE_STATUS]);
        return $newStatus;
    }
}

if (!function_exists('evaluationTask')) {
    function evaluationTask($evaluation)
    {
        $level = $evaluation->lastLevel();
        if ($level > 0 && !$evaluation->decision) {
            $newStatus = EvaluationStatus::where(['evaluation_id' => $evaluation->id, 'level' => $level])->first();
            if (empty($newStatus)) {
                $newStatus = new EvaluationStatus();
            }
//        $note = Task::taskTranslate(null, null, $level);
            $message = (object)EvaluationStatus::evaluationMessage($level, $evaluation);
            $newStatus->evaluation_id = $evaluation->id;
            $newStatus->user_id = Auth::user()->id;
            $newStatus->note = $message->message;
            $newStatus->message = $message->status_message;
            $newStatus->contact = $message->contact;
            $newStatus->task_id = $message->task;
            $newStatus->updated_at = $evaluation->created_at;
            $newStatus->level = $level;
            $newStatus->status = EvaluationApprovals::APPROVE_STATUS;
            $newStatus->save();
            $evaluation->report_level = $level;
            $evaluation->save();
            return $newStatus;
        }

        if ($level == EvaluationStatus::DIRECTORS_LEVEL && $evaluation->decision) {
            $newStatus = EvaluationStatus::where(['evaluation_id' => $evaluation->id, 'level' => $level])->first();
            if ($newStatus) {
                $newStatus->task_id = 0;
                $newStatus->save();
            }
        }
    }
}

if (!function_exists('resolveDocuments')) {
    function resolveDocuments($documents, $category, $parent_id = null)
    {
        $documents = is_array($documents) ? $documents : [$documents];
        foreach ($documents as $document) {
            $document = (object)$document;
            $ePDoc = new \App\Models\Evaluation\EvaluationDocuments();
            $ePDoc->title = $document->title;
            $ePDoc->type = $document->type == 'folder' ? 1 : 0;
            $ePDoc->mandatory = (isset($document->mandatory) && $document->mandatory) ? 1 : 0;
            $ePDoc->parent_id = $parent_id ? $parent_id : 0;
            $ePDoc->category = $category;
            $ePDoc->save();
            if (isset($document->documents) && $document->documents) {
                foreach ($document->documents as $document) {
                    $eCDoc = new \App\Models\Evaluation\EvaluationDocuments();
                    $eCDoc->title = $document->title;
                    $eCDoc->type = $document->type == 'folder' ? 1 : 0;
                    $eCDoc->mandatory = (isset($document->mandatory) && $document->mandatory) ? 1 : 0;
                    $eCDoc->short_name = $document->short_name;
                    $eCDoc->parent_id = $ePDoc->id;
                    $eCDoc->description = isset($document->description) ? $document->description : null;
                    $eCDoc->category = $category;
                    $eCDoc->save();
                }
            }
            if (isset($document->folders) && $document->folders) {
                resolveDocuments($document->folders, $category, $ePDoc->id);
            }
        }
    }
}

if (!function_exists('fixEvaluationDocuments')) {
    function fixEvaluationDocuments($evaluation_id)
    {
        $documents = \Illuminate\Support\Facades\DB::table('resolve_documents')
            ->join('evaluations_documents', 'evaluations_documents.id', '=', 'resolve_documents.document_id')
            ->select('resolve_documents.short_name', 'evaluations_documents.category', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->whereRaw("evaluation_id = $evaluation_id")
            ->GroupBy('resolve_documents.short_name', 'evaluations_documents.category')
            ->having('count', '>', 1)->get();
        foreach ($documents as $document) {
            $inners = \Illuminate\Support\Facades\DB::table('resolve_documents')
                ->select('resolve_documents.short_name', 'resolve_documents.path', 'resolve_documents.document_id', 'resolve_documents.name')
                ->where('resolve_documents.evaluation_id', $evaluation_id)
                ->where('resolve_documents.short_name', $document->short_name)->get();
            $evaluation = \App\Models\Evaluation\Evaluation::find($evaluation_id);
            $submission = $evaluation->submissionRelation;

            if ($document->category == 1) {
                $archive = $submission->archive->findChildByShortName($document->short_name);
            } elseif ($document->category == 2) {
                $archive = $submission->archive->findChildByShortName('TEAM_DOCUMENT');
                $archive = ($archive) ? $archive->findChildByShortName($document->short_name) : null;
            } else {
                $archive = $evaluation->archive->findChildByShortName('MAIN_DOCUMENT');
                $archive = ($archive) ? $archive->findChildByShortName($document->short_name) : null;
                if (!$archive) {
                    $archive = $evaluation->archive->findChildByShortName('ADDITION_DOCUMENT');
                    $archive = ($archive) ? $archive->findChildByShortName($document->short_name) : null;
                }
            }
            if ($archive) {
                $zipPath = "/temp_folders/$archive->id.zip";
                $finalZipPath = storage_path('app') . $zipPath;
                $zip = new ZipArchive;
                if (!$zip->open($finalZipPath, ZipArchive::CREATE))
                    dd('errorf');
                $i = 0;
                foreach ($inners as $inner) {
                    if ($archive) {
                        $i++;
                        $extension = pathinfo($inner->path, PATHINFO_EXTENSION);
                        $destPath = "$inner->name ($i).$extension";  //str_replace('\Eval\\','',$inner->path);
                        $source = storage_path('app') . "/HE$inner->path";
                        $source = str_replace('\\', '/', $source);
                        $status = $zip->addFile($source, $destPath);
                        echo "<p> archive:" . $archive->id . '/' . "[$document->category]" . "document:" . $inner->short_name . '/' . $inner->path . "/" . $status . "<p>";
                    }
                }
                $zip->close();
                $archive->updateLocalDocument($zipPath);
                Storage::disk('local')->delete($zipPath);

            }
        }
//        dd($documents);
    }
}

if (!function_exists('submissionTeamTask')) {
    function submissionTeamTask($submission)
    {
        $teamApproved = $submission->team ? $submission->team->isApproved() : false;
        if ($submission->status == SubmissionNotes::ACTIVE_TEAM_STATUS && $teamApproved) {
            $task = (object)Task::TEAM_APPROVE_MESSAGE;
            $newStatus = new SubmissionNotes();
            $newStatus->submission_id = $submission->id;
            $newStatus->user_id = 62194;
            $newStatus->created_at = null;
            $newStatus->updated_at = $submission->created_at;
            $newStatus->note = $task->message;
            $newStatus->contact = $task->contact;
            $newStatus->message = $task->status;
            $newStatus->task_id = $task->task;
            $newStatus->status = SubmissionNotes::UPDATE_REQUIREMENT_STATUS;
            $newStatus->current_status = SubmissionNotes::ACTIVE_TEAM_STATUS;
            $newStatus->parent_status = SubmissionNotes::ACTIVE_TEAM_STATUS;
            $newStatus->save();
        }
    }
}

if (!function_exists('fillEvaluationTask')) {
    function fillEvaluationTask($evaluation)
    {
        for ($level = $evaluation->lastLevel(); $level <= EvaluationStatus::DIRECTORS_LEVEL; $level++) {
            if ($level > 0) {
                $newStatus = EvaluationStatus::where(['evaluation_id' => $evaluation->id, 'level' => $level])->first();
                if (empty($newStatus)) {
                    $newStatus = new EvaluationStatus();
                }
                $message = (object)EvaluationStatus::evaluationMessage($level, $evaluation);
                $newStatus->evaluation_id = $evaluation->id;
                $newStatus->user_id = Auth::user()->id;
                $newStatus->note = $message->message;
                $newStatus->message = $message->status_message;
                $newStatus->contact = $message->contact;
                $newStatus->task_id = ($level != EvaluationStatus::DIRECTORS_LEVEL) ? $message->task : 0;
                $newStatus->level = $level;
                $newStatus->updated_at = $evaluation->created_at;
                $newStatus->status = EvaluationApprovals::APPROVE_STATUS;
                $newStatus->save();
                $evaluation->report_level = $level;
                $evaluation->save();
                QuestionnaireAnswer::initQuestionnaireAnswer($evaluation->questionnaire_id, $level);
            }
        }
    }
}

if (!function_exists('resolveEvaluationDocuments')) {
    function resolveEvaluationDocuments()
    {
        $documents = \Illuminate\Support\Facades\DB::table('resolve_documents')->get();
        foreach ($documents as $document) {
            $attach = \App\Models\Evaluation\EvaluationDocuments::find($document->document_id);
            $eval = \App\Models\Evaluation\Evaluation::find($document->evaluation_id);
            if ($eval) {
                $submission = $eval->submissionRelation;
                if ($attach->category == 1) {
                    $title = $attach->title . "(" . $submission->organization->name . ")($submission->id)";
                    $title = (strlen($title) > 130) ? $attach->title . "($submission->id)" : $title;
                    $title = mb_convert_encoding($title, 'UTF-8', 'UTF-8');
                    $submission->archive->addLocalDocument("HE/$document->path", $title, $attach, false, $submission->created_at);
                } elseif ($attach->category == 2) {
                    $parent = \App\Models\Evaluation\EvaluationDocuments::find($attach->parent_id);
                    $folder = $parent ? $parent->title : null;
                    $title = $attach->title . "(" . $submission->organization->name . ")($submission->id)";
                    $title = (strlen($title) > 130) ? $attach->title . "($submission->id)" : $title;
                    $title = mb_convert_encoding($title, 'UTF-8', 'UTF-8');
                    $submission->archive->addLocalDocument("HE/$document->path", $title, $attach, true, $submission->created_at);
                } else {
                    if (($attach->category = 3 && $submission->evaluation_type == \App\Models\Evaluation\Evaluation::PROGRAM_TYPE) || ($attach->category = 4 && $submission->evaluation_type == \App\Models\Evaluation\Evaluation::ORGANIZATION_TYPE)) {
                        $parent = \App\Models\Evaluation\EvaluationDocuments::find($attach->parent_id);
                        $folder = $parent ? $parent->title : null;
                        $title = $attach->title . "(" . $submission->organization->name . ")($submission->id)";
                        $title = (strlen($title) > 130) ? $attach->title . "($submission->id)" : $title;
                        $title = mb_convert_encoding($title, 'UTF-8', 'UTF-8');
                        $eval->archive->addLocalDocument("HE/$document->path", $title, $attach, true, $submission->created_at);
                    }
                }
            }
        }
    }
}

if (!function_exists('PreSubmissionDocuments')) {
    function PreSubmissionDocuments()
    {
        $evaluations = DB::table('evaluations')->select('evaluations.id')->where('system', 2)->where('done', 0)->get();
        foreach ($evaluations as $evaluation) {
            $evaluation = \App\Models\Evaluation\Evaluation::find($evaluation->id);
            $documents = DB::table('evaluations_attachments')
                ->leftJoin('pre_evaluation_document', 'pre_evaluation_document.id', 'evaluations_attachments.attach_id')
                ->leftJoin('attachments', 'attachments.old_code_sc', 'evaluations_attachments.code')
                ->select('attachments.path', 'attachments.old_code_sc',  'pre_evaluation_document.name', 'pre_evaluation_document.id', 'pre_evaluation_document.short_name', 'pre_evaluation_document.category')
                ->where('evaluations_attachments.eval_id', $evaluation->old_id)->get();
            if(count($documents) > 0){
                $documents = collect($documents)->groupBy(['name']);
                $submission = Submission::whereOldEvalId($evaluation->old_id)->first();
                $organization = \App\Models\Organization\Organization::select('lookup_school_stages.school_stage_type_id')
                    ->leftJoin('lookup_school_stages', 'lookup_school_stages.id', '=', 'organizations.stage_type_id')
                    ->where('organizations.id', $submission->organization_id)->first();

                $allowDocument = [];
                if($organization && $submission){
                    $allowDocument = DB::table('visit_stage_document')->where('visit_type_id', $submission->visit_type_id)
                        ->where('stage_type_id', $organization->school_stage_type_id)->pluck('document_id')->toArray();
                }

                foreach ($documents as $name => $document) {
                    // $name = (strlen($name) > 200 )? substr($name , 0 ,200).'...' : $name;
                    // dd($name);
                    if (count($document) > 1) {
                        $zipPath = "/temp_folders/$evaluation->id.zip";
                        $finalZipPath = storage_path('app') . $zipPath;
                        $zip = new ZipArchive;
                        if (!$zip->open($finalZipPath, ZipArchive::CREATE))
                            dd('errorf');
                        $i = 0;
                        foreach ($document as $inner) {
                            $i++;
                             $extension = pathinfo("/SC$inner->path", PATHINFO_EXTENSION); // pro
//                            $extension = pathinfo('SC/temp.txt', PATHINFO_EXTENSION); // test
                            $destPath = "$inner->name ($i).$extension";
                            $source = storage_path('app') . "/SC$inner->path"; // pro
//                            $source = storage_path('app') . "/SC/temp.txt"; // test
                            $source = str_replace('\\', '/', $source);
                            if (file_exists($source) && is_file($source)){
                                $status = $zip->addFile($source, $destPath);
                            }
                        }
                        $zip->close();
                        // $name = (strlen($name) > 200) ? substr($name,0,200).'...' : $name;
                        if (in_array($document[0]->id , $allowDocument)) {
                            $submission->archive->addLocalDocument($zipPath, $name, $document[0], false, $submission->created_at);
                        }else{
                            $evaluation->archive->addLocalDocument($zipPath, $name, $document[0], false, $submission->created_at);
                        }

                        Storage::disk('local')->delete($zipPath);
                    } else {
                        if ($document[0]) {
                            $document = $document[0];
                            $source = storage_path('app') . "/SC$document->path"; // pro
                            $source = str_replace('\\', '/', $source);
                            // $name = (strlen($name) > 200) ? substr($name,0,200).'...' : $name;
                            if (in_array($document->id , $allowDocument)) {
                                if (file_exists($source) && is_file($source)) {
                                    $submission->archive->addLocalDocument("SC/$document->path", $name, $document, false, $submission->created_at);
                                }// pro
//                                $submission->archive->addLocalDocument("SC/temp.txt", $name, $document, false, $submission->created_at); // test
                            }else{
                                if (file_exists($source) && is_file($source)) {
                                    $evaluation->archive->addLocalDocument("SC/$document->path", $name, $document, false, $submission->created_at);
                                }// pro
//                              $evaluation->archive->addLocalDocument("SC/temp.txt", $name, $document, false, $submission->created_at); // test
                            }
                        }
                    }
                }
            }
            $evaluation->done = 1;
            $evaluation->save();
            d("evaluation => $evaluation->id , submission => $evaluation->submission_id");

        }

    }
}


if (!function_exists('sendNotification')) {
    function sendNotification($users, $message, $title, $type, $details, $app, $businessID, $locationID, $category)
    {

        $data = (object)[];
        $data->type = $type;
        $data->app = $app;
        $data->click_action = 'FLUTTER_NOTIFICATION_CLICK';
        $data->details = $details;
        $data->business_id = $businessID;
        $data->location_id = $locationID;
        $data->category = $category;

        $tokens = [];
        if (is_array($users)) {
            foreach ($users as $user) {
                dbg($user->id, "USER Notification");
                $tokens = array_merge($tokens, $user->devices()->pluck('token')->toArray());

                $notification = new Notification();
                $notification->user_id = $user->id;
                $notification->business_id = $businessID;
                $notification->location_id = $locationID;
                $notification->type = $type;
                $notification->category = $category;
                $notification->title = $title;
                $notification->message = $message;
                $notification->data = json_encode($data, JSON_UNESCAPED_UNICODE);
                $notification->save();
            }
        }

        $count = 0;

        foreach ($tokens as $token) {
            $parameters = [
                "to" => $token,
                "collapse_key" => "type_a",
                "notification" => [
                    "body" => $message,
                    "title" => $title,
                ],
                "data" => $data,
                "click_action" => "FLUTTER_NOTIFICATION_CLICK",
            ];

            $key = null;
            switch ($app) {
                case "booking":
                    $key = env('NOTIFICATIONS_KEY_BOOKING', NULL);
                    break;
                case "queue":
                    $key = env('NOTIFICATIONS_KEY_QUEUE', NULL);
                    break;
            }
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => "key=$key",
            ])->post('https://fcm.googleapis.com/fcm/send', $parameters);

            if ($response->getStatusCode() == 200) {
                $count++;
            }
        }

        return $count;
    }
}

if (!function_exists('cleanPath')) {
    function cleanPath($path)
    {
        $path = str_replace("\\", "/", $path);
        $path = trim($path, "/");
        while (strrpos($path, "//") !== false) {
            $path = str_replace("//", "/", $path);
        }
        return $path;
    }
}

if (!function_exists('sendSMS')) {
    function sendSMS($to, $body)
    {

        $from = env('SMS_APP');
        $userID = env('SMS_UID');
        $password = env('SMS_PWD');

        $curl = curl_init();
        $message = array('messages' => array(array('body' => $body,
            'to' => '{{' . $to . '}}',
            'from' => $from
        )));

        $token = base64_encode("$userID:$password");

        curl_setopt_array($curl,
            array(
                CURLOPT_URL => 'https://rest.clicksend.com/v3/sms/send',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_TIMEOUT => 30000,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => json_encode($message),
                CURLOPT_HTTPHEADER => array(
                    'Content-Type: application/json',
                    "Authorization: Basic $token"
                ),
            ));

        $response = curl_exec($curl);
        $err = curl_error($curl);
        if (!empty($err))
            return false;
        curl_close($curl);

        return json_decode($response);
    }
}

