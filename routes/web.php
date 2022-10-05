<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;

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

Route::get('/login', [LoginController::class, "getLogin"]);
Route::post('/login', [LoginController::class, "submitLogin"])->name('login-submit');

Route::group(['prefix' => 'admin', 'middleware' => ['auth:sanctum']], function() {
    Route::get('/', [AdminController::class, "getDashboard"]);
    Route::get('/member', [UserController::class, "getMember"])->name('admin-member');
    Route::post('/member', [UserController::class, "editMember"])->name('admin-member-submit');
});

