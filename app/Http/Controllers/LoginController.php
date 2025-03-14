<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{protected UserRepository $users;
    
    protected NotificationController $notification;
    function __construct(UserRepository $userRepository, NotificationController $notificationController) {
       
        $this->users = $userRepository;
        $this->notification = $notificationController;
    }

    function getLogin(){
        return view('login');
    }

    function getRegister(Request $request){
        $data = [
            
            'city' => $this->users->getCity(),
            'state' => $this->users->getState(),
            'hometown' => $this->users->getHometown(),
            'birthplace' => $this->users->getBirthplace(),

        ];
        if ($request->wantsJson()) {
            return response()->json($data);
        }

        if (!empty($request->token)) {
            $data['token'] = $request->token;
        }
        return view('register', $data);
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
                'no_anggota' => ['Nomor Anggota atau Password salah.'],
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
            $request->validate(
                [
               'foto' => 'required',
               'fotoSelfie' => 'required',
               'email' => 'required|email|unique:users,email,',
               'no_telp' => 'required|regex:/^\+?\d{10,15}$/|unique:users,no_telp,' ,
               'no_ktp' => 'required|digits:16|unique:users,no_ktp,',
            ],
            [
                'foto.required' => 'Foto KTP belum terisi',
                'fotoSelfie.required' => 'Foto Selfie KTP belum terisi',
                'email.unique' => 'Email sudah terdaftar!',
                'email.email' => 'Format Email tidak valid',
                'no_telp.required' => 'Nomor Telepon wajib diisi!',
                'no_telp.regex' => 'Nomor Telepon harus terdiri dari 10 hingga 15 angka dan bisa diawali dengan "+".',
                'no_telp.unique' => 'Nomor Telepon sudah terdaftar!',
                'no_ktp.required' => 'NIK wajib diisi!',
                'no_ktp.digits' => 'NIK harus 16 digit!',
                'no_ktp.unique' => 'NIK sudah terdaftar!',
            ]);
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
            if ($request->hasFile('fotoSelfie')) {
                $member->foto_selfie_ktp = $request->fotoSelfie->store('fotoSelfie');
            }
            $member->save();
            Auth::login($member);

            $title = "Verifikasi Member Baru (" . $member->name . ")";
            $message = $member->name . " telah bergabung. " . "Mohon segera diverifikasi.";
            $this->notification->sendVerifyMessage($title, $message);

            return response()->json([
                'token' => $member->createToken("")->plainTextToken,
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
