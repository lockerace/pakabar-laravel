import React from 'react';
import request from '../../axios';
import {Link} from "react-router-dom";
import {format, parseISO} from 'date-fns'

const initFormData = {
    no_rekening:"",
    nama_bank:"",
    name:"",
    saldo:"",
}

const initLedgerFormData = {
    bank_id: 1,
    receiver_bank_id:"",
    note:"",
    isIn: 0,
    amount:"",
    author:"",
    balance:"",
    nextId:"",
}

export default (props) => {
    const [banks, setBanks] = React.useState([]);
    const [bankLedgers, setBankLedgers] = React.useState([]);

    const fetch = async() => {
        const res = await request.get('/admin/finance')
        if(res.status == 200 && res.data) {
            console.log(res.data)
            if(res.data.bank) setBanks(res.data.bank)
            if(res.data.bank_ledger) setBankLedgers(res.data.bank_ledger)
        }
    }
    React.useEffect(() => {
        fetch()
    }, [])

    return(
      <section>
          <ul class="nav nav-tabs" id="myTab">
              <li class="nav-item">
                  <button class="nav-link active" id="bank-tab" data-bs-toggle="tab" data-bs-target="#bank-tab-pane" >Bank</button>
              </li>
              <li class="nav-item">
                  <button class="nav-link" id="transaksi-tab" data-bs-toggle="tab" data-bs-target="#transaksi-tab-pane" >Transaksi</button>
              </li>
          </ul>
          <div class="tab-content" id="myTabContent">
              <Bank data={banks} fetch={fetch}/>
              {/* <BankLedger data={bankLedgers} bank={banks} fetch={fetch}/> */}
          </div>
      </section>
    )
}

const Bank = (props) => {
    return (
                <div class="tab-pane fade show active" id="bank-tab-pane" role="tabpanel" aria-labelledby="bank-tab" tabindex="0">
                    <div class="container py-5">
                        <h3>Data Bank</h3>
                        <div class="d-flex flex-row justify-content-end">
                            <Link class="btn btn-primary mb-3 d-flex flex-row" data-bs-toggle="modal" data-bs-target="#editBankModal" >
                                <i class="material-icons d-block">add</i>
                                <span>Tambah</span>
                            </Link>
                        </div>
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>No Rekening</th>
                                    <th>Bank</th>
                                    <th>Nama Pemilik</th>
                                    <th>Saldo</th>
                                </tr>
                            </thead>
                            <tbody>
                            { props.data.length > 0 && props.data.map((d, i) => (
                                <tr>
                                    <td>{ d.no_rekening }</td>
                                    <td>{ d.nama_bank }</td>
                                    <td>{ d.name }</td>
                                    <td>{ d.saldo }</td>
                                </tr>
                            )) }
                            </tbody>
                        </table>
                    </div>
                    <EditBankForm fetch={props.fetch} />
                </div>
    )
}

const BankLedger = (props) => {
    const [id, setId] = React.useState("");

    return (
            <div class="tab-pane fade" id="transaksi-tab-pane" role="tabpanel" aria-labelledby="transaksi-tab" tabindex="0">
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
                            <select class="form-select" name="myOption" value={id} onChange={(e) => setId(e.target.value)}>
                                <option>Pilih Bank</option>
                                { props.bank.length > 0 && props.bank.map((d, i) => (
                                    <option value={ d.id }>{ d.nama_bank } - { d.no_rekening }</option>
                                )) }
                            </select>
                        </div>
                    </form>

                    <table class="table table-bordered">
                        <thead>
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
                        </thead>
                        <tbody>
                            { props.data.length > 0 && props.data.map((d, i) => (
                                <tr>
                                <td>{ d.id }</td>
                                <td>{ d.bank_id }</td>
                                <td>{ d.note }</td>
                                <td>{format(parseISO(d.created_at), 'Y-M-d H:m:s')}</td>
                                <td>{ d.isIn == 1 ? 'Masuk' : 'Keluar'}</td>
                                <td>{ d.amount }</td>
                                <td>{ d.author }</td>
                                <td>{ d.balance }</td>
                                <td>{ d.next_id }</td>
                            </tr>
                            )) }
                        </tbody>
                    </table>
                </div>
                <EditBankLedgerForm data={props.bank} fetch={props.fetch}/>
            </div>
    )
}

const EditBankLedgerForm = (props) => {
    const [formData, setFormData] = React.useState(initLedgerFormData);
    const modalRef = React.useRef();

    const onSubmit = async(event) => {
        event.preventDefault()
        const data = new FormData()
        data.append('isIn', formData.isIn)
        data.append('bank_id', formData.bank_id)
        data.append('receiver_bank_id', formData.receiver_bank_id)
        data.append('note', formData.note)
        data.append('amount', formData.amount)

        const res = await request.post('/admin/finance/ledger', data)
        if (res.status == 200 && res.data) {
            if(modalRef.current)
                modalRef.current.click()
            props.fetch()
            setFormData(initLedgerFormData)
        }
    }

    const inputChanged = (id, value) => {
        const temp = {...formData}
        temp[id] = value
        setFormData(temp)
      }

    return (
        <form onSubmit={onSubmit} method="post">
            <div id="editTransaksiModal" class="modal" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Tambah Transaksi</h5>
                            <button type="button" class="btn-close" ref={modalRef} data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="isIn" class="form-label">Status: </label>
                                <select id="isIn" class="form-select" value={formData.isIn} onChange={e => inputChanged('isIn', e.target.value)}>
                                    <option value="0">Keluar</option>
                                    <option value="1">Masuk</option>
                                    <option value="2">Transfer</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="bankTypeId" class="form-label">ID Bank: </label>
                                <select class="form-select" id="bankTypeId" value={formData.bank_id} onChange={e => inputChanged('bank_id', e.target.value)}>
                                    { props.data.length > 0 && props.data.map((d, i) => (
                                        <option value={ d.id }>{ d.nama_bank } - { d.no_rekening }</option>
                                    )) }
                                </select>
                            </div>
                            <div class="mb-3 d-none" id="bankReceiver">
                                <label for="bankReceiverId" class="form-label">ID Bank Tujuan: </label>
                                <select class="form-select" id="bankReceiverId" value={formData.receiver_bank_id} onChange={e => inputChanged('receiver_bank_id', e.target.value)}>
                                    { props.data.length > 0 && props.data.map((d, i) => (
                                        <option value={ d.id }>{ d.nama_bank } - { d.no_rekening }</option>
                                    )) }
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="bankNote" class="form-label">Note: </label>
                                <input id="bankNote" class="form-control" value={formData.note} placeholder="Tinggalkan Pesan" required="required" onChange={e => inputChanged('note', e.target.value)} />
                            </div>
                            <div class="mb-3">
                                <label for="bankAmount" class="form-label">Jumlah: </label>
                                <input id="bankAmount" class="form-control" value={formData.amount} placeholder="Jumlah" required="required" onChange={e => inputChanged('amount', e.target.value)} />
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
    )
}

const EditBankForm = (props) => {
    const [formData, setFormData] = React.useState(initFormData);
    const modalRef = React.useRef();

    const onSubmit = async(event) => {
        event.preventDefault()
        const data = new FormData()
        data.append('no_rekening', formData.no_rekening)
        data.append('nama_bank', formData.nama_bank)
        data.append('name', formData.name)
        data.append('saldo', formData.saldo)

        const res = await request.post('/admin/finance', data)
        if (res.status == 200 && res.data) {
            if(modalRef.current)
                modalRef.current.click()
            props.fetch()
            setFormData(initFormData)
        }
    }

    const inputChanged = (id, value) => {
        const temp = {...formData}
        temp[id] = value
        setFormData(temp)
      }

    return (
        <form onSubmit={onSubmit} method="post">
            <div id="editBankModal" class="modal" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Tambah Bank</h5>
                            <button type="button" class="btn-close" ref={modalRef} data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="bankNumber" class="form-label">No Rekening: </label>
                                <input id="bankNumber" class="form-control" value={formData.no_rekening} placeholder="Nomor rekening" required="required" onChange={e => inputChanged('no_rekening', e.target.value)} />
                            </div>
                            <div class="mb-3">
                                <label for="bankName" class="form-label">Nama Bank: </label>
                                <input id="bankName" class="form-control" value={formData.nama_bank} placeholder="Nama Bank" required="required" onChange={e => inputChanged('nama_bank', e.target.value)} />
                            </div>
                            <div class="mb-3">
                                <label for="userName" class="form-label">Nama Pemilik: </label>
                                <input id="userName" class="form-control" value={formData.name} placeholder="Nama Pemilik" required="required" onChange={e => inputChanged('name', e.target.value)} />
                            </div>
                            <div class="mb-3">
                                <label for="bankSaldo" class="form-label">Saldo: </label>
                                <input id="bankSaldo" class="form-control" value={formData.saldo} placeholder="Jumlah Saldo" required="required" onChange={e => inputChanged('saldo', e.target.value)} />
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
    )
}
