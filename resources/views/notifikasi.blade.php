@extends('layouts.app')

@section('content')
<div class="full-height d-flex flex-column">
    <div class="flex-fill container pt-5">
    <h1 class="display-3">Notifikasi</h1>

    @if (Auth::user()->jabatan_id == 1)
    <div class="d-flex flex-row justify-content-end">
        <a class="btn btn-primary mb-3 d-flex flex-row" onclick="onNotifikasiEdit()" data-bs-toggle="modal" data-bs-target="#editNotifikasiModal" >
            <i class="material-icons d-block">add</i>
            <span>Kirim Notifikasi</span>
        </a>
    </div>
    @endif

        <ul class="list-group">
        @foreach($notifikasi as $d)
            @if($d->read_at == NULL)
            <a href="{{ route('read-notification', ['id'=>$d->id]) }}" data-bs-toggle="modal" onclick="onMessageShow(this)" data-notif="{{ $d }}" data-bs-target="#messageModal">
                <li class="list-group-item d-flex justify-content-between align-items-center 
                ">{{$d->data['title']}}
                <span class="badge bg-primary rounded-pill">{{ $d->created_at->diffForHumans() }}</span></li>
            </a>
            @else
            <div data-bs-toggle="modal" onclick="onMessageRead(this)" data-notif="{{ $d }}" data-bs-target="#readMessageModal">
                <li class="list-group-item d-flex justify-content-between align-items-center text-muted bg-transparent
                ">{{$d->data['title']}}
                <span class="badge bg-primary rounded-pill">{{ $d->created_at->diffForHumans() }}</span></li>
            </div>
            @endif
        @endforeach
        </ul>
        {{ $notifikasi->onEachSide(10)->links() }}
        

    <div id="messageModal" class="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="notifTitle"></h5>
                <a class="btn-close notif-read" aria-label="Close"></a>
            </div>
            <div class="modal-body">
                <p id="notifMessage"></p>
            </div>
            <div class="modal-footer">
                <a href="#" class="btn btn-secondary notif-read">Close</a>
            </div>
            </div>
        </div>
    </div>

    <div id="readMessageModal" class="modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="readNotifTitle"></h5>
                <a class="btn-close" data-bs-dismiss="modal" aria-label="Close"></a>
            </div>
            <div class="modal-body">
                <p id="readNotifMessage"></p>
            </div>
            <div class="modal-footer">
                <a href="#" class="btn btn-secondary" data-bs-dismiss="modal">Close</a>
            </div>
            </div>
        </div>
    </div>

    <form action="{{ route('admin-send-notif') }}" method="post">
        <div id="editNotifikasiModal" class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Kirim Notifikasi</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div class="modal-body">
                        @csrf
                        <div class="mb-3">
                            <label for="notifTitle" class="form-label">Title: </label>
                            <input id="notifTitle" class="form-control" name="title" placeholder="" required="required" />
                        </div>
                        <div class="mb-3">
                            <label for="notifMessage" class="form-label">Pesan: </label>
                            <input id="notifMessage" class="form-control" name="message" placeholder="Isi pesan" required="required" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button  class="btn btn-primary">Kirim</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                    </div>
                </div>
            </div>
        </div>
    </form>

    </div>
    @include('footer')
</div>
@endsection
