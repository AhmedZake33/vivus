<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\System\System;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\Archive\Archive;

use App\Models\User;
class AuthController extends Controller
{
    public $passwordValidation = [
        'required',
        'string',
        'max:30',
        'min:8',             // must be at least 6 characters in length
        'regex:/[a-z]/',      // must contain at least one lowercase letter
        'regex:/[A-Z]/',      // must contain at least one uppercase letter
        'regex:/[0-9]/',      // must contain at least one digit
        'regex:/[@$!%*_#?&]/', // must contain a special character
    ];
    public function register(Request $request)
    {
        
        $validations = [
            'national_id' => 'required|unique:users',
            'email' => 'required|email|unique:users',
            'mobile' => 'required |unique:users',
            "file" => 'mimes:jpg,png'
        ];

        $messages = [
            'national_id.unique' => (checkLanguage($request->header('lang')) == 'ar') ?'الرقم القومى مسجل فى قاعدة البيانات':'national id if already exist',
            'email.unique' => (checkLanguage($request->header('lang')) == 'ar') ? 'البريد الالكترونى مسجل فى قاعدة البيانات ':'email is already exist',
            'mobile.unique' =>(checkLanguage($request->header('lang')) == 'ar') ? 'رقم التليفون  مسجل فى قاعدة البيانات ':'mobile number is already exist',
            "file" => (checkLanguage($request->header('lang')) == 'ar') ?' برجاء اختيار صوره ':"please slsect photo",
        ];

        $validations['password'] = $this->passwordValidation;
        $validations['confirm_password'] = 'required|same:password';

        $validator = Validator::make($request->all(), $validations, $messages);
        if ($validator->fails())
            if(checkLanguage($request->header('lang')) == 'ar')
            {
                return success(['error' => implode(" - ", $validator->errors()->all()) . 'برجاء المراجعة '],200,'حدث خظا في ادخال البيانات');
            }else{
                return success(['error' => implode(" - ", $validator->errors()->all()) . 'please review'],200,'error in entered data');

            }   
         
        $inputs = $request->except(['confirm_password','file']);
        $inputs['password'] = bcrypt($request->password);
        $inputs['removed'] = 2;
        $user = User::create($inputs);
        
        try {
            $user->archive->addDocumentWithShortName($request->file, 'PERSONAL_ID', 'PERSONAL_ID_CARD', 'PERSONAL_ID_CARD');
        } catch (\Exception $ex) {
            if(checkLanguage($request->header('lang')) == 'en')
            {
                return success(['message' => $ex],200,'error in adding photo');
            }else{
                return success(['message' => $ex],200,'حدث خطأ في حفظ الصوره');
            }

          
        }

        $success['user'] = $user;
        $token = $user->createToken($request->name);
        $user['token'] = $token->plainTextToken;

        if(checkLanguage($request->header('lang')) == 'en')
        {
            return success($user->data(System::DATA_BRIEF),System::HTTP_OK,'register comppleted successfully');
        }else{
            return success($user->data(System::DATA_BRIEF),System::HTTP_OK,'تم التسجيل بنجاح');
        }
       
    }

    public function login(Request $request)
    {
        $validations = [
            'email' => 'email|required|exists:users,email',
            'password' => 'required'
        ];

        $validator = Validator::make($request->all(), $validations);

        if ($validator->fails()) {


            if(checkLanguage($request->header('lang')) == 'en')
            {
                return success([],200,'The username or password is incorrect , please try again');
            }else{
                return success([],200,'خطأ في البريد الالكتروني او الباسورد  ');
            }

           
        }

        $user = User::where('email', $request->email)->first();

        if($user && password_verify($request->password, $user->password)) {

            Auth::login($user);
            $accessToken = auth()->user()->createToken('authToken')->plainTextToken;
            Auth::user()['access_token'] = $accessToken;
            $user = Auth::user();
            if(checkLanguage($request->header('lang')) == 'en')
            {
                return success($user->data(System::DATA_BRIEF),'login sucessfully');
            }else{
                return success($user->data(System::DATA_BRIEF),'تم التسجيل بنجاح');
            }


        }else{
            if(checkLanguage($request->header('lang')) == 'en')
            {
                return success([],200,'The username or password is incorrect , please try again');
            }else{
                return success([],200,'خطأ في البريد الالكتروني او الباسورد  ');
            }
        }
    }

}
