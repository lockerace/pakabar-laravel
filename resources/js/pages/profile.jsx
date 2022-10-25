import React from 'react';
import Footer from '../components/footer';
import request from '../axios'
import { Link, Navigate } from "react-router-dom";

const initFormData = {
    email:"",
    password:"",
}

export default (props) => {
    const [members, setMembers] = React.useState([]);

    const fetch = async() => {
      const res = await request.get('/profile')
      if (res.status == 200 && res.data) {
        if (res.data.member) setMembers(res.data.member)
      }
    }

    React.useEffect(() => {
      fetch()
    }, [])

    return (
      <section className="full-height d-flex flex-column">
          <Members data={members} fetch={fetch} />
          <Footer />
      </section>
    )
}

const Members = (props) => {
    const [formData, setFormData] = React.useState(initFormData);
    const [errorMessage, seterrorMessage] = React.useState("");
    const modalRef = React.useRef();

    const onSubmit = async(event) =>{
        event.preventDefault()

        try {
            const res = await request.post('/profile', formData)
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

    React.useEffect(()=> {
        if(props.data){
            const temp = {...formData}
            temp.email = props.data.email
            setFormData(temp)
        }
    }, [props.data])

    if (!props.data || props.data.length <= 0) return null;
    return (
        <div className="container py-5">
            <h1 className="display-4">Profil Anggota</h1>
            <div className="d-flex flex-row justify-content-end" >
                <Link className="btn btn-primary mb-3 d-flex flex-row" data-bs-toggle="modal" data-bs-target="#editMemberModal" >
                    <i className="material-icons d-block">edit</i>
                    <span>Edit</span>
                </Link>
            </div>

            <div className="row">
                <div className="col col-md-4">
                    <div className="card">
                        {!props.data.foto && (
                            <div className="w-100 ratio-1 position-relative">
                                <div className="slider-content d-flex justify-content-center align-items-center">
                                    <i className="material-icons d-block display-1">person</i>
                                </div>
                            </div>
                            )}
                            {props.data.foto && (
                                <img src={"/member/" + props.data.foto} className="card-img-top" alt="..."></img>
                            )}
                        <div className="card-body">
                            <h5 className="card-title text-center">{ props.data.name }</h5>
                        </div>
                    </div>
                </div>

            <div className="col col-md-8">
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input disabled className="form-control" value={props.data.email} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nama Anggota</label>
                    <input disabled className="form-control" value={props.data.name} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Alamat</label>
                    <input disabled className="form-control" value={props.data.alamat} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nomor Telepon</label>
                    <input disabled className="form-control" value={props.data.no_telp} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nomor Anggota</label>
                    <input disabled className="form-control" value={props.data.no_anggota} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nomor KTP</label>
                    <input disabled className="form-control" value={props.data.no_ktp} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Jabatan</label>
                    <input disabled className="form-control" value={props.data.jabatan.name} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <input disabled className="form-control" value={props.data.status == 1 ? 'Verified' : 'Unverified'} placeholder="Status" />
                </div>
            </div>
        </div>

        <form onSubmit={onSubmit} method="post">
            <div id="editMemberModal" className="modal" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Profil</h5>
                            <button type="button" className="btn-close" ref={modalRef} data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="memberEmail" className="form-label">Email: </label>
                                <input id="memberEmail" className="form-control" value={formData.email} placeholder="Email" type="email" required="required" onChange={(e)=>inputChange("email", e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="memberPassword" className="form-label">Password: </label>
                                <input id="memberPassword" className="form-control" value={formData.password} placeholder="Password" type="password" required="required" onChange={(e)=>inputChange("password", e.target.value)} />
                            </div>
                            <input id="memberId" name="id" type="hidden" value=""/>
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
</div>
    )
}
