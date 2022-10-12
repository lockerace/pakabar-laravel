@extends('layouts.app')

@section('content')
<section class="full-height d-flex flex-column">
  

<div id="carouselExampleIndicators" class="carousel slide w-100 " data-bs-ride="true">
  <div class="carousel-indicators">
    @foreach($slider as $d)
    @if($loop->index == 0)
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true"></button>
    @else
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="{{$loop->index}}"></button>
    @endif
    @endforeach
  </div>
  <div class="carousel-inner">
    @foreach($slider as $d)
    @if($loop->index == 0)
    <div class="carousel-item slider active">
        <div class="slider-content">
          <a href="{{$d->url}}"><img src="storage/{{$d->foto}}" class="d-block w-100" alt="..."></a>
        </div>
    </div>
    @else
    <div class="carousel-item slider">
        <div class="slider-content">
          <a href="{{$d->url}}"><img src="storage/{{$d->foto}}" class="d-block w-100" alt="..."></a>
        </div>
    </div>
    @endif
    @endforeach
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
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
