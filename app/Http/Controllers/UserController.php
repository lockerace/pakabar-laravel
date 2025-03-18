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
    protected UserRepository $users;
    protected NewsRepository $news;
    protected JabatanRepository $jabatan;
    protected NotificationController $notification;
    function __construct(UserRepository $userRepository, NewsRepository $newsRepository, JabatanRepository $jabatanRepository, NotificationController $notificationController)
    {
        $this->users = $userRepository;
        $this->news = $newsRepository;
        $this->jabatan = $jabatanRepository;
        $this->notification = $notificationController;
    }

    function getMember(Request $request)
    {
        $myOption = $request->id;
        $members = [];

        if (!empty($myOption))
            $members = $this->users->getByJabatan($myOption);
        else
            $members = $this->users->getAll();
        $data = [
            'members' => $members,
            'jabatan' => $this->jabatan->getAll(),
            'deleteUrl' => route('admin-member-delete'),
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
        return view('admin.member', $data);
    }

    function editMember(Request $request)
    {
        $member = $this->users->getById($request->id);

        if ($member == null) {
            $lastUser = $this->users->getLastUser();
            $request->validate(
                [
                    'foto' => 'required',
                    'foto_selfie_ktp' => 'required',
                    'email' => 'unique:users,email,',
                    'no_telp' => 'required|regex:/^\+?\d{1,15}$/|unique:users,no_telp,' . $request->user()->id,
                    'no_ktp' => 'required|digits:16|unique:users,no_ktp,' . $request->user()->id,
                    'no_anggota' => 'unique:users,no_anggota,',
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
                    'no_anggota.unique' => 'Nomor Anggota tidak tersedia'
                ]
            );

            $member = new User;
            $member->email = $request->email;
            $member->name = $request->name;
            $member->alamat = $request->alamat;
            $member->no_telp = $request->no_telp;
            $member->bloodtype = $request->bloodtype;
            $member->religion = $request->religion;
            $member->marriage = $request->marriage;

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

            $member->password = Hash::make($request->password);
            if (!$request->has('no_anggota')) {
                $member->no_anggota = 'PKB0001';
            } else {
                $member->no_anggota = $request->no_anggota;
            }

            $member->no_ktp = $request->no_ktp;
            $member->jabatan_id = $request->jabatan_id;
            $member->status = $request->status;

            if ($request->hasFile('foto')) {
                $member->foto = $request->foto->store('foto');
            }
            if ($request->hasFile('foto_selfie_ktp')) {
                $member->fotoSelfie = $request->fotoSelfie->store('foto_selfie_ktp');
            }

            $member->save();
        } else {
            $request->validate(
                [
                    'email' => 'unique:users,email,' . $member->id,
                    'no_telp' => 'required|regex:/^\+?\d{1,15}$/|unique:users,no_telp,' . $member->id,
                    'no_ktp' => 'required|digits:16|unique:users,no_ktp,' . $member->id,
                    'no_anggota' => 'unique:users,no_anggota,' . $member->id,
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
                    'no_anggota.unique' => 'Nomor Anggota tidak tersedia'
                ]
            );

            $member->name = $request->name;
            $member->email = $request->email;
            $member->alamat = $request->alamat;
            $member->no_telp = $request->no_telp;
            if ($request->has('password')) $member->password = Hash::make($request->password);
            $member->no_anggota = $request->no_anggota;
            $member->no_ktp = $request->no_ktp;
            $member->jabatan_id = $request->jabatan_id;
            $member->status = $request->status;

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
                $member->foto = $request->foto->store('foto');
            }
            if ($request->hasFile('foto_selfie_ktp')) {
                $member->foto_selfie_ktp = $request->foto_selfie_ktp->store('foto_selfie_ktp');
            }

            $member->save();
        }
        if ($request->wantsJson()) {
            return response()->json(NULL);
        }

        return response()->redirectTo(route('admin-member'));
    }

    function deleteMember(Request $request)
    {
        $member = $this->users->getById($request->id);
        $member->delete();

        return response()->redirectTo(route('admin-member'));
    }

    function verifyMember($id)
    {
        $member = $this->users->getById($id);
        $member->status = 1;
        $member->save();

        $this->notification->sendSuccessVerifyMessage($member->id);

        return response()->redirectTo(route('admin-member'));
    }

    function getJabatan(Request $request)
    {
        $data = [
            'jabatan' => $this->jabatan->getAll(),
            'deleteUrl' => route('admin-jabatan-delete'),
        ];
        if ($request->wantsJson()) {
            return response()->json($data);
        }
        return view('admin.jabatan', $data);
    }

    function editJabatan(Request $request)
    {
        $jabatan = $this->jabatan->getById($request->id);

        if ($jabatan == null) {
            $request->validate(
                [
                    'name' => 'unique:jabatan',
                ],
                [
                    'name.unique' => 'Jabatan tidak tersedia',
                ]
            );

            $jabatan = new Jabatan;
            $jabatan->name = $request->name;
            $jabatan->save();
        } else {
            $request->validate([
                'name' => 'unique:jabatan,name,' . $jabatan->id,
            ]);

            $jabatan->name = $request->name;
            $jabatan->save();
        }

        if ($request->wantsJson()) {
            return response()->json(NULL);
        }
        return response()->redirectTo(route('admin-jabatan'));
    }

    function deleteJabatan(Request $request)
    {
        $jabatan = $this->jabatan->getById($request->id);
        $jabatan->delete();

        return response()->redirectTo(route('admin-jabatan'));
    }

    function getFoto($path)
    {
        return Storage::download('foto/' . $path);
    }

    function getFotoSelfie($path)
    {
        return Storage::download('foto_selfie_ktp/' . $path);
    }

    function getProfile(Request $request)
    {
        $data = [
            'member' => $this->users->getById($request->user()->id),
            'jabatan' => $this->jabatan->getAll(),
        ];
        if ($request->wantsJson()) {
            return response()->json($data);
        }
        return view('profile', $data);
    }

    function updateProfile(Request $request)
    {
        $member = $this->users->getById($request->user()->id);

        $request->validate(
            [
                'email' => 'unique:users,email,' . $member->id,
                'password' => 'required_with:conf_password|same:conf_password',
            ],
            [
                'password.same' => 'Password tidak sama',
                'password.required_with' => 'Password belum terisi'
            ]
        );

        $member->email = $request->email;
        $member->password = Hash::make($request->password);

        $member->save();

        if ($request->wantsJson()) {
            return response()->json(NULL);
        }
        return redirect(route('profile'));
    }
}
