<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\System\System;
use Illuminate\Support\Facades\DB;


class OrdersController extends Controller
{
   
    public function index(Request $request)
    {
        if(!can('admin_orders'))
        {
            return error(401,'unauthenticated');
        }
        $query = DB::table('orders')->leftJoin('categories','categories.id','orders.category_id')
        ->select('orders.id','orders.created_at','categories.id','categories.ar_name','categories.en_name','categories.price','orders.Quantity','orders.details');
        
        if($request->category)
        {
            $query->where('categories.id',$request->category);
        }

        if($request->month)
        {

        }

        if($request->day)
        {

        }
        
        return success($query->get(),System::HTTP_OK , 'success');
    }

    public function create(Request $request)
    {
        $validations = [
            
            "category_id" => "required|numeric",
            "Quantity" => "required",
            "details" => "required"
        ];

        $messages = [
            "category_id.required" => 'برجاء ادخال النوع',
            "Quantity.required" => "برجاء ادخال الكميه",
            "details.required" => "برجاء ادخال التفاصيل"
        ];

        $validator = Validator::make($request->all(), $validations, $messages);
        if ($validator->fails())
        return response()->json(['error' => implode(" - ", $validator->errors()->all()) . 'برجاء المراجعة '], 500);
        $inputs = $request->all();
        $inputs['user_id'] = Auth::user()->id;
        $order  = Order::create($inputs);

        return success($order,200);
    }

    public function get($id)
    {
        $order = Order::find($id);
        return success($order,System::HTTP_OK , 'success');
    }

    public function myOrders()
    {
        $user = Auth::user();
        return success($user->orders);
    }

   
}
