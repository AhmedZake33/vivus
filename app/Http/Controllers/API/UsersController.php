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

        if(checkLanguage($request->header('lang')) == 'en')
        {
            return success($user->data(System::DATA_DETAILS),System::HTTP_OK,'success');
        }else{
            return success($user->data(System::DATA_DETAILS),System::HTTP_OK,'تم بنجاح');
        }
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
                return success(null,1010,implode(" - ", $validator->errors()->all()));
            }else{
                return success(null,1010,implode(" - ", $validator->errors()->all()));

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

    public function verifiy(Request $request)
    {
        $user =  Auth::user();

        if($request->code == $user->verification_code)
        {
            $user->verification_code = null;
            $user->save();
            if(checkLanguage($request->header('lang')) == 'en')
            {
                return success($user->data(System::DATA_LIST),System::HTTP_OK,'register completed successfully');
            }else{
                return success($user->data(System::DATA_LIST),System::HTTP_OK,'تم التسجيل بنجاح');
            }
        }else if ($user->verification_code == null){
            if(checkLanguage($request->header('lang')) == 'en')
            {
                return success($user->data(System::DATA_LIST),System::HTTP_OK,'register completed successfully');
            }else{
                return success($user->data(System::DATA_LIST),System::HTTP_OK,'تم التسجيل بنجاح');
            }
        }

        if(checkLanguage($request->header('lang')) == 'en')
        {
            return success([],1002,'  error in verifiy email');
        }else{
            return success([],1002,'حدث خطأ اثناء التفعيل');
        }
    }

    public function forget(Request $request)
    {
        $user = User::whereMobile($request->mobile)->first();
        if($user)
        {
            $user->forget_code = 1234;
            $user->save();
        }
        if(checkLanguage($request->header('lang')) == 'en')
        {
            return success([],System::HTTP_OK,' forget code sent to mobile');
        }else{
            return success([],System::HTTP_OK,'تم ارسال كود التفعيل الي الموبايل');
        }
    }

  
    public function changePassword(Request $request)
    {
        $validations = [
           'new_password'=>'required|min:6',
           'confirm_password'=>'required|min:6|same:new_password',
        ];

        $messages = [
            'new_password.required' => (checkLanguage($request->header('lang')) == 'ar') ?'تاكد من الباسورد':'check your password',
            'new_password.min' => (checkLanguage($request->header('lang')) == 'ar') ?'    يجب ان يكون الباسورد مكون من 6 حروف  ':'password must at least 6 character and symbol',   
            'confirm_password.required' => (checkLanguage($request->header('lang')) == 'ar') ?'تاكد من الباسورد':'check your password',
            'confirm_password.min' => (checkLanguage($request->header('lang')) == 'ar') ?'    يجب ان يكون الباسورد مكون من 6 حروف  ':'password must at least 6 character and symbol',   
            'confirm_password.same' => (checkLanguage($request->header('lang')) == 'ar') ?'    يجب ان يكون تاكيد الباسورد يساوي الباسورد      ':'password  and confirm password didnot match',   

        ];

        $validator = Validator::make($request->all(), $validations, $messages);
        if ($validator->fails())
        {
            if(checkLanguage($request->header('lang')) == 'ar')
            {
                return success(null,1010,implode(" - ", $validator->errors()->all()));
            }else{
                return success(null,1010,implode(" - ", $validator->errors()->all()));

            }   
        }

        $user = Auth::user();
        if($user)
        {
            $user->password = bcrypt($request->new_password);
            $user->save();
            if(checkLanguage($request->header('lang')) == 'ar')
            {
                return success(null,200,'تم تغير الباسورد بنجاح');
            }else{
                return success(null,200,'password change successfully');
    
            }  
        }else{
            if(checkLanguage($request->header('lang')) == 'ar')
            {
                return success(null,1002,'حدث خطأ اثناء تغير الباسورد ');
            }else{
                return success(null,1002,'something wrong when change password');
    
            }  
        }
       
       
    }


}
