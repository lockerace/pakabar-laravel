@extends('layouts.app')

@section('content')
<div class="full-height d-flex flex-column">
    <div class="flex-fill container pt-5">
        <h1 class="display-1">About Us</h1>
        <div>Description goes here...</div>

        <div class="row pt-5">
        @foreach($founder as $d)
            <div class="col col-md-4">
                <div class="card">
                    @if (empty($d->foto))
                        <div class="w-100 ratio-1 position-relative">
                            <div class="slider-content d-flex justify-content-center align-items-center">
                                <i class="material-icons d-block display-1">person</i>
                            </div>
                        </div>
                    @else
                        <img src="member/{{$d->foto}}" class="card-img-top" alt="...">
                    @endif
                    <div class="card-body">
                        <h5 class="card-title text-center">{{ $d->name }}</h5>
                    </div>
                </div>
            </div>
        @endforeach
        </div>
    </div>
    @include('footer')
</div>
@endsection
