<?php

namespace App\Models;

class NewsRepository {
    function getAll() {
        return News::orderBy('created_at', 'desc')->get();
    }
    function getById($id) {
        return News::where('id', $id)->first();
    }
     function paginate(int $perPage = 10)
    {
        // same ordering, but let Eloquent handle pages
        return News::orderByDesc('created_at')->paginate($perPage);
    }
}