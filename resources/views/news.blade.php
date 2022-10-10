@extends('layouts.app')

@section('content')
<div class="full-height d-flex flex-column">
    <div class="flex-fill container pt-5">
      <h1 class="display-3 py-3">{{$judul}}</h1>
      <div>{!!$konten!!}</div>
    </div>
    @include('footer')
</div>
@endsection
