@extends('layouts.app')

@section('content')
<div class="container">
  <div class="col-md-8 card m-auto my-5">
    <div class="card-header">Log In</div>
    <div class="card-body">
      <form action="{{ route('login-submit') }}" method="post">
        @csrf
        <div class="mb-3">
          <label class="form-label">Nomor Anggota</label>
          <input class="form-control" name="no_anggota" placeholder="Nomor Anggota" />
        </div>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input class="form-control" name="password" placeholder="Password" type="password" />
        </div>
        <button class="btn btn-primary">Login</button>
      </form>
    </div>
  </div>
</div>
@endsection
