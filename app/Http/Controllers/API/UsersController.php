<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\System\System;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
class UsersController extends Controller
{
    public function profile(Request $request)
    {
        $user = Auth::user();
        $details = $user;
        $archive = $user->archive->findChildByShortName('PERSONAL_ID_CARD');
        $details->photo = $archive ? route('secure_download_file', ['sid' => $archive->secret()]) : null;
        return success($details,System::HTTP_OK);
    }

    public function index()
    {
        if(!can('access_users'))
        {
            return error(401,'message','errors');
        }
        return success(User::all(),System::HTTP_OK);
    }

    public function edit(Request $request)
    {
        $user = Auth::user();
        $validations = [
            'national_id' => 'required|unique:users,national_id' . (($user) ? ",$user->id," : ""),
            'mobile' => 'required|unique:users,mobile' . (($user) ? ",$user->id," : ""),
        ];

        $messages = [
            'national_id.unique' => (checkLanguage($request->header('lang')) == 'ar') ?'الرقم القومى مسجل فى قاعدة البيانات':'national id if already exist',
            'mobile.unique' =>(checkLanguage($request->header('lang')) == 'ar') ? 'رقم التليفون  مسجل فى قاعدة البيانات ':'mobile number is already exist'
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

        $user = Auth::user();
        $user = User::find($user->id);
        $inputs = $request->except(['email']);
        if($request->has('password'))
        {
            $inputs['password'] = bcrypt($request->password);
        }
        $user->fill($inputs);
        $user->save();

        if(checkLanguage($request->header('lang')) == 'en')
        {
            return success($user->data(System::DATA_LIST),System::HTTP_OK,'updated data successfully');
        }else{
            return success($user->data(System::DATA_LIST),System::HTTP_OK,'تم تعديل البيانات بنجاح');
        }
    }

    public function changePassword(Request $request)
    {
        $validations = [
            'password' => [
                'required',
                // 'string',
                'min:6',             // must be at least 10 characters in length
                // 'regex:/[a-z]/',      // must contain at least one lowercase letter
                // 'regex:/[A-Z]/',      // must contain at least one uppercase letter
                // 'regex:/[0-9]/',      // must contain at least one digit
                // 'regex:/[@$!%*#?&]/', // must contain a special character
            ],
        ];

        $messages = [
            'password.required' => (checkLanguage($request->header('lang')) == 'ar') ?'تاكد من الباسورد':'check your password',
            'password.min' => (checkLanguage($request->header('lang')) == 'ar') ?'    يجب ان يكون الباسورد مكون من 6 حروف  ':'password must at least 6 character and symbol',   

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

        $user = Auth::user();
        $user->password = bcrypt($request->password);
        $user->save();
        if(checkLanguage($request->header('lang')) == 'ar')
        {
            return success(null,200,'تم تغير الباسورد بنجاح');
        }else{
            return success(null,200,'password change succesdfully');

        }   
    }


}
