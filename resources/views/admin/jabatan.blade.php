@extends('layouts.app')

@section('content')
<div class="container py-5">
    <h3>Data Jabatan</h3>
    <div class="d-flex flex-row justify-content-end">
        <a class="btn btn-primary mb-3 d-flex flex-row" onclick="onJabatanEdit()" data-bs-toggle="modal" data-bs-target="#editJabatanModal" >
            <i class="material-icons d-block">add</i>
            <span>Tambah</span>
        </a>
    </div>
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
          <div class="d-flex flex-row gap-2">
            <a class="btn btn-link text-primary text-decoration-none d-flex flex-row" onclick="onJabatanEdit(this)" data-jabatan="{{$d}}" data-bs-toggle="modal" data-bs-target="#editJabatanModal">
              <i class="material-icons d-block">edit</i>
              <span>Edit</span>
            </a>
            <a class="btn btn-link text-danger text-decoration-none d-flex flex-row" onclick="onConfirmDelete(this)" data-deleteid="{{$d->id}}" data-bs-toggle="modal" data-bs-target="#deleteModal">
              <i class="material-icons d-block">delete</i>
              <span>Hapus<span>
            </a>
          </div>
        </td>
    </tr>
    @endforeach
    </table>
    <form action="{{ route('admin-jabatan-submit') }}" method="post">
        <div id="editJabatanModal" class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Jabatan</h5>
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
                        <button  class="btn btn-primary">Simpan</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
    @include('admin.modalconfirm')
</div>
@endsection
