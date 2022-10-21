import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import request from '../axios';
import {Link, useNavigate} from "react-router-dom";
import ImageInput from '../components/imageinput'

const initFormData = {
    name:"",
    alamat:"",
    email:"",
    no_telp:"",
    no_ktp:"",
    password:"",
    foto:"",
}

export default (props) => {
    return (
        <div>
            <Header/>
            <section className="full-height d-flex flex-column">
                <Register />
                <Footer />
            </section>
        </div>
    )
}

const Register = (props) => {
    const navigate = useNavigate()
    const [formData, setFormData] = React.useState(initFormData)
    const onSubmit = async(event) =>{
        event.preventDefault()
        const data = new FormData()
        data.append('name', formData.name)
        data.append('alamat', formData.alamat)
        data.append('email', formData.email)
        data.append('no_telp', formData.no_telp)
        data.append('no_ktp', formData.no_ktp)
        data.append('password', formData.password)
        data.append('foto', formData.foto)
        const res = await request.post('/register', data)
        if (res.status == 200 && res.data) {
            navigate(res.data.url);
        }
    }
    const inputChange = (id, value) =>{
        const temp = {...formData}
        temp[id] = value
        setFormData(temp)
    }
    return(
        <div className="container">
            <div className="col-md-8 card m-auto my-5">
                <div className="card-header">Register</div>
                <div className="card-body">
                    <form onSubmit={onSubmit} encType="multipart/form-data" method="post">
                        <div className="mb-3">
                            <label className="form-label">Nama</label>
                            <input className="form-control" value={formData.name} required="required" placeholder="Nama" onChange={(e)=>inputChange("name", e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Alamat</label>
                            <input className="form-control" value={formData.alamat} required="required" placeholder="Alamat" onChange={(e)=>inputChange("alamat", e.target.value)}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input className="form-control" value={formData.email} required="required" type="email" placeholder="Email" onChange={(e)=>inputChange("email", e.target.value)}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">No Telepon</label>
                            <input className="form-control" value={formData.no_telp} required="required" placeholder="No Telepon" onChange={(e)=>inputChange("no_telp", e.target.value)}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">No KTP</label>
                            <input className="form-control" value={formData.no_ktp} required="required" placeholder="No KTP" onChange={(e)=>inputChange("no_ktp", e.target.value)}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input className="form-control" value={formData.password} required="required" placeholder="Password" type="password" onChange={(e)=>inputChange("password", e.target.value)}/>
                        </div>
                        <ImageInput id="fotoPlaceholder" name="foto" label="Foto" value={formData.fotoUrl} placeholder="Pilih Foto" onChange={(e) => inputChange('foto', e)} />
                        <button className="btn btn-primary">Register</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
