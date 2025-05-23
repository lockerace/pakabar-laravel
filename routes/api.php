<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SliderController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\DonasiController;


use App\Models\User;

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
    Route::post('/logout', [LoginController::class, "getLogout"]);
});
Route::get('/home', [HomeController::class, 'index']);
Route::get('/about', [HomeController::class, 'aboutUs']);
Route::get('/news/{id}', [NewsController::class, 'getNewsDetail']);
Route::post('/login', [LoginController::class, "submitLogin"]);

Route::get('/register', [LoginController::class, "getRegister"]);
Route::post('/register', [LoginController::class, "submitRegister"]);

Route::post('/donasi', [DonasiController::class, "store"]);
Route::post('/midtrans/callback', [DonasiController::class, 'callback']);
Route::post('/donasi/check-status', [DonasiController::class, 'checkStatus']);


Route::get('/validate-ref/{ref_id}', function ($ref_id) {
    $exists = User::where('no_anggota', $ref_id)->exists();
    return response()->json(['valid' => $exists]);
});

Route::group(['prefix' => 'admin', 'middleware' => ['auth:sanctum', 'backendonly']], function() {
    Route::get('/member', [UserController::class, 'getMember']);
    Route::post('/member', [UserController::class, 'editMember']);
    Route::post('/verifymember/{id}', [UserController::class, "verifyMember"]);

    Route::get('/jabatan', [UserController::class, 'getJabatan']);
    Route::post('/jabatan', [UserController::class, 'editJabatan']);
    Route::post('/deletejabatan', [UserController::class, 'deleteJabatan']);

    Route::get('/slider', [SliderController::class, 'getSlider']);
    Route::post('/slider', [SliderController::class, "editSlider"]);
    Route::post('/deleteslider', [SliderController::class, "deleteSlider"]);

    Route::get('/news', [NewsController::class, "getNews"]);
    Route::post('/news', [NewsController::class, "editNews"]);
    Route::post('/deletenews', [NewsController::class, "deleteNews"]);
    Route::post('/news/image-upload', [NewsController::class, "uploadImageNews"]);
    
    Route::get('/finance/ledger', [FinanceController::class, "getBankLedger"]);    
    Route::post('/finance/ledger', [FinanceController::class, "editBankLedger"]);
    Route::get('/finance', [FinanceController::class, "getBank"]);
    Route::post('/finance', [FinanceController::class, "editBank"]);

    Route::post('/send-notification', [NotificationController::class, "sendMessage"])->name('admin-send-notif');
});

Route::group(['middleware' => 'auth:sanctum'], function() {
    Route::get('/profile', [UserController::class, 'getProfile']);
    Route::get('/profile/{id}', [UserController::class, 'getProfileById']);
    Route::post('/profile', [UserController::class, "updateProfile"]);

    Route::get('/notification', [NotificationController::class, 'getNotification']);
    Route::get('/notification/read/{id}', [NotificationController::class, 'readNotification']);

    Route::get('/membership', [HomeController::class, 'getMembership']);
});
