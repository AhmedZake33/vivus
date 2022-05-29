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
            'national_id.unique' => 'الرقم القومى مسجل فى قاعدة البيانات',
            'email.unique' => 'البريد الالكترونى مسجل فى قاعدة البيانات ',
            'mobile.unique' => 'رقم التليفون  مسجل فى قاعدة البيانات ',
            "file" => 'برجاء اختيار صوره '
        ];

        $validations['password'] = $this->passwordValidation;
        $validations['confirm_password'] = 'required|same:password';

        $validator = Validator::make($request->all(), $validations, $messages);
        if ($validator->fails())
            return response()->json(['error' => implode(" - ", $validator->errors()->all()) . 'برجاء المراجعة '], 500);

        $inputs = $request->except(['confirm_password','file']);
        $inputs['password'] = bcrypt($request->password);
        $inputs['removed'] = 2;
        $user = User::create($inputs);
        
        try {
            $user->archive->addDocumentWithShortName($request->file, 'PERSONAL_ID', 'PERSONAL_ID_CARD', 'PERSONAL_ID_CARD');
        } catch (\Exception $ex) {
            return response()->json(['message' => $ex], 500);
        }

        $success['user'] = $user;
        $token = $user->createToken($request->name);
        $user['token'] = $token->plainTextToken;

        return success($user,System::HTTP_OK);
    }

    public function login(Request $request)
    {
        $validations = [
            'email' => 'email|required|exists:users,email',
            'password' => 'required'
        ];

        $validator = Validator::make($request->all(), $validations);

        if ($validator->fails()) {

            return error(System::HTTP_BAD_REQUEST, 'message','The username or password is incorrect , please try again');
        }

        $user = User::where('email', $request->email)->first();

        if($user && password_verify($request->password, $user->password)) {

            Auth::login($user);
            $accessToken = auth()->user()->createToken('authToken')->plainTextToken;
            Auth::user()['access_token'] = $accessToken;
            return success(Auth::user());


        }else{
            return error(System::HTTP_BAD_REQUEST, 'The username or password is incorrect , please try again');
        }
    }

}
