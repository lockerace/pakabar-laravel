<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\App;
use App\Models\User;
use Notification;
use App\Notifications\TestNotification;
use App\Models\UserRepository;
use App\Models\JabatanRepository;
use Carbon\Carbon;


class NotificationController extends Controller
{

    function __construct(UserRepository $userRepository, JabatanRepository $jabatanRepository) {
        $this->users = $userRepository;
        $this->jabatan = $jabatanRepository;
    }

    function getNotification(Request $request){
        Carbon::setLocale('id');
        App::setLocale('id');
        $data = [
            'notifikasi' => $request->user()->notifications()->paginate(15),
            'jabatan' => $this->jabatan->getAll(),
            'user' => $this->users->getAll(),
        ];
        if($request->wantsJson()){
            return response()->json($data);
        }
        return view('notifikasi', $data);
    }

    function sendMessage(Request $request){
        $receiver = $request->groupReceiver;
        
        if($request->groupReceiver == "all") {
            $receiver = $this->users->getAll();
        } else if($request->groupReceiver == "single" && $request->singleReceiver != "") {
            $receiver = $this->users->getById($request->singleReceiver);
        } else {
            $receiver = $this->users->getByJabatan($request->groupReceiver);
        }

        $data = [
            'title' => $request->title,
            'message' => $request->message,
        ];
        Notification::send($receiver, new TestNotification($data));

        if($request->wantsJson()){
            return response()->json(null);
        }
        return redirect(route('notification'));
    }

    function sendNewsMessage($id, $header) {
        if($id != 'all')
            $receiver = $this->users->getByJabatan($id);
        else
            $receiver = $this->users->getAll();
        $data = [
            'title' => 'NEWS - ' . $header,
            'message' => 'Berita baru',
        ];
        Notification::send($receiver, new TestNotification($data));
    }

    function sendSuccessVerifyMessage($id){
        $receiver = $this->users->getById($id);
        $data = [
            'title' => "Akun terverifikasi",
            'message' => "Selamat akun telah diverifikasi."
        ];
        Notification::send($receiver, new TestNotification($data));
    }

    function sendVerifyMessage($title, $message){
        $receiver = $this->users->getAdmin();
        $data = [
            'title' => $title,
            'message' => $message,
        ];
        Notification::send($receiver, new TestNotification($data));
    }

    function readNotification(Request $request, $id){
        $notif = $request->user()->unreadNotifications->where('id', $id);

        if(!empty($notif)){
            $notif->markAsRead();
        }

        if($request->wantsJson()){
            return response()->json(null);
        }

        return redirect(route('notification'));
    }
}
