import React from 'react';
import Header from '../components/header';
import request from '../axios';
import {Link, useNavigate} from "react-router-dom";

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
            <Register />
        </div>
    )
}

const Register = (props) => {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState(initFormData)
    const onSubmit = async(event) =>{
        event.preventDefault()
        const res = await request.post('/register', formData)
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
                    <form onSubmit={onSubmit} method="post">
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

                        <button className="btn btn-primary">Register</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
