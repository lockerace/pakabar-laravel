<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
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

    function getMember(Request $request){
        $data = [
            'members' => $this->users->getAll(),
            'jabatan' => $this->jabatan->getAll(),
            'deleteUrl' => route('admin-member-delete'),
        ];

        if (!empty($request->token)) {
            $data['token'] = $request->token;
        }

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
            $member->alamat = $request->alamat;
            $member->no_telp = $request->no_telp;
            $member->password = Hash::make($request->password);
            $member->no_anggota = $request->no_anggota;
            $member->no_ktp = $request->no_ktp;
            $member->jabatan_id = $request->jabatan_id;
            if ($request->hasFile('foto')) {
                $member->foto = $request->foto->store('foto');
            }

            $member->save();
        } else{

            $member->name = $request->name;
            $member->email = $request->email;
            $member->alamat = $request->alamat;
            $member->no_telp = $request->no_telp;
            $member->password = Hash::make($request->password);
            $member->no_anggota = $request->no_anggota;
            $member->no_ktp = $request->no_ktp;
            $member->jabatan_id = $request->jabatan_id;
            if ($request->hasFile('foto')) {
                $member->foto = $request->foto->store('foto');
            }

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
            'jabatan' => $this->jabatan->getAll(),
            'deleteUrl' => route('admin-jabatan-delete'),
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

    function getFoto($path) {
        return Storage::download('foto/'.$path);
    }

    function getProfile(Request $request){
        $data = [
            'members' => $this->users->getById($request->user()->id),
            'jabatan' => $this->jabatan->getAll(),
        ];
        return view('profile', $data);
    }

    function updateProfile(Request $request){
        $member = $this->users->getById($request->user()->id);
        $member->email = $request->email;
        $member->password = Hash::make($request->password);

        $member->save();

        return redirect(route('profile'));
    }
}
