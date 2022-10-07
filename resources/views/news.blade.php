@extends('layouts.app')

@section('content')
<h1>{{$judul}}</h1>
<div>{!!$konten!!}</div>
@include('footer')
@endsection