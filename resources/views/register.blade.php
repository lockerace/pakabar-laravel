@extends('layouts.app')

@section('content')
<div class="container">
  <div class="col-md-8 card m-auto my-5">
    <div class="card-header">Register</div>
    <div class="card-body">
      <form action="{{ route('register-submit') }}" method="post">
        @csrf
        <div class="mb-3">
          <label class="form-label">Nama</label>
          <input class="form-control" name="name" required="required" placeholder="Nama" />
        </div>
        <div class="mb-3">
          <label class="form-label">Alamat</label>
          <input class="form-control" name="alamat" required="required" placeholder="Alamat" />
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input class="form-control" name="email" required="required" type="email" placeholder="Email" />
        </div>
        <div class="mb-3">
          <label class="form-label">No telepon</label>
          <input class="form-control" name="no_telp" required="required" placeholder="No Telepon" />
        </div>
        <div class="mb-3">
          <label class="form-label">No KTP</label>
          <input class="form-control" name="no_ktp" required="required" placeholder="No KTP" />
        </div>
        <div class="mb-3">
          <label class="form-label">Nomor Anggota</label>
          <input class="form-control" name="no_anggota" required="required" placeholder="Nomor Anggota" />
        </div>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input class="form-control" name="password" required="required" placeholder="Password" type="password" />
        </div>
        <button class="btn btn-primary">Register</button>
      </form>
    </div>
  </div>
</div>
@endsection
