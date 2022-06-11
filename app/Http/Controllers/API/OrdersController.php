<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\System\System;
use Illuminate\Support\Facades\DB;
use App\Models\Archive\Archive;


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
        // dd($request->header()['language']);
        $validations = [
            
            "location_id" => "required"
        ];

        $messages = [
            "location_id" => "يرجي ادخال العنوان"
        ];

        $validator = Validator::make($request->all(), $validations, $messages);
        if ($validator->fails())
        return response()->json(['error' => implode(" - ", $validator->errors()->all()) . 'برجاء المراجعة '], 500);
        $checkLocation = Order::checkLocation($request->location_id);  
        if(!$checkLocation)
        {
            return success([],200,'location un avaiable');
        }
        $inputs = $request->all();
        $inputs['user_id'] = Auth::user()->id;
        $order  = Order::create($inputs);
        try {
            foreach($request->categories as $category)
            {
                $main_category = Category::find($category->id);
                $folder = $order->archive->addFolder("$main_category->en_name");
                foreach($request->photos as $file)
                {
                    $folder->addFile($file , 'category');
                }
            }
           
        } catch (\Exception $ex) {
            return success(['message' => $ex],200,'error in adding photo');
        }

        return success($order,200,'order created successfully');
    }

    public function get($id)
    {
        $order = Order::find($id);
        $order_archive = $order->archive_id;
        $archives = Archive::where('parent_id',$order->archive_id)->get();
        $files = [];
        $all_photos = [];
        foreach($archives as $main_archive)
        {
            $photos = Archive::where('parent_id',$main_archive->id)->get();
            foreach($photos as $photo)
            {
                $photo['url'] = route('secure_download_file',$photo);
                array_push($all_photos,$photo);
            }            
            $files[$main_archive->title] = $photos;
            $order['files'] = $files;
        }
        return success($order,System::HTTP_OK , 'success');
    }

    public function myOrders()
    {
        $user = Auth::user();
        return success($user->orders);
    }

   
}
