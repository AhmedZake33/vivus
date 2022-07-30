<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// GLOBAL Routes
Route::post('register','AuthController@register');
Route::post('login','AuthController@login');
Route::post('user/reset/password','AuthController@reset');

Route::post('user/forget/password','UsersController@forget');



// Authenticated Routes
Route::group(['middleware' => 'auth:sanctum'], function () {
    

    Route::post("post/create",'PostsController@create');
    Route::post("category/add","CategoriesController@create");




    // cateegories controllers

    Route::post('categories','CategoriesController@index');
    Route::post('category/edit/{category}','CategoriesController@edit');
    Route::get('category/{category}','CategoriesController@category');


    // points controller 

    Route::post('points','PointsController@points');
    Route::post('points/add','PointsController@add');
    Route::post('points/edit/{user}','PointsController@edit');
    
   

    // location routes

    Route::post('location/add','LocationsController@create');
    Route::get('locations','LocationsController@locations');


    // order routes
    Route::post('orders','OrdersController@index');
    Route::post('order/create','OrdersController@create');
    Route::get('order/{id}','OrdersController@get');
    Route::get('myorders','OrdersController@myOrders');


    // archive routes
    // Route::get("archive/secureDownload/{sid}", 'ArchiveController@secureDownload')->name('secure_download_file');
	Route::get("download/{archive}", 'ArchiveController@download')->name('secure_download_file');





    //users routes
    Route::get('users','UsersController@index');
    Route::post('user/edit','UsersController@edit');
    Route::get('/profile','UsersController@profile');
    Route::post("/password/change","UsersController@changePassword");
    Route::post('user/verifiy','UsersController@verifiy');
    // lookups routes 
    route::get('lookups','LookupsController@lookups');
});

