@extends('layouts.app')

@section('content')
<section class="full-height d-flex flex-column">
  <div class="slider mb-5">
    <div class="slider-content d-flex justify-content-center align-items-center fs-1">Slider</div>
  </div>
  <div class="flex-fill container">
      <div>
        <h2>News</h2>
      </div>
      <ul class="list-group">
        @foreach($news as $d)
          <a href="news/{{$d->id}}"><li class="list-group-item d-flex justify-content-between align-items-center">{{ $d->judul }}
            <span class="badge bg-primary rounded-pill">{{ $d->created_at }}</span></li></a>
        @endforeach
      </ul>
  </div>
  <footer>
    <div class="py-1 text-center">&copy; {{ date('Y') }}. All rights reserved.</div>
  </footer>
</section>
@endsection
