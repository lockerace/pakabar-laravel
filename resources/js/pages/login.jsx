import React from 'react';
import Footer from '../components/footer';
import request from '../axios';
import {Link, useNavigate, useOutletContext} from "react-router-dom";

const initFormData = {
    no_anggota:"",
    password:"",
}

export default (props) => {
    const {fetchAuth} = useOutletContext();
    return (
        <div>
            <section className="full-height d-flex flex-column">
                <Login fetch={fetchAuth} />
            </section>
            <Footer />
        </div>

    )
}

const Login = (props) => {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState(initFormData)
    const [errorMessage, seterrorMessage] = React.useState("")

    const onSubmit = async(event) =>{
        event.preventDefault()
        try{
            const res = await request.post('/login', formData)
            if (res.status == 200 && res.data) {
                localStorage.setItem('token', res.data.token)
                if (props.fetch) props.fetch()
                navigate(res.data.url)
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
    return (
        <div className="container">
            <div className="col-md-8 card m-auto my-5">
                <div className="card-header">Log In</div>
                <div className="card-body">
                    <form method="post" onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nomor Anggota</label>
                            <input className="form-control" value={formData.no_anggota} required="required" placeholder="Nomor Anggota" onChange={(e)=>inputChange("no_anggota", e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input className="form-control" value={formData.password} required="required" placeholder="Password" type="password" onChange={(e)=>inputChange("password", e.target.value)}/>
                        </div>
                        <div className={"alert alert-danger alert-dismissible fade" + (errorMessage?' show' : ' hide p-0 m-0')} role="alert">
                            {errorMessage}
                            <button type="button" className="btn-close" onClick={() => seterrorMessage("")} aria-label="Close"></button>
                        </div>
                        <button className="btn btn-primary">Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
