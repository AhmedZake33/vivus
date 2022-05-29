<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\Location;
use App\models\System\System;


class LocationsController extends Controller
{
    public $home = 1;
    public $work = 2;
    public $office = 2;

    public function create(Request $request)
    {

        $validations = [
            "lat"=>"required",
            "lng"=>"required",
            "type"=>"required",
            "city"=>"required",
            "street"=>"required",
            "country"=>"required"
        ];

        $validator = Validator::make($request->all(), $validations);
        if ($validator->fails())
        return response()->json(['error' => implode(" - ", $validator->errors()->all()) . 'برجاء المراجعة '], 500);
        $data = $request->all();
        $data['user_id'] = Auth::user()->id;
        $location = Location::create($data);
        $location->save();
        return success($location);
    }

    public function Locations()
    {
        $user = Auth::user();
        $locations = $user->locations;
        foreach($locations as $location){
            if($location->type == $this->home){
                $location->type = "Home";
            }elseif($location->type == $this->work){
                $location->type = "Work";
            }else{
                $location->type = "Office";
            }
        }
        return success($locations  , system::HTTP_OK  );
    }
}
