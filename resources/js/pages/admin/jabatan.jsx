import React from 'react';
import Header from '../../components/header';
import Confirm from '../../components/modalconfirm';
import request from '../../axios';
import {Link} from "react-router-dom";

const initFormData = {
    name:"",
}

export default (props) => {
    const [jabatans, setJabatans] = React.useState([]);
    const [deleteUrl, setDeleteUrl] = React.useState("");
    const [deleteId, setDeleteId] = React.useState("");

    const fetch = async() => {
        const res = await request.get('/admin/jabatan')
        if(res.status == 200 && res.data) {
            if(res.data.jabatan) setJabatans(res.data.jabatan)
            if(res.data.deleteUrl) setDeleteUrl(res.data.deleteUrl)
        }
    }

    React.useEffect(() => {
        fetch()
    }, [])


    return (
        <div>
            <Header />
            <section className="full-height d-flex flex-column">
                <Jabatan data={jabatans} fetch={fetch} setDeleteId={setDeleteId} />
                <Confirm deleteUrl={deleteUrl} id={deleteId} callBack={fetch} />
            </section>
        </div>
    )
}

const Jabatan = (props) => {
    const [formData, setFormData] = React.useState(initFormData);

    const onSubmit = async(event) =>{
        event.preventDefault()
        const res = await request.post('/admin/jabatan', formData)
        if (res.status == 200 && res.data) {
            props.fetch()
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
            temp.name = form.name
            temp.id = form.id
        } else{
            temp.name = ""
            temp.id = ""
        }
        setFormData(temp)
    }

    const onDelete = (id)=> () => {
        props.setDeleteId(id)
    }

    if (!props.data || props.data.length <= 0) return null;
    return (
        <div className="container py-5">
            <h3>Data Jabatan</h3>
            <div className="d-flex flex-row justify-content-end">
                <Link className="btn btn-primary mb-3 d-flex flex-row" onClick={onEdit(null)} data-bs-toggle="modal" data-bs-target="#editJabatanModal" >
                    <i className="material-icons d-block">add</i>
                    <span>Tambah</span>
                </Link>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Nama Jabatan</th>
                        <th>ID Jabatan</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    { props.data.length > 0 && props.data.map((d, i) => (
                        <tr key={i}>
                            <td>{ d.name }</td>
                            <td>{ d.id }</td>
                            <td>
                                <div className="d-flex flex-row gap-2">
                                    <Link className="btn btn-link text-primary text-decoration-none d-flex flex-row" onClick={(onEdit(d))} data-bs-toggle="modal" data-bs-target="#editJabatanModal">
                                    <i className="material-icons d-block">edit</i>
                                    <span>Edit</span>
                                    </Link>
                                    <Link className="btn btn-link text-danger text-decoration-none d-flex flex-row" onClick={(onDelete(d.id))} data-bs-toggle="modal" data-bs-target="#deleteModal">
                                    <i className="material-icons d-block">delete</i>
                                    <span>Hapus</span>
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    )) }
                </tbody>
            </table>
            <form onSubmit={onSubmit} method="post">
                <div id="editJabatanModal" className="modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Jabatan</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="jabatanName" className="form-label">Nama Jabatan: </label>
                                    <input id="jabatanName" className="form-control" value={formData.name} placeholder="Nama Jabatan" required="required" onChange={(e)=>inputChange("name", e.target.value)} />
                                </div>
                                <input id="jabatanId" value={formData.id} type="hidden"/>
                            </div>
                            <div className="modal-footer">
                                <button  className="btn btn-primary" data-bs-dismiss="modal">Simpan</button>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
