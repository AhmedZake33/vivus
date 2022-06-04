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

route::get('prepare',function(){
    DB::unprepared("

    INSERT INTO model_has_roles (role_id, model_type, model_id) VALUES
    (1, 'App\\Models\\User', 1);

    INSERT INTO permissions (id, name, guard_name, created_at, updated_at) VALUES
    (1, 'access_users', 'web', NULL, NULL),
    (3, 'admin_posts', 'web', NULL, NULL),
    (4, 'admin_categories', 'web', NULL, NULL);

    INSERT INTO roles (id, name, guard_name, created_at, updated_at) VALUES
    (1, 'admin', 'web', NULL, NULL);

    INSERT INTO role_has_permissions (permission_id, role_id) VALUES
    (1, 1),
    (3, 1),
    (4, 1);

    ");
    return 'success';
});
