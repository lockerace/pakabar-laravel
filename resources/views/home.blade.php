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
  </div>
  <footer>
    <div class="py-1 text-center">&copy; {{ date('Y') }}. All rights reserved.</div>
  </footer>
</section>
@endsection
