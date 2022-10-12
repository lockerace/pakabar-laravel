<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SliderController;


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

Route::group(['prefix' => 'admin', 'middleware' => ['auth:sanctum', 'backendonly']], function() {
    Route::get('/', [AdminController::class, "getDashboard"])->name('dashboard');
    Route::get('/member/foto/{path}', [UserController::class, "getFoto"])->name('admin-member-foto');
    Route::get('/member', [UserController::class, "getMember"])->name('admin-member');
    Route::post('/member', [UserController::class, "editMember"])->name('admin-member-submit');
    Route::post('/deletemember', [UserController::class, "deleteMember"])->name('admin-member-delete');
    Route::get('/jabatan', [UserController::class, "getJabatan"])->name('admin-jabatan');
    Route::post('/jabatan', [UserController::class, "editJabatan"])->name('admin-jabatan-submit');
    Route::post('/deletejabatan', [UserController::class, "deleteJabatan"])->name('admin-jabatan-delete');
    Route::get('/news', [NewsController::class, "getNews"])->name('admin-news');
    Route::post('/news', [NewsController::class, "editNews"])->name('admin-news-submit');
    Route::post('/deletenews', [NewsController::class, "deleteNews"])->name('admin-news-delete');
    Route::get('/send-notification', [NotificationController::class, "sendMessage"])->name('admin-send-notif');
    Route::get('/slider/foto/{path}', [SliderController::class, "getFoto"])->name('admin-slider-foto');
    Route::get('/slider', [SliderController::class, "getSlider"])->name('admin-slider');
    Route::post('/slider', [SliderController::class, "editSlider"])->name('admin-slider-submit');
    Route::post('/deleteslider', [SliderController::class, "deleteSlider"])->name('admin-slider-delete');
    Route::post('/news/image-upload', [NewsController::class, "uploadImageNews"])->name('admin-news-image-upload');
});

Route::get('/home', [HomeController::class, 'index'])->name('home');
Route::get('/news/{id}', [NewsController::class, "getNewsDetail"])->name('news');
Route::get('/aboutus', [HomeController::class, 'aboutUs'])->name('about-us');
Route::get('/member/foto/{path}', [UserController::class, "getFoto"])->name('member-foto');

Route::group(['prefix' => '', 'middleware' => ['auth:sanctum']], function() {
    Route::get('/changeprofile', [UserController::class, "getProfile"])->name('profile');
    Route::post('/changeprofile', [UserController::class, "updateProfile"])->name('profile-submit');
    Route::get('/notification', [NotificationController::class, 'getNotification'])->name('notification');
    Route::get('/notification/read/{id}', [NotificationController::class, 'readNotification'])->name('read-notification');
});
