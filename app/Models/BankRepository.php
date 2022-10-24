<?php

namespace App\Models;

class BankRepository {
    function getAll() {
        return Bank::orderBy('nama_bank', 'asc')->get();
    }
    function getById($id) {
        return Bank::where('id', $id)->first();
    }
}