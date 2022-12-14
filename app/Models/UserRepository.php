<?php

namespace App\Models;

class UserRepository {
    function getAll() {
        return User::orderBy('created_at', 'desc')->with(['jabatan'])->get();
    }
    function getById($id) {
        return User::where('id', $id)->with(['jabatan', 'notifications', 'unreadNotifications'])->first();
    }
    function getLastUser(){
        return User::orderBy('id', 'desc')->first();
    }
    function getByJabatan($id){
        return User::where('jabatan_id', $id)->orderBy('created_at', 'desc')->with(['jabatan'])->get();
    }
    function getFounder(){
        return User::where('jabatan_id', 3)->get();
    }
    function getAdmin(){
        return User::where('jabatan_id', 1)->get();
    }
    function getAllMember(){
        return User::where('jabatan_id', '!=', '1')->get();
    }
}
