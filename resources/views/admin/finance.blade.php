@extends('layouts.app')

@section('content')

<ul class="nav nav-tabs" id="myTab">
  <li class="nav-item">
    <button class="nav-link {{ empty($my_option) ? 'active' : '' }}" id="bank-tab" data-bs-toggle="tab" data-bs-target="#bank-tab-pane" aria-current="{{ empty($my_option) ? 'page' : '' }}">Bank</button>
  </li>
  <li class="nav-item">
    <button class="nav-link {{ !empty($my_option) ? 'active' : '' }}" id="transaksi-tab" data-bs-toggle="tab" data-bs-target="#transaksi-tab-pane" aria-current="{{ !empty($my_option) ? 'page' : '' }}">Transaksi</button>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show {{ empty($my_option) ? 'active' : '' }}" id="bank-tab-pane" role="tabpanel" aria-labelledby="bank-tab" tabindex="0">
  <div class="container py-5">
  <h3>Data Bank</h3>
    <div class="d-flex flex-row justify-content-end">
        <a class="btn btn-primary mb-3 d-flex flex-row" onclick="onBankEdit()" data-bs-toggle="modal" data-bs-target="#editBankModal" >
            <i class="material-icons d-block">add</i>
            <span>Tambah</span>
        </a>
    </div>
  <table class="table table-bordered">
    <tr>
        <th>No Rekening</th>
        <th>Bank</th>
        <th>Nama Pemilik</th>
        <th>Saldo</th>
    </tr>
    @foreach($bank as $d)
    <tr>
        <td>{{ $d->no_rekening }}</td>
        <td>{{ $d->nama_bank }}</td>
        <td>{{ $d->name }}</td>
        <td>{{ $d->saldo }}</td>
    </tr>
    @endforeach 
    </table>
    </div>

    <form action="{{ route('admin-bank-submit') }}" method="post">
        <div id="editBankModal" class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Tambah Bank</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div class="modal-body">
                        @csrf
                        <div class="mb-3">
                            <label for="bankNumber" class="form-label">No Rekening: </label>
                            <input id="bankNumber" class="form-control" name="no_rekening" placeholder="Nomor rekening" required="required" />
                        </div>
                        <div class="mb-3">
                            <label for="bankName" class="form-label">Nama Bank: </label>
                            <input id="bankName" class="form-control" name="nama_bank" placeholder="Nama Bank" required="required" />
                        </div>
                        <div class="mb-3">
                            <label for="userName" class="form-label">Nama Pemilik: </label>
                            <input id="userName" class="form-control" name="name" placeholder="Nama Pemilik" required="required" />
                        </div>
                        <div class="mb-3">
                            <label for="bankSaldo" class="form-label">Saldo: </label>
                            <input id="bankSaldo" class="form-control" name="saldo" placeholder="Jumlah Saldo" required="required" />
                        </div>
                        <input id="bankId" name="id" type="hidden" value=""/>
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



  <div class="tab-pane fade show {{ !empty($my_option) ? 'active' : '' }}" id="transaksi-tab-pane" role="tabpanel" aria-labelledby="transaksi-tab" tabindex="0">
  <div class="container py-5">
  <h3>Data Transaksi</h3>
    <div class="d-flex flex-row justify-content-end">
        <a class="btn btn-primary mb-3 d-flex flex-row" onclick="onTransaksiEdit()" data-bs-toggle="modal" data-bs-target="#editTransaksiModal" >
            <i class="material-icons d-block">add</i>
            <span>Tambah</span>
        </a>
    </div>

    <form method="get">
    <div class="d-flex flex-row justify-content-end">
        <select class="form-select" name="myOption" onchange="this.form.submit();">
            <option>Pilih Bank</option>
            @foreach($bank as $d)
            <option value="{{ $d->id }}" {{$my_option == $d->id ? 'selected' : ""}}>{{ $d->nama_bank }} - {{ $d->no_rekening }}</option>
            @endforeach
        </select>
    </div>
    </form>

  <table class="table table-bordered">
    <tr>
        <th>ID Transaksi</th>
        <th>ID Bank</th>
        <th>Note</th>
        <th>Waktu</th>
        <th>Status</th>
        <th>Jumlah</th>
        <th>Author</th>
        <th>Saldo</th>
        <th>Next ID</th>
    </tr>


    @foreach($bank_ledger as $d)
    <tr>
        <td>{{ $d->id }}</td>
        <td>{{ $d->bank_id }}</td>
        <td>{{ $d->note }}</td>
        <td>{{ $d->created_at }}</td>
        <td>{{ $d->isIn == 1 ? 'Masuk' : 'Keluar'}}</td>
        <td>{{ $d->amount }}</td>
        <td>{{ $d->author }}</td>
        <td>{{ $d->balance }}</td>
        <td>{{ $d->next_id }}</td>
    </tr>
    @endforeach
    </table>
    </div>

    <form action="{{ route('admin-bank-ledger-submit') }}" method="post">
        <div id="editTransaksiModal" class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Tambah Transaksi</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div class="modal-body">
                        @csrf
                        <div class="mb-3">
                            <label for="isIn" class="form-label">Status: </label>
                            <select id="isIn" class="form-select" name="isIn" onchange="onBankLedgerStatusChanged(this)">
                                <option value="0">Keluar</option>
                                <option value="1">Masuk</option>
                                <option value="2">Transfer</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="bankTypeId" class="form-label">ID Bank: </label>
                            <select class="form-select" id="bankTypeId" name="bank_id">
                                @foreach($bank as $d)
                                <option value="{{ $d->id }}" {{$my_option == $d->id ? 'selected' : ""}}>{{ $d->nama_bank }} - {{ $d->no_rekening }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="mb-3 d-none" id="bankReceiver">
                            <label for="bankReceiverId" class="form-label">ID Bank Tujuan: </label>
                            <select class="form-select" id="bankReceiverId" name="receiver_bank_id">
                                @foreach($bank as $d)
                                <option value="{{ $d->id }}" {{$my_option == $d->id ? 'selected' : ""}}>{{ $d->nama_bank }} - {{ $d->no_rekening }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="bankNote" class="form-label">Note: </label>
                            <input id="bankNote" class="form-control" name="note" placeholder="Tinggalkan Pesan" required="required" />
                        </div>
                        <div class="mb-3">
                            <label for="bankAmount" class="form-label">Jumlah: </label>
                            <input id="bankAmount" class="form-control" name="amount" placeholder="Jumlah" required="required" />
                        </div>
                        <input id="transactionId" name="transactionId" type="hidden" value=""/>
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
</div>



@endsection