<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NewsRepository;
use App\Models\UserRepository;
use App\Models\News;

class HomeController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */

    function __construct(NewsRepository $newsRepository, UserRepository $userRepository) {
        $this->news = $newsRepository;
        $this->user = $userRepository;
    }

    public function index()
    {
        $data = [
            'news' => $this->news->getAll(),
        ];
        return view('home', $data);
    }

    public function aboutUs(){
        $data = [
            'founder' => $this->user->getFounder(),
        ];

        return view('aboutus', $data);
    }

}
