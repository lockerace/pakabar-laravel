@extends('layouts.app')

@section('content')
<div class="container py-5">
    <h3>Profil Anggota</h3>
    <div class="d-flex flex-row justify-content-end">
        <a class="btn btn-primary mb-3 d-flex flex-row" onclick="onMemberEdit(this)" data-member="{{$members}}" data-bs-toggle="modal" data-bs-target="#editMemberModal" >
            <i class="material-icons d-block">edit</i>
            <span>Edit</span>
        </a>
    </div>

    <div class="row">
        <div class="col col-md-4">
            <div class="card">
                @if (empty($members->foto))
                    <div class="w-100 ratio-1 position-relative">
                        <div class="slider-content d-flex justify-content-center align-items-center">
                            <i class="material-icons d-block display-1">person</i>
                        </div>
                    </div>
                @else
                    <img src="member/{{$members->foto}}" class="card-img-top" alt="...">
                @endif
                <div class="card-body">
                    <h5 class="card-title text-center">{{ $members->name }}</h5>
                </div>
            </div>
        </div>

        <div class="col col-md-8">
            <div class="mb-3">
                <label class="form-label">Email</label>
                <input disabled class="form-control" value="{{$members->email}}" placeholder="Email" />
            </div>
            <div class="mb-3">
                <label class="form-label">Nama Anggota</label>
                <input disabled class="form-control" value="{{$members->name}}" placeholder="Email" />
            </div>
            <div class="mb-3">
                <label class="form-label">Alamat</label>
                <input disabled class="form-control" value="{{$members->alamat}}" placeholder="Email" />
            </div>
            <div class="mb-3">
                <label class="form-label">Nomor Telepon</label>
                <input disabled class="form-control" value="{{$members->no_telp}}" placeholder="Email" />
            </div>
            <div class="mb-3">
                <label class="form-label">Nomor Anggota</label>
                <input disabled class="form-control" value="{{$members->no_anggota}}" placeholder="Email" />
            </div>
            <div class="mb-3">
                <label class="form-label">Nomor KTP</label>
                <input disabled class="form-control" value="{{$members->no_ktp}}" placeholder="Email" />
            </div>
            <div class="mb-3">
                <label class="form-label">Jabatan</label>
                <input disabled class="form-control" value="{{$members->jabatan->name}}" placeholder="Email" />
            </div>
        </div>
    </div>

    <form action="{{ route('profile-submit') }}" method="post" enctype="multipart/form-data">
        <div id="editMemberModal" class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Profil</h5>
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
                            <label for="memberPassword" class="form-label">Password: </label>
                            <input id="memberPassword" class="form-control" name="password" placeholder="Password" type="password" required="required" />
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
</div>
@endsection
