<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserRepository;
use App\Models\NewsRepository;

class UserController extends Controller
{
    function __construct(UserRepository $userRepository, NewsRepository $newsRepository) {
        $this->users = $userRepository;
        $this->news = $newsRepository;
    }

    function getMember(){
        $data = [
            'members' => $this->users->getAll()
        ];

        return view('member', $data);
    }

    function editMember(Request $request){
        $member = $this->users->getById($request->id);

        if($member == null){
            $member = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,
                'no_anggota' => $request->no_anggota,
                'no_ktp' => $request->no_ktp,
                'jabatan_id' => $request->jabatan_id,
                'foto' => $request->foto,
            ]);
            $member->save();
        } else{
            $data = $this->validate($request, [
                'name' => 'required',
                'email' => 'required',
                'password' => 'required',
                'no_anggota' => 'required',
                'no_ktp' => 'required',
                'jabatan_id' => 'required',
                'foto' => '',
            ]);

            $member->name = $data['name'];
            $member->email = $data['email'];
            $member->password = $data['password'];
            $member->no_anggota = $data['no_anggota'];
            $member->no_ktp = $data['no_ktp'];
            $member->jabatan_id = $data['jabatan_id'];
            $member->foto = $data['foto'];

            $member->save();
        }

        return response()->redirect(route('admin-member'));
    }

    function deleteMember(Request $request){
        $member = $this->users->getById($request->id);
        $member->delete();
    }
}
