<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Point;
use App\Models\User;
use App\Models\System\System;
use Illuminate\Support\Facades\Validator;


class PointsController extends Controller
{
    public function points(Request $request)
    {
        $points = Point::orderBy('points','desc')->get();
        if(checkLanguage($request->header('lang')) == 'en')
        {
            return success($points,200,'success');
        }else{
            return success($points,200,'تم بنجاح');
        }
    }

    public function edit(Request $request , User $user)
    {

        $validations = [
            "points" => 'required|numeric'
        ];

        $messages = [
            'points.required' => (checkLanguage($request->header('lang')) == 'ar') ?'   برجاء ادخال قيمه النقاط  ':'please insert points',
            'points.numeric' =>(checkLanguage($request->header('lang')) == 'ar') ? 'النقاط لابد ان تكون ارقام ':' points must be numbers'
        ];


        $validator = Validator::make($request->all(), $validations, $messages);
        if ($validator->fails())
        {
            if(checkLanguage($request->header('lang')) == 'ar')
            {
                return success(null,500,implode(" - ", $validator->errors()->all()));
            }else{
                return success(null,500,implode(" - ", $validator->errors()->all()));

            }   
        }


       $point =  Point::where('user_id',$user->id)->first();
       $point->points = $point->points + $request->points;
       $point->save();
       if(checkLanguage($request->header('lang')) == 'ar')
       {
           return success($point,200,'تم اضافه النقاط بنجاح');
       }else{
           return success($point,200,'points add successfully');

       }  
    }

    public function add(Request $request)
    {

        $validations = [
            "points" => 'required|numeric',
            "user_id" =>'required'
        ];

        $messages = [
            'points.required' => (checkLanguage($request->header('lang')) == 'ar') ?'   برجاء ادخال قيمه النقاط  ':'please insert points',
            'points.numeric' =>(checkLanguage($request->header('lang')) == 'ar') ? 'النقاط لابد ان تكون ارقام ':' points must be numbers',
            'user_id.required' =>(checkLanguage($request->header('lang')) == 'ar') ? ' لابد من ادخال المستخدم   ':' user must be added'
        ];

        $validator = Validator::make($request->all(), $validations, $messages);
        if ($validator->fails())
        {
            if(checkLanguage($request->header('lang')) == 'ar')
            {
                return success(null,500,implode(" - ", $validator->errors()->all()));
            }else{
                return success(null,500,implode(" - ", $validator->errors()->all()));

            }   
        }

        $inputs = $request->all();
        $point = new Point();
        $point->fill($inputs);
        $point->save();
       
        if(checkLanguage($request->header('lang')) == 'ar')
        {
            return success($point,200,'تم اضافه النقاط بنجاح');
        }else{
            return success($point,200,'points add successfully');
 
        }  


    }


}
