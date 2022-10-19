<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\UserController;

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

Route::middleware('auth:sanctum')->get('/user', [LoginController::class, 'checkLogin']);

Route::group(['middleware' => ['auth.optional']], function() {
    Route::get('/profile', [UserController::class, 'getProfile']);
    Route::post('/profile', [UserController::class, "updateProfile"]);
    Route::post('/logout', [LoginController::class, "getLogout"]);
});
Route::get('/home', [HomeController::class, 'index']);
Route::get('/about', [HomeController::class, 'aboutUs']);
Route::get('/news/{id}', [NewsController::class, 'getNewsDetail']);
Route::post('/login', [LoginController::class, "submitLogin"]);
Route::post('/register', [LoginController::class, "submitRegister"]);
