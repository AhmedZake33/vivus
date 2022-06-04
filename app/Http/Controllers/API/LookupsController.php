<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;

class LookupsController extends Controller
{
    public function lookups()
    {
        $categories = Category::all();
        $lookups['categories'] = $categories;
        return success($lookups);
    }
}
