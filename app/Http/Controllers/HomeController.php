<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NewsRepository;
use App\Models\UserRepository;
use App\Models\SliderRepository;

use App\Models\JabatanRepository;
use App\Models\News;

use App\Models\Jabatan;

class HomeController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    protected UserRepository $users;
    protected NewsRepository $news;
    protected SliderRepository $slider;
    protected JabatanRepository $jabatan;

    function __construct(NewsRepository $newsRepository, UserRepository $userRepository, SliderRepository $sliderRepository, JabatanRepository $jabatanRepository)
    {
        $this->news = $newsRepository;
        $this->users = $userRepository;
        $this->slider = $sliderRepository;
        $this->jabatan = new JabatanRepository();
    }

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 5);
        $data = [
            // 'news' => $this->news->getAll(),
            'news'   => News::orderByDesc('created_at')->paginate($perPage), // ← here
            'slider' => $this->slider->getActive(),
        ];
        if (!empty($request->token)) {
            $data['token'] = $request->token;
        }
        if ($request->wantsJson()) {
            return response()->json($data);
        }
        return view('home', $data);
    }

    public function aboutUs(Request $request)
    {
        $data = [
            'founder' => $this->users->getFounder(),
        ];

        if ($request->wantsJson()) {
            return response()->json($data);
        }
        return view('aboutus', $data);
    }

    function getMembership(Request $request)
    {

        $members = $this->users->getByJabatan4Member(2);


        $data = [
            'members' => $members,

            
            'city' => $this->users->getCity(),
            'state' => $this->users->getState(),
            'hometown' => $this->users->getHometown(),
            'birthplace' => $this->users->getBirthplace(),

        ];


        return response()->json($data);
    }
}
