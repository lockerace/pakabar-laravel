<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\UserRepository;
use App\Models\JabatanRepository;
use App\Models\NewsRepository;
use App\Models\User;
use App\Models\Jabatan;

class UserController extends Controller
{
    function __construct(UserRepository $userRepository, NewsRepository $newsRepository, JabatanRepository $jabatanRepository) {
        $this->users = $userRepository;
        $this->news = $newsRepository;
        $this->jabatan = $jabatanRepository;
    }

    function getMember($token = null){
        \Log::info($token);
        $data = [
            'members' => $this->users->getAll(),
            'jabatan' => $this->jabatan->getAll(),
        ];

        return view('admin.member', $data);
    }

    function editMember(Request $request){
        // dd($request->all());
        $member = $this->users->getById($request->id);

        if($member == null){
            // dd($member);
            $member = new User;
            $member->email = $request->email;
            $member->name = $request->name;
            $member->password = Hash::make($request->password);
            $member->no_anggota = $request->no_anggota;
            $member->no_ktp = $request->no_ktp;
            $member->jabatan_id = $request->jabatan_id;
            $member->foto = $request->foto;

            $member->save();
        } else{

            $member->name = $request->name;
            $member->email = $request->email;
            $member->password = Hash::make($request->password);
            $member->no_anggota = $request->no_anggota;
            $member->no_ktp = $request->no_ktp;
            $member->jabatan_id = $request->jabatan_id;
            $member->foto = $request->foto;

            $member->save();
        }

        return response()->redirectTo(route('admin-member'));
    }

    function deleteMember(Request $request){
        $member = $this->users->getById($request->id);
        $member->delete();

        return response()->redirectTo(route('admin-member'));
    }

    function getJabatan(){
        $data = [
            'jabatan' => $this->jabatan->getAll()
        ];

        return view('admin.jabatan', $data);
    }

    function editJabatan(Request $request){
        // dd($request->all());
        $jabatan = $this->jabatan->getById($request->id);

        if($jabatan == null){
            // dd($jabatan);
            $jabatan = new Jabatan;
            $jabatan->name = $request->name;
            $jabatan->save();
        } else{
            $jabatan->name = $request->name;
            $jabatan->save();
        }

        return response()->redirectTo(route('admin-jabatan'));
    }

    function deleteJabatan(Request $request){
        $jabatan = $this->jabatan->getById($request->id);
        $jabatan->delete();

        return response()->redirectTo(route('admin-jabatan'));
    }
}
