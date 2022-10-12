<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\SliderRepository;
use App\Models\Slider;

class SliderController extends Controller
{
    function __construct(SliderRepository $sliderRepository) {
        $this->slider = $sliderRepository;
    }

    function getSlider(){
        $data = [
            'slider' => $this->slider->getAll(),
            'deleteUrl' => route('admin-slider-delete'),
        ];
        return view('admin.slider', $data);
    }

    function editSlider(Request $request){
        $slider = $this->slider->getById($request->id);

        if($slider == null){
            $slider = new Slider;
            if ($request->hasFile('foto')) {
                $slider->foto = $request->foto->store('slider', 'public');
            }
            $slider->url = $request->url;
            $slider->save();
        } else{
            if ($request->hasFile('foto')) {
                $slider->foto = $request->foto->store('slider', 'public');
            }
            $slider->url = $request->url;
            $slider->save();
        }

        return response()->redirectTo(route('admin-slider'));
    }

    function deleteSlider(Request $request){
        $slider = $this->slider->getById($request->id);
        $slider->delete();

        return response()->redirectTo(route('admin-slider'));
    }

    function getFoto($path) {
        return Storage::download(public_path($path));
    }
}
