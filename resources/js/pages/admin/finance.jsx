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

const initStatusFormData = {
    status:"aktif",
    id:"",
}

const initLedgerFormData = {
    bank_id: "",
    receiver_bank_id: "",
    note:"",
    isIn: 0,
    amount:"",
    author:"",
    balance:"",
    nextId:"",
}

export default (props) => {
    const [banks, setBanks] = React.useState([]);
    const [activeBanks, setActiveBanks] = React.useState([]);

    const fetch = async() => {
        const res = await request.get('/admin/finance')
        if(res.status == 200 && res.data) {
            if(res.data.bank) setBanks(res.data.bank)
            if(res.data.active_bank) setActiveBanks(res.data.active_bank)
        }
    }
    React.useEffect(() => {
        fetch()
    }, [])

    return(
      <section>
          <ul className="nav nav-tabs" id="myTab">
              <li className="nav-item">
                  <button className="nav-link active" id="bank-tab" data-bs-toggle="tab" data-bs-target="#bank-tab-pane" >Bank</button>
              </li>
              <li className="nav-item">
                  <button className="nav-link" id="transaksi-tab" data-bs-toggle="tab" data-bs-target="#transaksi-tab-pane" >Transaksi</button>
              </li>
          </ul>
          <div className="tab-content" id="myTabContent">
              <Bank data={banks} fetch={fetch}/>
              <BankLedger bank={banks} activeBank={activeBanks}/>
          </div>
      </section>
    )
}

const Bank = (props) => {
    const [formData, setFormData] = React.useState(initStatusFormData);
    const modalRef = React.useRef();

    const onSubmit = async(event) =>{
        event.preventDefault()

        try {
            const res = await request.post('/admin/finance', formData)
            if (res.status == 200 && res.data) {
                if(modalRef.current)
                    modalRef.current.click()
                props.fetch()
            }
        } catch (err) {
            seterrorMessage(err.response.data.message)
        }

    }
    const inputChange = (id, value) =>{
        const temp = {...formData}
        temp[id] = value
        setFormData(temp)
    }

    const onEdit = (form)=> () => {
        const temp = {...formData}
        if(form){
            temp.status = form.status
            temp.id = form.id
        } else{
            temp.status = ""
            temp.id = ""
        }
        setFormData(temp)
    }

    return (
                <div className="tab-pane fade show active" id="bank-tab-pane" role="tabpanel" aria-labelledby="bank-tab" tabIndex="0">
                    <div className="container py-5">
                        <h3>Data Bank</h3>
                        <div className="d-flex flex-row justify-content-end">
                            <Link className="btn btn-primary mb-3 d-flex flex-row" data-bs-toggle="modal" data-bs-target="#editBankModal" >
                                <i className="material-icons d-block">add</i>
                                <span>Tambah</span>
                            </Link>
                        </div>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>No Rekening</th>
                                    <th>Bank</th>
                                    <th>Nama Pemilik</th>
                                    <th>Status</th>
                                    <th>Saldo</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                            { props.data.length > 0 && props.data.map((d, i) => (
                                <tr key={i}>
                                    <td>{ d.no_rekening }</td>
                                    <td>{ d.nama_bank }</td>
                                    <td>{ d.name }</td>
                                    <td>{ d.status }</td>
                                    <td>{ d.saldo }</td>
                                    <td>
                                        <div className="d-flex flex-row gap-2">
                                            <Link className="btn btn-link text-primary text-decoration-none d-flex flex-row" onClick={(onEdit(d))} data-bs-toggle="modal" data-bs-target="#editStatusModal">
                                                <i className="material-icons d-block">edit</i>
                                                <span>Edit</span>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )) }
                            </tbody>
                        </table>
                        <form onSubmit={onSubmit} method="post">
                            <div id="editStatusModal" className="modal" tabIndex="-1" role="dialog">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Edit Status</h5>
                                            <button type="button" className="btn-close" ref={modalRef} data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label htmlFor="status" className="form-label">Status: </label>
                                                <select id="status" className="form-select" value={formData.status} onChange={e => inputChange('status', e.target.value)}>
                                                    <option value="aktif">Aktif</option>
                                                    <option value="nonaktif">Nonaktif</option>
                                                </select>
                                            </div>
                                            <input id="transactionId" name="transactionId" type="hidden" value=""/>
                                        </div>
                                        <div className="modal-footer">
                                            <button  className="btn btn-primary">Simpan</button>
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <EditBankForm fetch={props.fetch} />
                </div>
    )
}

const BankLedger = (props) => {
    const [bankLedgers, setBankLedgers] = React.useState([]);
    const [id, setId] = React.useState("");

    const fetch = async() => {
        const res = await request.get('/admin/finance/ledger?id=' + encodeURIComponent(id))
        if(res.status == 200 && res.data) {
            if(res.data.bank_ledger) setBankLedgers(res.data.bank_ledger)
        }
    }

    React.useEffect(() => {
        fetch()
    }, [id])

    return (
            <div className="tab-pane fade" id="transaksi-tab-pane" role="tabpanel" aria-labelledby="transaksi-tab" tabIndex="0">
                <div className="container py-5">
                    <h3>Data Transaksi</h3>
                    <div className="d-flex flex-row justify-content-end">
                        <Link className="btn btn-primary mb-3 d-flex flex-row" data-bs-toggle="modal" data-bs-target="#editTransaksiModal" >
                            <i className="material-icons d-block">add</i>
                            <span>Tambah</span>
                        </Link>
                    </div>

                    <form method="get">
                        <div className="d-flex flex-row justify-content-end">
                            <select className="form-select" name="myOption" value={id} onChange={(e) => setId(e.target.value)}>
                                <option>Pilih Bank</option>
                                { props.bank.length > 0 && props.bank.map((d, i) => (
                                    <option key={i} value={ d.id }>{ d.nama_bank } - { d.no_rekening }</option>
                                )) }
                            </select>
                        </div>
                    </form>

                    <table className="table table-bordered">
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
                            { bankLedgers.length > 0 && bankLedgers.map((d, i) => (
                                <tr key={i}>
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
                <EditBankLedgerForm data={props.bank} activeBank={props.activeBank} fetch={fetch}/>
            </div>
    )
}

const EditBankLedgerForm = (props) => {
    const [formData, setFormData] = React.useState(initLedgerFormData);
    const [errorMessage, seterrorMessage] = React.useState("");
    const modalRef = React.useRef();

    const onSubmit = async(event) => {
        event.preventDefault()
        const data = new FormData()
        data.append('isIn', formData.isIn)
        data.append('bank_id', formData.bank_id)
        data.append('receiver_bank_id', formData.receiver_bank_id)
        data.append('note', formData.note)
        data.append('amount', formData.amount)

        try{
            const res = await request.post('/admin/finance/ledger', data)
            if (res.status == 200 && res.data) {
                if(modalRef.current)
                    modalRef.current.click()
                props.fetch()
                const temp = {...initLedgerFormData}
                temp.bank_id = formData.bank_id
                temp.isIn = formData.isIn
                setFormData(temp)
            }
        } catch (err) {
            seterrorMessage(err.response.data.message)
        }
        
    }

    const inputChanged = (id, value) => {
        const temp = {...formData}
        temp[id] = value
        setFormData(temp)

        if(id == 'isIn') {
            const bank_receiver = document.getElementById('bankReceiver');
            if(value == 2){
              bank_receiver.classList.add("d-block");
              bank_receiver.classList.remove("d-none");
            } else{
              bank_receiver.classList.add("d-none");
              bank_receiver.classList.remove("d-block");
            }
        }
      }

    return (
        <form onSubmit={onSubmit} method="post">
            <div id="editTransaksiModal" className="modal" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Tambah Transaksi</h5>
                            <button type="button" className="btn-close" ref={modalRef} data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="isIn" className="form-label">Status: </label>
                                <select id="isIn" className="form-select" value={formData.isIn} onChange={e => inputChanged('isIn', e.target.value)}>
                                    <option value="0">Keluar</option>
                                    <option value="1">Masuk</option>
                                    <option value="2">Transfer</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="bankTypeId" className="form-label">ID Bank: </label>
                                <select className="form-select" id="bankTypeId" value={formData.bank_id} onChange={e => inputChanged('bank_id', e.target.value)}>
                                    <option disabled value="">Pilih Bank</option>
                                    { props.activeBank.length > 0 && props.activeBank.map((d, i) => (
                                        <option key={i} value={ d.id }>{ d.nama_bank } - { d.no_rekening }</option>
                                    )) }
                                </select>
                            </div>
                            <div className="mb-3 d-none" id="bankReceiver">
                                <label htmlFor="bankReceiverId" className="form-label">ID Bank Tujuan: </label>
                                <select className="form-select" id="bankReceiverId" value={formData.receiver_bank_id} onChange={e => inputChanged('receiver_bank_id', e.target.value)}>
                                    <option disabled value="">Pilih Bank</option>
                                    { props.activeBank.length > 0 && props.activeBank.map((d, i) => (
                                        <option key={i} value={ d.id }>{ d.nama_bank } - { d.no_rekening }</option>
                                    )) }
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="bankNote" className="form-label">Note: </label>
                                <input id="bankNote" className="form-control" value={formData.note} placeholder="Tinggalkan Pesan" required="required" onChange={e => inputChanged('note', e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="bankAmount" className="form-label">Jumlah: </label>
                                <input id="bankAmount" className="form-control" value={formData.amount} placeholder="Jumlah" required="required" onChange={e => inputChanged('amount', e.target.value)} />
                            </div>
                            <input id="transactionId" name="transactionId" type="hidden" value=""/>
                            <div className={"alert alert-danger alert-dismissible fade" + (errorMessage?' show' : ' hide p-0 m-0')} role="alert">
                                {errorMessage}
                                <button type="button" className="btn-close" onClick={() => seterrorMessage("")} aria-label="Close"></button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button  className="btn btn-primary">Simpan</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

const EditBankForm = (props) => {
    const [formData, setFormData] = React.useState(initFormData);
    const [errorMessage, seterrorMessage] = React.useState("");
    const modalRef = React.useRef();

    const onSubmit = async(event) => {
        event.preventDefault()
        const data = new FormData()
        data.append('no_rekening', formData.no_rekening)
        data.append('nama_bank', formData.nama_bank)
        data.append('name', formData.name)
        data.append('saldo', formData.saldo)

        try {
            const res = await request.post('/admin/finance', data)
            if (res.status == 200 && res.data) {
                if(modalRef.current)
                    modalRef.current.click()
                props.fetch()
                setFormData(initFormData)
            }
        } catch (err) {
            seterrorMessage(err.response.data.message)
        }

    }

    const inputChanged = (id, value) => {
        const temp = {...formData}
        temp[id] = value
        setFormData(temp)
      }

    return (
        <form onSubmit={onSubmit} method="post">
            <div id="editBankModal" className="modal" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Tambah Bank</h5>
                            <button type="button" className="btn-close" ref={modalRef} data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="bankNumber" className="form-label">No Rekening: </label>
                                <input id="bankNumber" className="form-control" value={formData.no_rekening} placeholder="Nomor rekening" required="required" onChange={e => inputChanged('no_rekening', e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="bankName" className="form-label">Nama Bank: </label>
                                <input id="bankName" className="form-control" value={formData.nama_bank} placeholder="Nama Bank" required="required" onChange={e => inputChanged('nama_bank', e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="userName" className="form-label">Nama Pemilik: </label>
                                <input id="userName" className="form-control" value={formData.name} placeholder="Nama Pemilik" required="required" onChange={e => inputChanged('name', e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="bankSaldo" className="form-label">Saldo: </label>
                                <input id="bankSaldo" className="form-control" value={formData.saldo} placeholder="Jumlah Saldo" required="required" onChange={e => inputChanged('saldo', e.target.value)} />
                            </div>
                            <input id="bankId" name="id" type="hidden" value=""/>
                            <div className={"alert alert-danger alert-dismissible fade" + (errorMessage?' show' : ' hide p-0 m-0')} role="alert">
                                {errorMessage}
                                <button type="button" className="btn-close" onClick={() => seterrorMessage("")} aria-label="Close"></button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button  className="btn btn-primary">Simpan</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
