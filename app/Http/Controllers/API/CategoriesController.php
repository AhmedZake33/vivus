<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\System\System;
use Illuminate\Support\Facades\Validator;
use DB;


class CategoriesController extends Controller
{

    public function index(Request $request)
    {
        $categories = DB::table('categories');

        if(checkLanguage($request->header('lang')) == 'en')
        {
            return success($categories->select('id','en_name','price')->get(),System::HTTP_OK,'success');
        }else{
            return success($categories->select('id','ar_name','price')->get(),System::HTTP_OK,'تم بنجاح');
        }

    }

    public function edit(Request $request , Category $category)
    {
        if(!can('admin_categories'))
        {
            return error(401,'unauthenticated');
        }

        if($category)
        {
            $category->fill($request->all());
            $category->save();
        }

        if(checkLanguage($request->header('lang')) == 'en')
        {
            return success($category,System::HTTP_OK, ' edit category successfully');
        }else{
            return success($category,System::HTTP_OK,'تم التعديل بنجاح');
        }
    }

    public function create(Request $request)
    {
        if(!can('admin_categories'))
        {
            return error(401,'unauthenticated');
        }
        $validations = [
            'ar_name' => 'required|unique:categories,ar_name',
            'en_name' => 'required|unique:categories,en_name',
            'price' => 'required|numeric'
        ];

        $messages = [
            'ar_name' => 'هذا النوع موجود بالفعل',
            'en_name' => 'هذا النوع موجود بالفعل',
            "price" => 'برجاء ادخال السعر'
        ];

        $validator = Validator::make($request->all(), $validations, $messages);
        if ($validator->fails())
        return response()->json(['error' => implode(" - ", $validator->errors()->all()) . 'برجاء المراجعة '], 500);

        
        $category  = Category::Create($request->all());
        
        if(checkLanguage($request->header('lang')) == 'en')
        {
            return success($category,System::HTTP_OK, 'success');
        }else{
            return success($category,System::HTTP_OK,'تم بنجاح');
        }

    }
}
