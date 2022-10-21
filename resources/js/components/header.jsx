import React from 'react';
import {format} from 'date-fns';
import { applyStyles } from '@popperjs/core';
import {Link, useNavigate} from "react-router-dom";
import request from '../axios'

export default (props) => {
    const navigate = useNavigate();

    const logOut = async() => {
        try {
            const res = await request.post('/logout')
            if(res.status == 200) {
                localStorage.removeItem('token')
                props.fetch()
                navigate('/')
            }
        } catch (err) {}
    }

    let appName = "Pakabar Bali"
    return (
        <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    {appName}
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/aboutus">Tentang Kami</Link>
                        </li>
                    </ul>

                    <UserMenu user={props.auth} logOut={logOut} />
                </div>
            </div>
        </nav>
    )
}

const UserMenu = (props) => {
  if (props.user) {
      return (
          <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                  <a id="navbarDropdown" className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                      {props.user.name}
                  </a>

                  <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                      { props.user.jabatan_id == 1 && (
                        <>
                            <Link className="dropdown-item" to="/admin/finance">Finance</Link>
                            <Link className="dropdown-item" to="/admin/jabatan">Jabatan</Link>
                            <Link className="dropdown-item" to="/admin/member">Member</Link>
                            <Link className="dropdown-item" to="/admin/news">News</Link>
                            <Link className="dropdown-item" to="/admin/slider">Slider</Link>
                            <hr className="dropdown-divider" />
                        </>
                      )}
                      <Link className="dropdown-item d-flex flex-row align-items-center" to="/notification">
                          <span className="me-1">Notifikasi</span>
                          { props.user.unread_notifications && props.user.unread_notifications.length > 0 && (
                              <span className="badge bg-danger">{props.user.unread_notifications.length}</span>
                          )}
                      </Link>
                      <Link className="dropdown-item" to="/profile">Ubah Profil</Link>
                      <button type="button" className="dropdown-item" onClick={props.logOut}>Logout</button>
                  </div>
              </li>
          </ul>
      )
  } else {
      return (
          <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
              </li>

              <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
              </li>
          </ul>
      )
  }
}
