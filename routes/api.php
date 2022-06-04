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



// Authenticated Routes
Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::get('/profile','UsersController@profile');
    Route::get('users','UsersController@index');
    Route::post("post/create",'PostsController@create');
    Route::post("category/add","CategoriesController@create");
   

    // location routes

    Route::post('location/add','LocationsController@create');
    Route::get('locations','LocationsController@locations');


    // order routes
    Route::post('orders','OrdersController@index');
    Route::post('order/create','OrdersController@create');
    Route::get('order/{id}','OrdersController@get');


    //users routes
    Route::post('user/edit','UsersController@edit');
});