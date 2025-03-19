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
                    'email' => 'unique:users,email,' . $member->id,
                    'no_telp' => 'required|regex:/^\+?\d{1,15}$/|unique:users,no_telp,' . $member->id,
                    'no_ktp' => 'required|digits:16|unique:users,no_ktp,' . $member->id,
                    'foto' => 'required',
                    'foto_selfie_ktp' => 'required',
                    
                ],
                [
                    'foto.required' => 'Foto belum terisi',
                    'foto_selfie_ktp.required' => 'Foto Selfie KTP belum terisi',
                    'email.unique' => 'Email tidak tersedia',
                    'no_telp.unique' => 'Nomor Telepon tidak tersedia',
                    'no_telp.regex' => 'Format Nomor Telepon tidak valid (Gunakan angka, bisa diawali dengan + untuk kode negara)',
                    'no_ktp.required' => 'NIK wajib diisi!',
                    'no_ktp.digits' => 'NIK harus 16 digit!',
                    'no_ktp.unique' => 'NIK sudah terdaftar!',
                    
                ]
            );
            $member->name = $request->name;
            $member->email = $request->email;
            $member->alamat = $request->alamat;
            $member->no_telp = $request->no_telp;
            
            $member->password = Hash::make($request->password);
            $member->no_anggota = "PKB" . str_pad($lastUser->id, 3, "0", STR_PAD_LEFT);
           
            $member->no_ktp = $request->no_ktp;
            $member->jabatan_id = 2;
            $member->status = 0;

            $member->bloodtype = $request->bloodtype;
            $member->religion = $request->religion;
            $member->marriage = $request->marriage;
            $member->gender = $request->gender;

            
            $member->job = $request->job;
            $member->sosmed_fb = $request->sosmed_fb;
            $member->sosmed_ig = $request->sosmed_ig;
            $member->sosmed_twitter = $request->sosmed_twitter;
            $member->familymember = $request->familymember;
            $member->emergency_name = $request->emergency_name;
            $member->emergency_phone = $request->emergency_phone;
            $member->emergency_relation = $request->emergency_relation;



            $member->birthday = $request->birthday;
            $member->city_id = $request->city_id;
            $member->birthplace_id = $request->birthplace_id;
            $member->hometown_id = $request->hometown_id;


            if ($request->hasFile('foto')) {
                $member->foto = $request->file('foto')->store('foto');
            }
            if ($request->hasFile('foto_selfie_ktp')) {
                $member->foto_selfie_ktp = $request->file('foto_selfie_ktp')->store('foto_selfie_ktp');
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
            $request->validate(
                [
                    'email' => 'unique:users,email,' . $member->id,
                    'no_telp' => 'required|regex:/^\+?\d{1,15}$/|unique:users,no_telp,' . $member->id,
                    'no_ktp' => 'required|digits:16|unique:users,no_ktp,' . $member->id,
                    'foto' => 'required',
                    'foto_selfie_ktp' => 'required',
                    
                ],
                [
                    'foto.required' => 'Foto belum terisi',
                    'foto_selfie_ktp.required' => 'Foto Selfie KTP belum terisi',
                    'email.unique' => 'Email tidak tersedia',
                    'no_telp.unique' => 'Nomor Telepon tidak tersedia',
                    'no_telp.regex' => 'Format Nomor Telepon tidak valid (Gunakan angka, bisa diawali dengan + untuk kode negara)',
                    'no_ktp.required' => 'NIK wajib diisi!',
                    'no_ktp.digits' => 'NIK harus 16 digit!',
                    'no_ktp.unique' => 'NIK sudah terdaftar!',
                    
                ]
            );
            $member->name = $request->name;
            $member->email = $request->email;
            $member->alamat = $request->alamat;
            $member->no_telp = $request->no_telp;
            
            $member->password = Hash::make($request->password);
            $member->no_anggota = "PKB" . str_pad($lastUser->id, 3, "0", STR_PAD_LEFT);
           
            $member->no_ktp = $request->no_ktp;
            $member->jabatan_id = 2;
            $member->status = 0;

            $member->bloodtype = $request->bloodtype;
            $member->religion = $request->religion;
            $member->marriage = $request->marriage;
            $member->gender = $request->gender;

            
            $member->job = $request->job;
            $member->sosmed_fb = $request->sosmed_fb;
            $member->sosmed_ig = $request->sosmed_ig;
            $member->sosmed_twitter = $request->sosmed_twitter;
            $member->familymember = $request->familymember;
            $member->emergency_name = $request->emergency_name;
            $member->emergency_phone = $request->emergency_phone;
            $member->emergency_relation = $request->emergency_relation;



            $member->birthday = $request->birthday;
            $member->city_id = $request->city_id;
            $member->birthplace_id = $request->birthplace_id;
            $member->hometown_id = $request->hometown_id;


            if ($request->hasFile('foto')) {
                $member->foto = $request->file('foto')->store('foto');
            }
            if ($request->hasFile('foto_selfie_ktp')) {
                $member->foto_selfie_ktp = $request->file('foto_selfie_ktp')->store('foto_selfie_ktp');
            }

            $member->save();
            Auth::login($member);

            $title = "Verifikasi Member Baru (" . $member->name . ")";
            $message = $member->name . " telah bergabung. " . "Mohon segera diverifikasi.";
            $this->notification->sendVerifyMessage($title, $message);

          

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
