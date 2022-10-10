<?php

namespace App\Models;

class UserRepository {
    function getAll() {
        return User::orderBy('created_at', 'desc')->get();
    }
    function getById($id) {
        return User::where('id', $id)->first();
    }
    function getFounder(){
        return User::where('jabatan_id', 3)->get();
    }
}