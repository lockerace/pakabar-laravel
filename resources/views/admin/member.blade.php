@extends('layouts.app')

@section('content')
<h3>Data Member</h3>
<a href="{{ route('admin-member-submit') }}">Add Member</a>

<table class="table table-bordered">
<tr>
    <th>Nama</th>
    <th>Nomor Anggota</th>
    <th>Aksi</th>
</tr>
@foreach($members as $d)
<tr>
    <td>{{ $d->name }}</td>
    <td>{{ $d->no_anggota }}</td>
    <td><a href="{{ route('admin-member-update', $d->id) }}">Edit</a></td>
    <td><a onclick="return confirm('Are you sure?')" href="{{ route('admin-member-delete', $d->id) }}">Hapus</a></td>
</tr>
@endforeach
</table>
@endsection
