<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    function getLogin(){
        return view('login');
    }

    function getRegister(){
        return view('register');
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

    function submitRegister(Request $request){
        $member = new User;
            $member->email = $request->email;
            $member->name = $request->name;
            $member->alamat = $request->alamat;
            $member->no_telp = $request->no_telp;
            $member->password = Hash::make($request->password);
            $member->no_anggota = $request->no_anggota;
            $member->no_ktp = $request->no_ktp;
            $member->jabatan_id = 2;
            if ($request->hasFile('foto')) {
                $member->foto = $request->foto->store('foto');
            }
            $member->save();

            Auth::login($member);

            return redirect()->route('profile');
    }

    function getLogout(){
        Auth::logout();

        return redirect()->route('home');
    }
}
