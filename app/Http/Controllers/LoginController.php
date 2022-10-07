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

        return redirect()->route('admin-member', ['token' => $user->createToken("")->plainTextToken]);

    }

    function getLogout(){
        Auth::logout();

        return redirect()->route('home');
    }
}
