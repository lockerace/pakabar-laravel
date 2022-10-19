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
        <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
            <div class="container">
                <Link class="navbar-brand" to="/">
                    {appName}
                </Link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="{{ __('Toggle navigation') }}">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <Link class="nav-link" to="/aboutus">Tentang Kami</Link>
                        </li>
                    </ul>


                    <ul class="navbar-nav ms-auto">
                                <li class="nav-item">
                                    <Link class="nav-link" to="/login">Login</Link>
                                </li>

                                <li class="nav-item">
                                    <Link class="nav-link" to="/register">Register</Link>
                                </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}