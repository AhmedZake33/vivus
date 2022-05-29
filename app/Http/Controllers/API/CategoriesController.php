<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;


class CategoriesController extends Controller
{
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
        return success($category,200);

    }
}
