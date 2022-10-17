<?php

namespace App\Models;

class BankRepository {
    function getAll() {
        return Bank::orderBy('id', 'desc')->get();
    }
    function getById($id) {
        return Bank::where('id', $id)->first();
    }
}