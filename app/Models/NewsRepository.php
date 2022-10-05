<?php

namespace App\Models;

class NewsRepository {
    function getAll() {
        return News::orderBy('created_at', 'desc')->get();
    }
    function getById($id) {
        return News::where('id', $id)->first();
    }
}