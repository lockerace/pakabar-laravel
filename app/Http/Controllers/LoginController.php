<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    function __construct(UserRepository $userRepository, NotificationController $notificationController) {
        $this->users = $userRepository;
        $this->notification = $notificationController;
    }

    function getLogin(){
        return view('login');
    }

    function getRegister(){
        return view('register');
    }

    function checkLogin(Request $request) {
        return $this->users->getById($request->user()->id);
    }

    function submitLogin(Request $request){
        $request->validate([
            'no_anggota' => 'required',
            'password' => 'required',
        ]);

        $user = User::where('no_anggota', $request->no_anggota)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'no_anggota' => ['The provided credentials are incorrect.'],
            ]);
        }

        Auth::login($user);

        if($request->wantsJson()){
            if ($user->jabatan_id == 1) {
                return response()->json([
                    'token' => $user->createToken("")->plainTextToken,
                    'url' => '/admin/member',
                ]);
            } else{
                return response()->json([
                    'token' => $user->createToken("")->plainTextToken,
                    'url' => '/',
                ]);
            }

        } else{
            if ($user->jabatan_id == 1) {
                return redirect()->action(
                    [UserController::class, 'getMember'], ['token' => $user->createToken("")->plainTextToken]
                );
            } else {
                return redirect()->action(
                    [HomeController::class, 'index'], ['token' => $user->createToken("")->plainTextToken]
                );
            }
        }

    }

    function submitRegister(Request $request){
        $lastUser = $this->users->getLastUser();
        $member = new User;
        if($request->wantsJson()){
            $member->email = $request->email;
            $member->name = $request->name;
            $member->alamat = $request->alamat;
            $member->no_telp = $request->no_telp;
            $member->password = Hash::make($request->password);
            $member->no_anggota = "PKB" . str_pad($lastUser->id, 3, "0", STR_PAD_LEFT);
            $member->no_ktp = $request->no_ktp;
            $member->jabatan_id = 2;
            if ($request->hasFile('foto')) {
                $member->foto = $request->foto->store('foto');
            }
            $member->save();


            $title = "Verifikasi Member Baru (" . $member->name . ")";
            $message = $member->name . " telah bergabung. " . "Mohon segera diverifikasi.";
            $this->notification->sendVerifyMessage($title, $message);

            Auth::login($member);

            return response()->json([
                'url' => '/',
            ]);
        } else{
            $member->email = $request->email;
            $member->name = $request->name;
            $member->alamat = $request->alamat;
            $member->no_telp = $request->no_telp;
            $member->password = Hash::make($request->password);
            $member->no_anggota = "PKB" . str_pad($lastUser->id, 3, "0", STR_PAD_LEFT);
            $member->no_ktp = $request->no_ktp;
            $member->jabatan_id = 2;
            if ($request->hasFile('foto')) {
                $member->foto = $request->foto->store('foto');
            }
            $member->save();


            $title = "Verifikasi Member Baru (" . $member->name . ")";
            $message = $member->name . " telah bergabung. " . "Mohon segera diverifikasi.";
            $this->notification->sendVerifyMessage($title, $message);

            Auth::login($member);

            return redirect()->route('profile');
        }

    }

    function getLogout(Request $request){
        if (!empty($request->user())) {
            $token = $request->user()->currentAccessToken();
            if(method_exists($token, 'delete')) {
                $token->delete();
            };
        }
        Auth::logout();

        if($request->wantsJson()){
            return response()->json(null);
        }
        return redirect()->route('home');
    }
}
