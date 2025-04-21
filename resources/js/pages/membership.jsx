import React from 'react';
import Footer from '../components/footer';
import request from '../axios'
import { Link, Navigate } from "react-router-dom";



export default (props) => {
    const [members, setMembers] = React.useState([]);
    const [jabatan, setJabatans] = React.useState([]);
    const [deleteUrl, setDeleteUrl] = React.useState("");
    const [deleteId, setDeleteId] = React.useState("");
    const [cities, setCities] = React.useState([]);
    const [states, setStates] = React.useState([]);
    const [hometowns, setHometowns] = React.useState([]);
    const [birthplaces, setBirthplaces] = React.useState([]);


    const fetch = async () => {
        const res = await request.get('/membership')
        if (res.status == 200 && res.data ) {
            if (res.data.members) setMembers(res.data.members)
            if (res.data.jabatan) setJabatans(res.data.jabatan)
            if (res.data.deleteUrl) setDeleteUrl(res.data.deleteUrl)
            if (res.data.city) setCities(res.data.city)
            if (res.data.state) setStates(res.data.state)
            if (res.data.hometown) setHometowns(res.data.hometown)
            if (res.data.birthplace) setBirthplaces(res.data.birthplace)

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
 
    
    if (!props.data || props.data.length <= 0 ) return null;
    return (

        <div className="container py-5">
            <h3>Data Anggota</h3>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Nomor Anggota</th>
                        <th>Pekerjaan</th>
                        <th>Domisili di Bali</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                {props.data.length > 0 && props.data.filter((d) => d.jabatan?.name === 'Member').map((d, i)  => (
                    <tbody key={i}>
                        <tr>
                            <td>{d.name}</td>
                            <td>{d.no_anggota}</td>
                            <td>{d.job}</td>
                            <td>{d.city.name}</td>
                           
                            <td>
                                <div className="d-flex flex-row gap-2">
                                    <Link className="btn btn-link text-primary text-decoration-none d-flex flex-row" to={`/profile/${d.id}`}>
                                        <i className="material-icons d-block">visibility</i>
                                        <span>View Profile</span>
                                    </Link>

                                </div>
                            </td>
                        </tr>
                    </tbody>
                ))}
            </table>

        </div>
    )
}
