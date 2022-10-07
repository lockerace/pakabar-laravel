<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserRepository;
use App\Models\NewsRepository;
use App\Models\User;

class UserController extends Controller
{
    function __construct(UserRepository $userRepository, NewsRepository $newsRepository) {
        $this->users = $userRepository;
        $this->news = $newsRepository;
    }

    function getMember($token = null){
        \Log::info($token);
        $data = [
            'members' => $this->users->getAll()
        ];

        return view('admin.member', $data);
    }

    function editMember(Request $request, $id){
        // dd($request, $id);
        $member = $this->users->getById($id);

        if($member == null){
            dd($member);
            $member = new User;
            $member->email = $request->email;
            $member->name = $request->name;
            $member->password = $request->password;
            $member->no_anggota = $request->no_anggota;
            $member->no_ktp = $request->no_ktp;
            $member->jabatan_id = $request->jabatan_id;
            $member->foto = $request->foto;

            $member->save();
        } else{

            $member->name = $request->name;
            $member->email = $request->email;
            $member->password = $request->password;
            $member->no_anggota = $request->no_anggota;
            $member->no_ktp = $request->no_ktp;
            $member->jabatan_id = $request->jabatan_id;
            $member->foto = $request->foto;

            $member->save();
        }

        return response()->redirectTo(route('admin-member'));
    }

    function deleteMember($id){
        $member = $this->users->getById($id);
        $member->delete();

        return response()->redirectTo(route('admin-member'));
    }

    function addMember(){

        return view('admin.createmember');
    }

    function updateMember($id){
        $data = [
            'members' => $this->users->getById($id),
        ];

        return view('admin.updatemember', $data);
    }
}
