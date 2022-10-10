@extends('layouts.app')

@section('content')
<h1>About Us</h1>

<div class="container text-center">
    <div class="row">
    @foreach($founder as $d)
        <div class="col col-md-4">
            <div class="card">
                <img src="member/{{$d->foto}}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">{{ $d->name }}</h5>
                </div>
            </div>
        </div>
    @endforeach
    </div>
</div>
<div>Description goes here...</div>
@include('footer')
@endsection