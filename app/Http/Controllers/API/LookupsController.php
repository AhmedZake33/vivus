<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use DB;

class LookupsController extends Controller
{
    public function lookups()
    {
        $categories = Category::all();
        $countries = DB::table('countries')->select('id','name','name_local')->get();
        $lookups['categories'] = $categories;
        $lookups['countries'] = $countries;
        
        return success($lookups);
    }
}
