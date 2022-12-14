<?php

namespace App\Models;

class SliderRepository {
    function getAll() {
        return Slider::orderBy('id', 'desc')->get();
    }
    function getById($id) {
        return Slider::where('id', $id)->first();
    }
    function getActive(){
        return Slider::where('status', 'aktif')->orderBy('id', 'desc')->get();
    }
}