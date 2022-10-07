@extends('layouts.app')

@section('content')
<form action="{{ route('login-submit') }}" method="post">
    @csrf
    <input name="no_anggota" placeholder="Nomor Anggota" />
    <input name="password" placeholder="Password" type="password" />
    <button>Login</button>
</form>
@endsection
