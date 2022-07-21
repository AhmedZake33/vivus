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
        // 'string',
        // 'max:30',
        'min:6',             // must be at least 6 characters in length
        // 'regex:/[a-z]/',      // must contain at least one lowercase letter
        // 'regex:/[A-Z]/',      // must contain at least one uppercase letter
        // 'regex:/[0-9]/',      // must contain at least one digit
        // 'regex:/[@$!%*_#?&]/', // must contain a special character
    ];
    public function register(Request $request)
    {
        
        $validations = [
            // 'national_id' => 'required|unique:users',
            'email' => 'required|email|unique:users',
            'mobile' => 'required |unique:users',
            // "file" => 'mimes:jpg,png'
        ];

        $messages = [
            // 'national_id.unique' => (checkLanguage($request->header('lang')) == 'ar') ?'الرقم القومى مسجل فى قاعدة البيانات':'national id if already exist',
            'email.unique' => (checkLanguage($request->header('lang')) == 'ar') ? 'البريد الالكترونى مسجل فى قاعدة البيانات ':'email is already exist',
            'mobile.unique' =>(checkLanguage($request->header('lang')) == 'ar') ? 'رقم التليفون  مسجل فى قاعدة البيانات ':'mobile number is already exist',
            // "file" => (checkLanguage($request->header('lang')) == 'ar') ?' برجاء اختيار صوره ':"please slsect photo",
        ];

        $validations['password'] = $this->passwordValidation;
        $validations['confirm_password'] = 'required|same:password';

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
 
         
        $inputs = $request->except(['confirm_password','file']);
        $inputs['password'] = bcrypt($request->password);
        $inputs['removed'] = 2;
        $user = User::create($inputs);
        $user->save();
        $user->verfication();
        // try {
        //     $user->archive->addDocumentWithShortName($request->file, 'PERSONAL_ID', 'PERSONAL_ID_CARD', 'PERSONAL_ID_CARD');
        // } catch (\Exception $ex) {
        //     if(checkLanguage($request->header('lang')) == 'en')
        //     {
        //         return success(['message' => $ex],200,'error in adding photo');
        //     }else{
        //         return success(['message' => $ex],200,'حدث خطأ في حفظ الصوره');
        //     }    
        // }

        $success['user'] = $user;
        $token = $user->createToken($request->name);
        $user['token'] = $token->plainTextToken;

       

        if(checkLanguage($request->header('lang')) == 'en')
        {
            return success($user->data(System::DATA_BRIEF),System::HTTP_OK,'register completed successfully');
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
                return success(null,1002,'The username or password is incorrect , please try again');
            }else{
                return success(null,1002,'خطأ في البريد الالكتروني او الباسورد  ');
            }
           
        }

        $user = User::where('email', $request->email)->first();

        if($user && password_verify($request->password, $user->password)) {

            Auth::login($user);
            $accessToken = $user->createToken($user->name)->plainTextToken;
            $user['token'] = $accessToken;
            if(checkLanguage($request->header('lang')) == 'en')
            {
                return success($user->data(System::DATA_BRIEF),System::HTTP_OK,'login sucessfully');
            }else{
                return success($user->data(System::DATA_BRIEF),System::HTTP_OK,'تم التسجيل بنجاح');
            }


        }else{
            if(checkLanguage($request->header('lang')) == 'en')
            {
                return success(null,1002,'The username or password is incorrect , please try again');
            }else{
                return success(null,1002,'خطأ في البريد الالكتروني او الباسورد  ');
            }
        }
    }

    public function reset(Request $request)
    {
        // validation on code 


        $validations = [
            'code' => 'required',
            'mobile' => 'required|exists:users,mobile'
        ];

        $messages = [
            'code.required' => ($request->header('lang') == 'en')? 'the code is required': 'برجاء ادخال الكود',
            'mobile.required' => ($request->header('lang') == 'en')? 'the mobile is required': 'برجاء ادخال رقم الهاتف',
            'mobile.exists' => ($request->header('lang') == 'en')? 'the mobile is not found': ' رقم الهاتف غير موجود ',

        ];

        $validator = Validator::make($request->all(), $validations, $messages);

        if ($validator->fails()) {
            return success(null,1002,implode(" - ", $validator->errors()->all()));
        }


        $user = User::where('forget_code',$request->code)->where('mobile',$request->mobile)->first();
        if($user)
        {
            $user->forget_code = null;
            $user->save();
            Auth::login($user);
            $accessToken = $user->createToken($user->name)->plainTextToken;
            $user['token'] = $accessToken;
            if(checkLanguage($request->header('lang')) == 'en')
            {
                return success($user->data(System::DATA_BRIEF),System::HTTP_OK,'code is verified');
            }else{
                return success($user->data(System::DATA_BRIEF),System::HTTP_OK,'تم التحقق من الكود');
            }
        }else{
            if(checkLanguage($request->header('lang')) == 'en')
            {
                return success(null,1002,'code is invalid');
            }else{
                return success(null,1002,'الكود غير صحيح ');
            }
        }
      
    }


}
