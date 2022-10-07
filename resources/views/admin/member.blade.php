@extends('layouts.app')

@section('content')
<h3>Data Member</h3>
<a class="btn btn-primary" onclick="onMemberEdit()" data-bs-toggle="modal" data-bs-target="#editMemberModal" >Add Member</a>
<br><br>
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
        <h5 class="modal-title">Member</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
        </button>
      </div>
      <div class="modal-body">
            @csrf
            <div class="mb-3">
              <label for="memberEmail" class="form-label">Email address: </label>
                <input id="memberEmail" class="form-control" name="email" placeholder="Email" type="email" required="required" />
            </div>
            <div class="mb-3">
              <label for="memberName" class="form-label">Member Name: </label>
                <input id="memberName" class="form-control" name="name" placeholder="Nama Anggota" required="required" />
            </div>
            <div class="mb-3">
              <label for="memberNoAnggota" class="form-label">No Anggota: </label>
                <input id="memberNoAnggota" class="form-control" name="no_anggota" placeholder="Nomor Anggota" required="required" />
            </div>
            <div class="mb-3">
              <label for="memberPassword" class="form-label">Password: </label>
                <input id="memberPassword" class="form-control" name="password" placeholder="Password" type="password" required="required" />
            </div>
            <div class="mb-3">
              <label for="memberNoKtp" class="form-label">No KTP: </label>
                <input id="memberNoKtp" class="form-control" name="no_ktp" placeholder="Nomor KTP" required="required" />
            </div>
            <div class="mb-3">
              <label for="memberJabatan" class="form-label">Jabatan: </label>
                <select id="memberJabatan" class="form-select" name="jabatan_id">
                  @foreach($jabatan as $d)
                  <option value="{{ $d->id }}">{{ $d->name }}</option>
                  @endforeach
                </select>
            </div>
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
