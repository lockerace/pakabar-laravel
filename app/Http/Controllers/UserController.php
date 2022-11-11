<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use App\Models\UserRepository;
use App\Models\JabatanRepository;
use App\Models\NewsRepository;
use App\Models\User;
use App\Models\Jabatan;

class UserController extends Controller
{
    function __construct(UserRepository $userRepository, NewsRepository $newsRepository, JabatanRepository $jabatanRepository, NotificationController $notificationController) {
        $this->users = $userRepository;
        $this->news = $newsRepository;
        $this->jabatan = $jabatanRepository;
        $this->notification = $notificationController;

    }

    function getMember(Request $request){
        $myOption = $request->id;
        $members = [];
        if(!empty($myOption))
            $members = $this->users->getByJabatan($myOption);
        else
            $members = $this->users->getAll();
        $data = [
            'members' => $members,
            'jabatan' => $this->jabatan->getAll(),
            'deleteUrl' => route('admin-member-delete'),
        ];

        if($request->wantsJson()){
            return response()->json($data);
        }

        if (!empty($request->token)) {
            $data['token'] = $request->token;
        }
        return view('admin.member', $data);
    }

    function editMember(Request $request){
        $member = $this->users->getById($request->id);

        if($member == null){
            $lastUser = $this->users->getLastUser();
            $request->validate([
                'foto' => 'required',
                'email' => 'unique:users,email,',
                'no_telp' => 'unique:users,no_telp,',
                'no_ktp' => 'unique:users,no_ktp,',
                'no_anggota' => 'unique:users,no_anggota,',
            ],
            [
                'foto.required' => 'Foto belum terisi',
                'email.unique' => 'Email tidak tersedia',
                'no_telp.unique' => 'Nomor Telepon tidak tersedia',
                'no_ktp.unique' => 'Nomor KTP tidak tersedia',
                'no_anggota.unique' => 'Nomor Anggota tidak tersedia'
            ]);

            $member = new User;
            $member->email = $request->email;
            $member->name = $request->name;
            $member->alamat = $request->alamat;
            $member->no_telp = $request->no_telp;
            $member->password = Hash::make($request->password);
            $member->no_anggota = $request->no_anggota;
            $member->no_ktp = $request->no_ktp;
            $member->jabatan_id = $request->jabatan_id;
            $member->status = $request->status;

            if ($request->hasFile('foto')) {
                $member->foto = $request->foto->store('foto');
            }
            $member->save();
        } else{
            $request->validate([
                'email' => 'unique:users,email,'.$member->id,
                'no_telp' => 'unique:users,no_telp,'.$member->id,
                'no_ktp' => 'unique:users,no_ktp,'.$member->id,
                'no_anggota' => 'unique:users,no_anggota,'.$member->id,
            ]);

            $member->name = $request->name;
            $member->email = $request->email;
            $member->alamat = $request->alamat;
            $member->no_telp = $request->no_telp;
            $member->password = Hash::make($request->password);
            $member->no_anggota = $request->no_anggota;
            $member->no_ktp = $request->no_ktp;
            $member->jabatan_id = $request->jabatan_id;
            $member->status = $request->status;
            if ($request->hasFile('foto')) {
                $member->foto = $request->foto->store('foto');
            }

            $member->save();
        }
        if($request->wantsJson()){
            return response()->json(NULL);
        }

        return response()->redirectTo(route('admin-member'));
    }

    function deleteMember(Request $request){
        $member = $this->users->getById($request->id);
        $member->delete();

        return response()->redirectTo(route('admin-member'));
    }

    function verifyMember($id){
        $member = $this->users->getById($id);
        $member->status = 1;
        $member->save();

        $this->notification->sendSuccessVerifyMessage($member->id);

        return response()->redirectTo(route('admin-member'));
    }

    function getJabatan(Request $request){
        $data = [
            'jabatan' => $this->jabatan->getAll(),
            'deleteUrl' => route('admin-jabatan-delete'),
        ];
        if($request->wantsJson()){
            return response()->json($data);
        }
        return view('admin.jabatan', $data);
    }

    function editJabatan(Request $request){
        $jabatan = $this->jabatan->getById($request->id);

        if($jabatan == null){
            $request->validate([
                'name' => 'unique:jabatan',
            ],
            [
                'name.unique' => 'Jabatan tidak tersedia',
            ]);

            $jabatan = new Jabatan;
            $jabatan->name = $request->name;
            $jabatan->save();
        } else{
            $request->validate([
                'name' => 'unique:jabatan,name,'.$jabatan->id,
            ]);

            $jabatan->name = $request->name;
            $jabatan->save();
        }

        if($request->wantsJson()){
            return response()->json(NULL);
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

    function getFotoSelfie($path) {
        return Storage::download('fotoSelfie/'.$path);
    }

    function getProfile(Request $request){
        $data = [
            'member' => $this->users->getById($request->user()->id),
            'jabatan' => $this->jabatan->getAll(),
        ];
        if($request->wantsJson()){
            return response()->json($data);
        }
        return view('profile', $data);
    }

    function updateProfile(Request $request){
        $member = $this->users->getById($request->user()->id);

        $request->validate([
            'email' => 'unique:users,email,'.$member->id,
            'password' => 'required_with:conf_password|same:conf_password',
        ],
        [
            'password.same' => 'Password tidak sama',
            'password.required_with' => 'Password belum terisi'
        ]);

        $member->email = $request->email;
        $member->password = Hash::make($request->password);

        $member->save();

        if($request->wantsJson()){
            return response()->json(NULL);
        }
        return redirect(route('profile'));
    }
}
