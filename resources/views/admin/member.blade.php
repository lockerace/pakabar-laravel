@extends('layouts.app')

@section('content')
<div class="container py-5">
    <h3>Data Anggota</h3>
    <div class="d-flex flex-row justify-content-end">
        <a class="btn btn-primary mb-3 d-flex flex-row" onclick="onMemberEdit()" data-bs-toggle="modal" data-bs-target="#editMemberModal" >
            <i class="material-icons d-block">add</i>
            <span>Tambah Anggota</span>
        </a>
    </div>
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
            <td>
              <div class="d-flex flex-row gap-2">
                <a class="btn btn-link text-primary text-decoration-none d-flex flex-row" onclick="onMemberEdit(this)" data-member="{{$d}}" data-bs-toggle="modal" data-bs-target="#editMemberModal">
                  <i class="material-icons d-block">edit</i>
                  <span>Edit</span>
                </a>
                <a class="btn btn-link text-danger text-decoration-none d-flex flex-row" onclick="onConfirmDelete(this)" data-deleteid="{{$d->id}}" data-bs-toggle="modal" data-bs-target="#deleteModal"">
                  <i class="material-icons d-block">delete</i>
                  <span>Hapus<span>
                </a>
              </div>
            </td>
        </tr>
        @endforeach
    </table>
    <form action="{{ route('admin-member-submit') }}" method="post" enctype="multipart/form-data">
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
                            <label for="memberEmail" class="form-label">Email: </label>
                            <input id="memberEmail" class="form-control" name="email" placeholder="Email" type="email" required="required" />
                        </div>
                        <div class="mb-3">
                            <label for="memberName" class="form-label">Nama Anggota: </label>
                            <input id="memberName" class="form-control" name="name" placeholder="Nama Anggota" required="required" />
                        </div>
                        <div class="mb-3">
                            <label for="memberAlamat" class="form-label">Alamat: </label>
                            <input id="memberAlamat" class="form-control" name="alamat" placeholder="Alamat" required="required" />
                        </div>
                        <div class="mb-3">
                            <label for="memberNoTelp" class="form-label">No Telpon: </label>
                            <input id="memberNoTelp" class="form-control" name="no_telp" placeholder="Nomor Telepon" required="required" />
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
                        <div class="mb-3">
                            <label for="memberFoto" class="form-label">Foto: </label>
                            <div id="fotoPlaceholder" onclick="selectFile('memberFoto')">
                              <div class="btn input-photo d-flex justify-content-center align-items-center btn-outline-dark">
                                Pilih Foto
                              </div>
                            </div>
                            <input id="memberFoto" class="form-control d-none" name="foto" type="file" placeholder="Foto" accept="image/png, image/jpeg" onchange="onSelectFileChanged(this, 'fotoPlaceholder')" />
                        </div>
                        <input id="memberId" name="id" type="hidden" value=""/>
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
