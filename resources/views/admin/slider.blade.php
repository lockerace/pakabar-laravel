@extends('layouts.app')

@section('content')
<div class="container py-5">
  <h3>Data Slider</h3>
  <div class="d-flex flex-row justify-content-end">
      <a class="btn btn-primary mb-3 d-flex flex-row" onclick="onSliderEdit()" data-bs-toggle="modal" data-bs-target="#editSliderModal" >
          <i class="material-icons d-block">add</i>
          <span>Tambah</span>
      </a>
  </div>
  <table class="table table-bordered">
  <tr>
      <th>Foto Slider</th>
      <th>Url</th>
      <th>Aksi</th>
  </tr>
  @foreach($slider as $d)
  <tr>
      <td>{{ $d->foto }}</td>
      <td>{{ $d->url }}</td>
      <td>
      <div class="d-flex flex-row gap-2">
        <a class="btn btn-link text-primary text-decoration-none d-flex flex-row" onclick="onSliderEdit(this)" data-slider="{{$d}}" data-bs-toggle="modal" data-bs-target="#editSliderModal">
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
  <form action="{{ route('admin-slider-submit') }}" method="post" enctype="multipart/form-data">
      <div id="editSliderModal" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Slider</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
              </button>
            </div>
            <div class="modal-body">
                  @csrf
                  <div class="mb-3">
                            <label for="sliderFoto" class="form-label">Foto: </label>
                            <div id="fotoPlaceholder" onclick="selectFile('sliderFoto')">
                              <div class="btn input-photo d-flex justify-content-center align-items-center btn-outline-dark">
                                Pilih Foto
                              </div>
                            </div>
                            <input id="sliderFoto" class="form-control d-none" name="foto" required="required" type="file" placeholder="Foto" accept="image/png, image/jpeg" onchange="onSelectFileChanged(this, 'fotoPlaceholder')" />
                        </div>
                <div class="mb-3">
                        <label for="sliderUrl" class="form-label">URL: </label>
                        <input id="sliderUrl" class="form-control" name="url" placeholder="URL Slider" required="required" />
                    </div>
                  <input id="sliderId" name="id" type="hidden" value=""/>
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
