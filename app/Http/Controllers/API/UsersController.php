<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\System\System;
use Illuminate\Http\Request;
use App\Models\User;
class UsersController extends Controller
{
    public function profile(Request $request)
    {
        return success($request->user(),System::HTTP_OK);
    }

    public function index()
    {
        if(!can('access_users'))
        {
            return error(401,'message','errors');
        }
        return success(User::all(),System::HTTP_OK);
    }


}
