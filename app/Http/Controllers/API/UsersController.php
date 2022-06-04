<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\System\System;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $user = User::find($user->id);
        $inputs = $request->all();
        if($request->has('password'))
        {
            $inputs['password'] = bcrypt($request->password);
        }
        $user->fill($inputs);
        $user->save();
        return success($user);
    }


}
