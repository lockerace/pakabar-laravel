import React from 'react';
import Footer from '../components/footer';
import request from '../axios'
import { Link, Navigate } from "react-router-dom";

const initFormData = {
    email: "",
    name: "",
    foto: "",
    fotoUrl: "",
    foto_selfie_ktp: "",
    fotoSelfieUrl: "",
    alamat: "",
    no_telp: "",
    no_anggota: "",
    no_ktp: "",
    jabatan_id: "",
    status: "",
    bloodtype: "1",
    religion: "",
    birthday: "",
    city_id: "",
    state_id: "2",
    hometown_id: "",
    homestate_id: "12",
    birthplace_id: "",
    birthstate_id: "12",
    marriage: "",
    gender: "",

    job: "",
    sosmed_fb: "",
    sosmed_ig: "",
    sosmed_twitter: "",
    familymember: "",
    emergency_name: "",
    emergency_phone: "",
    emergency_relation: "",
}

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
const onVerify = (id) => async (event) => {
    // event.preventDefault()
    // const res = await request.post('/admin/verifymember/' + encodeURIComponent(id), {})
    // if (res.status == 200 && res.data) {
    //     fetch()
    // }
}
const inputChange = (id, value) => {
    // const temp = { ...formData }
    // temp[id] = value

    // if (id == 'no_telp') {
    //     value = value.replace(/(?!^\+)\D/g, "").slice(0, 16)
    //     setPhoneNumber(value)
    //     temp[id] = value
    // } else if (id == 'no_ktp') {
    //     value = value.replace(/\D/g, "").slice(0, 16);
    //     setIdNumber(value)
    //     temp[id] = value
    // } else if (id == 'familymember') {
    //     value = value.replace(/\D/g, "");
    //     setFamilymember(value)
    //     temp[id] = value
    // }
    // else if (id == 'emergency_phone') {
    //     value = value.replace(/(?!^\+)\D/g, "").slice(0, 16)
    //     setEmergencyphone(value)
    //     temp[id] = value
    // } else if (id == 'state_id') {
    //     temp[id] = value
    //     if (value) {
    //         const res = props.cities.filter((city) => city.state_id == value)
    //         setCities(res)
    //     } else {
    //         setCities([])
    //     }
    // } else if (id === 'birthstate_id') {
    //     temp[id] = value;

    //     if (value) {
    //         setBirthplaces(JSON.parse(JSON.stringify(props.cities.filter(city => city.state_id == value))));
    //     } else {
    //         setBirthplaces([]);
    //     }
    // } else if (id === 'homestate_id') {
    //     temp[id] = value;


    //     if (value) {
    //         setHometowns(JSON.parse(JSON.stringify(props.cities.filter(city => city.state_id == value))));
    //     } else {
    //         setHometowns([]);
    //     }
    // }

    // setFormData(temp)
}
const onEdit = (form) => () => {
    // const temp = { ...formData }
    // if (form) {
    //     temp.ref_id = form.ref_id ?? ''
    //     temp.email = form.email
    //     temp.name = form.name
    //     temp.password = ''
    //     temp.foto = ''
    //     temp.foto_selfie_ktp = ''
    //     temp.alamat = form.alamat
    //     temp.no_telp = form.no_telp
    //     temp.no_anggota = form.no_anggota
    //     temp.no_ktp = form.no_ktp
    //     temp.jabatan_id = form.jabatan_id
    //     temp.status = form.status
    //     temp.fotoUrl = form.foto ? '/member/' + form.foto : ''
    //     temp.fotoSelfieUrl = form.foto_selfie_ktp ? '/member/' + form.foto_selfie_ktp : ''
    //     temp.id = form.id
    //     temp.birthday = form.birthday ? new Date(form.birthday) : ''
    //     temp.bloodtype = form.bloodtype ?? "1"
    //     temp.religion = form.religion ?? ""
    //     temp.marriage = form.marriage ?? ""
    //     temp.gender = form.gender ?? ""

    //     temp.job = form.job ?? ""
    //     temp.sosmed_fb = form.sosmed_fb ?? ""
    //     temp.sosmed_ig = form.sosmed_ig ?? ""
    //     temp.sosmed_twitter = form.sosmed_twitter ?? ""
    //     temp.familymember = form.familymember ?? ""
    //     temp.emergency_name = form.emergency_name ?? ""
    //     temp.emergency_phone = form.emergency_phone ?? ""
    //     temp.emergency_relation = form.emergency_relation ?? ""


    //     temp.city_id = form.city_id
       
    //     temp.state_id = form.city?.state_id ?? ''
         
    //     if (temp.state_id) {
    //         const res = props.cities.filter((city) => city.state_id == temp.state_id)
    //         setCities(res)
    //     } else {
    //         setCities([])
    //     }

    //     temp.hometown_id = form.hometown_id
    //     temp.homestate_id = form.hometown?.state_id ?? ''
    //     if (temp.homestate_id) {
    //         setHometowns(JSON.parse(JSON.stringify(props.cities.filter(city => city.state_id == temp.homestate_id))));
    //     } else {
    //         setHometowns([])
    //     }

    //     temp.birthplace_id = form.birthplace_id
    //     temp.birthstate_id = form.birthplace?.state_id ?? ''
    //     if (temp.birthstate_id) {
    //         setBirthplaces(JSON.parse(JSON.stringify(props.cities.filter(city => city.state_id == temp.birthstate_id))));
    //     } else {
    //         setBirthplaces([])
    //     }

    // } else {
    //     temp.ref_id = ''
    //     temp.email = ''
    //     temp.name = ''
    //     temp.password = ''
    //     temp.alamat = ''
    //     temp.no_telp = ''
    //     temp.no_anggota = ''
    //     temp.no_ktp = ''
    //     temp.jabatan_id = 2
    //     temp.status = "1"
    //     temp.fotoUrl = ''
    //     temp.fotoSelfieUrl = ''
    //     temp.id = ''
    //     temp.birthday = ''
    //     temp.bloodtype = "1"
    //     temp.religion = ""
    //     temp.marriage = ""
    //     temp.gender = ""
    //     temp.job = ""
    //     temp.sosmed_fb = ""
    //     temp.sosmed_ig = ""
    //     temp.sosmed_twitter = ""
    //     temp.familymember = ""
    //     temp.emergency_name = ""
    //     temp.emergency_phone = ""
    //     temp.emergency_relation = ""


    //     temp.city_id = ''
    //     temp.state_id = '2'
    //     if (temp.state_id) {
    //         const res = props.cities.filter((city) => city.state_id == temp.state_id)
    //         setCities(res)
    //     } else {
    //         setCities([])
    //     }
    //     temp.homestate_id = '12'
    //     if (temp.homestate_id) {
    //         setHometowns(JSON.parse(JSON.stringify(props.cities.filter(city => city.state_id == temp.homestate_id))));
    //     } else {
    //         setHometowns([])
    //     }
    //     temp.birthstate_id = '12'
    //     if (temp.birthstate_id) {
    //         setBirthplaces(JSON.parse(JSON.stringify(props.cities.filter(city => city.state_id == temp.birthstate_id))));
    //     } else {
    //         setBirthplaces([])
    //     }
    //     temp.hometown_id = ''
    //     temp.birthplace_id = ''

    // }
    // setFormData(temp)
    // console.log(formData)
}

const onDelete = (id) => () => {
    //props.setDeleteId(id)
}
const Members = (props) => {
    const [formData, setFormData] = React.useState(initFormData);
    const [id_jabatan, setJabatanId] = React.useState("");
    const [errorMessage, seterrorMessage] = React.useState(null)
    const [phoneNumber, setPhoneNumber] = React.useState(null);
    const [idNumber, setIdNumber] = React.useState(null);
    const [familymember, setFamilymember] = React.useState(null);
    const [emergencyphone, setEmergencyphone] = React.useState(null);
    const modalRef = React.useRef();
    const [cities, setCities] = React.useState([]);
    const [states, setStates] = React.useState([]);
    const [hometowns, setHometowns] = React.useState([]);
    const [birthplaces, setBirthplaces] = React.useState([]);

    


    React.useEffect(() => {
        if (props.data) {
            const temp = { ...formData }
            temp.email = props.data.email
            setFormData(temp)
        }
    }, [props.data])

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
                            {/* <td>{d.status == 1 ? 'Diverifikasi' : (d.status == 2 ? 'Tidak Aktif' : 'Belum Verifikasi')}</td> */}
                            <td>
                                <div className="d-flex flex-row gap-2">
                                    <Link className="btn btn-link text-primary text-decoration-none d-flex flex-row" onClick={(onEdit(d))} data-bs-toggle="modal" data-bs-target="#editMemberModal">
                                        <i className="material-icons d-block">edit</i>
                                        <span>Edit</span>
                                    </Link>
{/*                                     <Link className="btn btn-link text-danger text-decoration-none d-flex flex-row" onClick={(onDelete(d.id))} data-bs-toggle="modal" data-bs-target="#deleteModal">
                                        <i className="material-icons d-block">delete</i>
                                        <span>Hapus</span>
                                    </Link>
                                    {d.status == 0 && (
                                        <form onSubmit={(onVerify(d.id))} method="post">
                                            <button className="btn btn-link text-success text-decoration-none d-flex flex-row">
                                                <i className="material-icons d-block">check</i>
                                                <span>Verifikasi</span>
                                            </button>
                                        </form>
                                    )} */}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                ))}
            </table>

        </div>
    )
}
