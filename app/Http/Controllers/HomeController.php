<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NewsRepository;
use App\Models\UserRepository;
use App\Models\SliderRepository;
use App\Models\News;

class HomeController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */

    function __construct(NewsRepository $newsRepository, UserRepository $userRepository, SliderRepository $sliderRepository) {
        $this->news = $newsRepository;
        $this->user = $userRepository;
        $this->slider = $sliderRepository;
    }

    public function index(Request $request)
    {
        $data = [
            'news' => $this->news->getAll(),
            'slider' => $this->slider->getActive(),
        ];
        if (!empty($request->token)) {
            $data['token'] = $request->token;
        }
        if($request->wantsJson()){
            return response()->json($data);
        }
        return view('home', $data);
    }

    public function aboutUs(Request $request){
        $data = [
            'founder' => $this->user->getFounder(),
        ];

        if($request->wantsJson()){
            return response()->json($data);
        }
        return view('aboutus', $data);
    }

}
