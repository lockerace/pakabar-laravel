@extends('layouts.app')

@section('content')
<div class="full-height d-flex flex-column">
    <div class="flex-fill container pt-5">
    <h1 class="display-3">Notifikasi</h1>
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
                <h5 class="modal-title" id="notifTitle">{{$d->data['title']}}</h5>
                <a class="btn-close notif-read" aria-label="Close"></a>
            </div>
            <div class="modal-body">
                <p id="notifMessage">{{$d->data['message']}}</p>
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
                <h5 class="modal-title" id="readNotifTitle">{{$d->data['title']}}</h5>
                <a class="btn-close" data-bs-dismiss="modal" aria-label="Close"></a>
            </div>
            <div class="modal-body">
                <p id="readNotifMessage">{{$d->data['message']}}</p>
            </div>
            <div class="modal-footer">
                <a href="#" class="btn btn-secondary" data-bs-dismiss="modal">Close</a>
            </div>
            </div>
        </div>
    </div>

    </div>
    @include('footer')
</div>
@endsection
