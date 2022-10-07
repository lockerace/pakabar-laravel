@extends('layouts.app')

@section('content')
<h3>Data Member</h3>
<a class="btn btn-primary" onclick="onMemberEdit()" data-bs-toggle="modal" data-bs-target="#editMemberModal" >Add Member</a>

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
    <td><a class="btn btn-primary" onclick="onMemberEdit(this)" data-member="{{$d}}" data-bs-toggle="modal" data-bs-target="#editMemberModal">Edit</a></td>
    <td><a onclick="return confirm('Are you sure?')" href="{{ route('admin-member-delete', $d->id) }}">Hapus</a></td>
</tr>
@endforeach
</table>
<form action="{{ route('admin-member-submit') }}" method="post">
<div id="editMemberModal" class="modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
            @csrf
            <input id="memberEmail" name="email" placeholder="Email" type="email" required="required" />
            <input id="memberName" name="name" placeholder="Nama Anggota" required="required" />
            <input id="memberNoAnggota" name="no_anggota" placeholder="Nomor Anggota" required="required" />
            <input id="memberPassword" name="password" placeholder="Password" type="password" required="required" />
            <input id="memberNoKtp" name="no_ktp" placeholder="Nomor KTP" required="required" />
            <input id="memberJabatan" name="jabatan_id" placeholder="ID Jabatan" required="required" />
            <input id="memberId" name="id" type="hidden" value=""/>
      </div>
      <div class="modal-footer">
        <button  class="btn btn-primary">Save changes</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div> 
  </div>
  </form>
@endsection
