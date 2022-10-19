import React from 'react';
import Header from '../components/header';
import request from '../axios';
import {Link, useNavigate} from "react-router-dom";

const initFormData = {
    no_anggota:"",
    password:"",
}

export default (props) => {

    const navigate = useNavigate();
    const [formData, setFormData] = React.useState(initFormData)
    const onSubmit = async(event) =>{
        event.preventDefault()
        const res = await request.post('/login', formData)
        console.log(res.data)
        if (res.status == 200 && res.data) {
            localStorage.setItem('token', res.data.token)
            navigate(res.data.url)
        }
    }
    const inputChange = (id, value) =>{
        const temp = {...formData}
        temp[id] = value
        setFormData(temp)
    }
    return (
        <div>
            <Header/>
            <div class="container">
                <div class="col-md-8 card m-auto my-5">
                    <div class="card-header">Log In</div>
                    <div class="card-body">
                    <form method="post" onSubmit={onSubmit}>
                        <div class="mb-3">
                        <label class="form-label">Nomor Anggota</label>
                        <input class="form-control" value={formData.no_anggota} placeholder="Nomor Anggota" onChange={(e)=>inputChange("no_anggota", e.target.value)} />
                        </div>
                        <div class="mb-3">
                        <label class="form-label">Password</label>
                        <input class="form-control" value={formData.password} placeholder="Password" type="password" onChange={(e)=>inputChange("password", e.target.value)}/>
                        </div>
                        <button class="btn btn-primary">Login</button>
                    </form>
                    </div>
                </div>
            </div>
        </div>    

    )
}