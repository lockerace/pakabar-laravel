@extends('layouts.app')

@section('content')
<div class="container py-5">
  <h3>Data News</h3>
  <div class="d-flex flex-row justify-content-end">
      <a class="btn btn-primary mb-3 d-flex flex-row" onclick="onNewsEdit()" data-bs-toggle="modal" data-bs-target="#editNewsModal" >
          <i class="material-icons d-block">add</i>
          <span>Tambah</span>
      </a>
  </div>
  <table class="table table-bordered">
  <tr>
      <th>News</th>
      <th>Konten</th>
      <th>Aksi</th>
  </tr>
  @foreach($news as $d)
  <tr>
      <td>{{ $d->judul }}</td>
      <td>{{ $d->konten }}</td>
      <td>
      <div class="d-flex flex-row gap-2">
        <a class="btn btn-link text-primary text-decoration-none d-flex flex-row" onclick="onNewsEdit(this)" data-news="{{$d}}" data-bs-toggle="modal" data-bs-target="#editNewsModal">
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
  <form action="{{ route('admin-news-submit') }}" method="post">
      <div id="editNewsModal" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">News</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
              </button>
            </div>
            <div class="modal-body">
                  @csrf
                  <div class="mb-3">
                    <label for="newsJudul" class="form-label">Judul News: </label>
                    <input id="newsJudul" class="form-control" name="judul" placeholder="Judul" required="required" />
                  </div>
                  <div class="mb-3">
                    <label for="newsKonten" class="form-label">Konten: </label>
                    <div class="editor" data-id="newsKonten"></div>
                    <input id="newsKonten" class="form-control" type="hidden" name="konten" placeholder="Isi" required="required"></input>
                  </div>
                  <input id="newsId" name="id" type="hidden" value=""/>
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
