<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NewsController extends Controller
{
    function getNews() {
        // todo
        return view('admin.news');
    }
}
