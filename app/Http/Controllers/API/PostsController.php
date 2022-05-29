<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Post;
use Illuminate\Support\Facades\Validator;


class PostsController extends Controller
{
    public function create(Request $request)
    {
        if(!can('admin_posts'))
        {
            return error(401,'unauthenticated');
        }

        $validations = [
            'header' => 'required',
            'content' => 'required'
        ];

        $messages = [
            'header' => 'header cannot be null',
            'content' => 'content cannot be null'
        ];

        $validator = Validator::make($request->all(), $validations, $messages);
        if ($validator->fails())
        return response()->json(['error' => implode(" - ", $validator->errors()->all()) . 'برجاء المراجعة '], 500);


        $user = Auth::user();
        $data = $request->all();
        $data['user_id'] = $user->id;

        $post = Post::create($data);
        $post->save();
        return  success($post,200);
    }
}
