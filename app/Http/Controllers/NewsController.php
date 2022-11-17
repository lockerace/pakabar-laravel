<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NewsRepository;
use App\Models\JabatanRepository;
use App\Models\News;


class NewsController extends Controller
{
    function __construct(NewsRepository $newsRepository, JabatanRepository $jabatanRepository, NotificationController $notificationController) {
        $this->news = $newsRepository;
        $this->jabatan = $jabatanRepository;
        $this->notification = $notificationController;
    }

    function getNewsDetail($id, Request $request){

        $news = $this->news->getById($id);

        $data = [
            'judul' => $news->judul,
            'konten' => $news->konten,
        ];

        if($request->wantsJson()){
            return response()->json($data);
        }
        return view('news', $data);
    }

    function getNews(Request $request) {
        $data = [
            'news' => $this->news->getAll(),
            'jabatan' => $this->jabatan->getAll(),
            'deleteUrl' => route('admin-news-delete'),
        ];

        if($request->wantsJson()){
            return response()->json($data);
        }
        return view('admin.news', $data);
    }

    function editNews(Request $request){
        // dd($request->all());
        $news = $this->news->getById($request->id);

        $request->validate([
            'judul' => 'required',
            'konten' => 'required',
        ]);

        if($news == null){
            $news = new News;
            $news->judul = $request->judul;
            $news->konten = $request->konten;
            $news->save();

            if($request->receiver) {
                $this->notification->sendNewsMessage($request->receiver, $request->judul);
            }
        } else{
            $news->judul = $request->judul;
            $news->konten = $request->konten;
            $news->save();
        }

        if($request->wantsJson()){
            return response()->json(null);
        }
        return response()->redirectTo(route('admin-news'));
    }

    function deleteNews(Request $request){
        $news = $this->news->getById($request->id);
        $news->delete();

        if($request->wantsJson()){
            return response()->json(null);
        }
        return response()->redirectTo(route('admin-news'));
    }

    function uploadImageNews(Request $request) {
        if ($request->hasFile('upload')) {
            $path = $request->file('upload')->store('news/images', 'public');
            return response()->json([
                'uploaded' => true,
                'fileName' => $path,
                'url' => '/storage/'.$path
            ]);
        } else {
            return response()->json([
                'uploaded' => false,
            ]);
        }
    }
}
