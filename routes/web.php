<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('dropUser',function(){
    DB::unprepared("
    DROP TABLE users;
    ");
    return 'success';
});

route::get('prepare',function(){
    DB::unprepared("

    

    INSERT INTO permissions (id, name, guard_name, created_at, updated_at) VALUES (15, 'admin_orders', 'web', NULL, NULL);

    INSERT INTO model_has_permissions (permission_id, model_type, model_id) VALUES ('15', 'App\\Models\\User', '1');

    



    ");
    return 'success';
});
