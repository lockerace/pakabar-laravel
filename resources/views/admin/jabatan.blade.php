@extends('layouts.app')

@section('content')
<div class="container py-5">
  <h3>Data Jabatan</h3>
  <a class="btn btn-primary mb-3" onclick="onJabatanEdit()" data-bs-toggle="modal" data-bs-target="#editJabatanModal" >Add Jabatan</a>
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
      <td>
        <a class="btn btn-primary" onclick="onJabatanEdit(this)" data-jabatan="{{$d}}" data-bs-toggle="modal" data-bs-target="#editJabatanModal">Edit</a>
        <form action="{{ route('admin-jabatan-delete') }}" method="post">
        @csrf
            <input type="hidden" name="id" value="{{$d->id}}"/>
            <button class="btn btn-danger" onclick="return confirm('Are you sure?')">Hapus</button>
        </form>
      </td>
  </tr>
  @endforeach
  </table>
  <form action="{{ route('admin-jabatan-submit') }}" method="post">
  <div id="editJabatanModal" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Jabatan</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
          </button>
        </div>
        <div class="modal-body">
              @csrf
              <div class="mb-3">
                <label for="jabatanName" class="form-label">Nama Jabatan: </label>
                <input id="jabatanName" class="form-control" name="name" placeholder="Nama Jabatan" required="required" />
              </div>
              <input id="jabatanId" name="id" type="hidden" value=""/>
        </div>
        <div class="modal-footer">
          <button  class="btn btn-primary">Save changes</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </form>
</div>
@endsection
