<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NewsRepository;
use App\Models\News;


class NewsController extends Controller
{
    function __construct(NewsRepository $newsRepository) {
        $this->news = $newsRepository;
    }

    function getNewsDetail($id){

        $news = $this->news->getById($id);

        $data = [
            'judul' => $news->judul,
            'konten' => $news->konten,
        ];

        return view('news', $data);
    }

    function getNews() {
        $data = [
            'news' => $this->news->getAll(),
            'deleteUrl' => route('admin-news-delete'),
        ];

        return view('admin.news', $data);
    }

    function editNews(Request $request){
        // dd($request->all());
        $news = $this->news->getById($request->id);

        if($news == null){
            // dd($news);
            $news = new News;
            $news->judul = $request->judul;
            $news->konten = $request->konten;
            $news->save();
        } else{
            $news->judul = $request->judul;
            $news->konten = $request->konten;
            $news->save();
        }

        return response()->redirectTo(route('admin-news'));
    }

    function deleteNews(Request $request){
        $news = $this->news->getById($request->id);
        $news->delete();

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
