@extends('layouts.app')

@section('content')
<h3>Data Jabatan</h3>
<a class="btn btn-primary" onclick="onJabatanEdit()" data-bs-toggle="modal" data-bs-target="#editJabatanModal" >Add Jabatan</a>
<br><br>
<table class="table table-bordered">
<tr>
    <th>Nama Jabatan</th>
    <th>ID Jabatan</th>
    <th>Aksi</th>
</tr>
@foreach($jabatan as $d)
<tr>
    <td>{{ $d->name }}</td>
    <td>{{ $d->id }}</td>
    <td><a class="btn btn-primary" onclick="onJabatanEdit(this)" data-jabatan="{{$d}}" data-bs-toggle="modal" data-bs-target="#editJabatanModal">Edit</a></td>
    <td><a onclick="return confirm('Are you sure?')" href="{{ route('admin-jabatan-delete', $d->id) }}">Hapus</a></td>
</tr>
@endforeach
</table>
<form action="{{ route('admin-jabatan-submit') }}" method="post">
<div id="editJabatanModal" class="modal" tabindex="-1" role="dialog">
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
            <input id="jabatanName" name="name" placeholder="Nama Jabatan" required="required" />
            <input id="jabatanId" name="id" type="hidden" value=""/>
      </div>
      <div class="modal-footer">
        <button  class="btn btn-primary">Save changes</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div> 
  </div>
  </form>
@endsection
