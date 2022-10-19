import React from 'react';
import {format} from 'date-fns';
import { applyStyles } from '@popperjs/core';
import {Link} from "react-router-dom";

export default (props) => {
    const [menus, setMenus] = React.useState([]);

    const fetch = async() => {
        const res = await request.get('/user')
        console.log(res.data)
        if(res.status == 200 && res.data) {
            if(res.data) setMenus(res.data)
        }
    }

    React.useEffect(() => {
        fetch()
    }, [])

    let appName = "Pakabar Bali"
    return (
        <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    {appName}
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="{{ __('Toggle navigation') }}">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/aboutus">Tentang Kami</Link>
                        </li>
                    </ul>


                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/register">Register</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
