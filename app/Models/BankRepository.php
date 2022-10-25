<?php

namespace App\Models;

class BankRepository {
    function getAll() {
        return Bank::orderBy('nama_bank', 'asc')->get();
    }
    function getById($id) {
        return Bank::where('id', $id)->first();
    }
    function getActive() {
        return Bank::orderBy('nama_bank', 'asc')->where('status', 'aktif')->get();
    }
}