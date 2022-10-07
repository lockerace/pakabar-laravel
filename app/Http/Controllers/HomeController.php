<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NewsRepository;
use App\Models\News;

class HomeController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */

    function __construct(NewsRepository $newsRepository) {
        $this->news = $newsRepository;
    }

    public function index()
    {
        $data = [
            'news' => $this->news->getAll(),
        ];
        return view('home', $data);
    }

}
