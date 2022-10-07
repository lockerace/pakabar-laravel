<?php

namespace App\Models;

class JabatanRepository {
    function getAll() {
        return Jabatan::orderBy('id', 'desc')->get();
    }
    function getById($id) {
        return Jabatan::where('id', $id)->first();
    }
}