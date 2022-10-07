<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\NewsController;

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
    return redirect()->route('home');
});

Route::get('/login', [LoginController::class, "getLogin"])->name('login');
Route::post('/login', [LoginController::class, "submitLogin"])->name('login-submit');

Route::post('/logout', [LoginController::class, "getLogout"])->name('logout');

Route::group(['prefix' => 'admin', 'middleware' => ['auth:sanctum']], function() {
    Route::get('/', [AdminController::class, "getDashboard"])->name('dashboard');
    Route::get('/member', [UserController::class, "getMember"])->name('admin-member');
    Route::get('/jabatan', [UserController::class, "getJabatan"])->name('admin-jabatan');
    Route::post('/member', [UserController::class, "editMember"])->name('admin-member-submit');
    Route::get('/deletemember/{id}', [UserController::class, "deleteMember"])->name('admin-member-delete');
    Route::post('/jabatan', [UserController::class, "editJabatan"])->name('admin-jabatan-submit');
    Route::get('/deletejabatan/{id}', [UserController::class, "deleteJabatan"])->name('admin-jabatan-delete');
    Route::get('/news', [NewsController::class, "getNews"])->name('admin-news');
});

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
