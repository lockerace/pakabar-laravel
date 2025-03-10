import React from 'react';
import Confirm from '../../components/modalconfirm';
import request from '../../axios';
import { Link } from "react-router-dom";
import ImageInput from '../../components/imageinput'
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

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
    birthday: "",
    city_id: "",
    state_id: "2",
    hometown_id: "",
    homestate_id: "12",
    birthplace_id: "",
    birthstate_id: "",


}

export default (props) => {
    const [members, setMembers] = React.useState([]);
    const [jabatan, setJabatans] = React.useState([]);
    const [deleteUrl, setDeleteUrl] = React.useState("");
    const [deleteId, setDeleteId] = React.useState("");
    const [cities, setCities] = React.useState([]);
    const [states, setStates] = React.useState([]);
    const [hometowns, setHometowns] = React.useState([]);
    const [homestates, setHomestates] = React.useState([]);
    const [birthplaces, setBirthplaces] = React.useState([]);
    const [birthstates, setBirthstates] = React.useState([]);




    const fetch = async () => {
        const res = await request.get('/admin/member')
        if (res.status == 200 && res.data) {
            if (res.data.members) setMembers(res.data.members)
            if (res.data.jabatan) setJabatans(res.data.jabatan)
            if (res.data.deleteUrl) setDeleteUrl(res.data.deleteUrl)
            if (res.data.city) setCities(res.data.city)
            if (res.data.state) setStates(res.data.state)
            if (res.data.hometown) setHometowns(res.data.hometown)
            if (res.data.homestate) setHomestates(res.data.homestate)
            if (res.data.birthplace) setBirthplaces(res.data.birthplace)
            if (res.data.birthstate) setBirthstates(res.data.birthstate)

        }
    }

    React.useEffect(() => {
        fetch()
    }, [])


    return (
        <section className="full-height d-flex flex-column">
            <Member data={members} setMembers={setMembers} jabatan={jabatan} setDeleteId={setDeleteId} states={states} cities={cities} homestates={homestates} hometowns={hometowns} birthstates={birthstates} birthplaces={birthplaces} />
            <Confirm deleteUrl={deleteUrl} id={deleteId} callBack={fetch} />
        </section>
    )
}

const Member = (props) => {
    const [formData, setFormData] = React.useState(initFormData);
    const [id_jabatan, setJabatanId] = React.useState("");
    const [errorMessage, seterrorMessage] = React.useState(null)
    const [phoneNumber, setPhoneNumber] = React.useState(null);
    const [idNumber, setIdNumber] = React.useState(null);
    const modalRef = React.useRef();
    const [cities, setCities] = React.useState([]);
    const [states, setStates] = React.useState([]);
    const [hometowns, setHometowns] = React.useState([]);
    const [homestates, setHomestates] = React.useState([]);
    const [birthplaces, setBirthplaces] = React.useState([]);
    const [birthstates, setBirthstates] = React.useState([]);


    const fetch = async () => {
        const res = await request.get('/admin/member?id=' + encodeURIComponent(id_jabatan))
        if (res.status == 200 && res.data) {
            if (res.data.members) props.setMembers(res.data.members)
        }
    }

    React.useEffect(() => {
        fetch()
    }, [id_jabatan])

    const onSubmit = async (event) => {
        event.preventDefault()
        const data = new FormData()
        data.append('name', formData.name)
        data.append('alamat', formData.alamat)
        data.append('email', formData.email)
        data.append('no_telp', formData.no_telp)
        data.append('no_anggota', formData.no_anggota)
        data.append('no_ktp', formData.no_ktp)
        if (formData.password) data.append('password', formData.password)

        data.append('bloodtype', formData.bloodtype)

        data.append('birthday', formData.birthday ? format(formData.birthday, 'yyyy-MM-dd') : '')
        data.append('jabatan_id', formData.jabatan_id)
        data.append('status', formData.status)
        data.append('foto', formData.foto)
        data.append('foto_selfie_ktp', formData.foto_selfie_ktp)
        data.append('id', formData.id)
        data.append('city_id', formData.city_id)
        data.append('hometown_id', formData.hometown_id)
        data.append('birthplace_id', formData.birthplace_id)


        try {
            const res = await request.post('/admin/member', data)
            if (res.status == 200 && res.data) {
                if (modalRef.current)
                    modalRef.current.click()
                fetch()
            }
        } catch (err) {
            seterrorMessage(err.response.data.message)
        }

    }

    const onVerify = (id) => async (event) => {
        event.preventDefault()
        const res = await request.post('/admin/verifymember/' + encodeURIComponent(id), {})
        if (res.status == 200 && res.data) {
            fetch()
        }
    }
    const inputChange = (id, value) => {
        const temp = { ...formData }
        temp[id] = value

        if (id == 'no_telp') {
            value = value.replace(/(?!^\+)\D/g, "")
            setPhoneNumber(value)
            temp[id] = value
        } else if (id == 'no_ktp') {
            value = value.replace(/\D/g, "").slice(0, 16);
            setIdNumber(value)
            temp[id] = value
        } else if (id == 'state_id') {
            temp[id] = value
            if (value) {
                const res = props.cities.filter((city) => city.state_id == value)
                setCities(res)
            } else {
                setCities([])
            }
        } else if (id === 'birthstate_id') {
            temp[id] = value;

            if (value) {
                setBirthplaces(JSON.parse(JSON.stringify(props.cities.filter(city => city.state_id == value))));
            } else {
                setBirthplaces([]);
            }
        } else if (id === 'homestate_id') {
            temp[id] = value;


            if (value) {
                setHometowns(JSON.parse(JSON.stringify(props.cities.filter(city => city.state_id == value))));
            } else {
                setHometowns([]);
            }
        }

        setFormData(temp)
    }
    const onEdit = (form) => () => {
        const temp = { ...formData }
        if (form) {
            temp.email = form.email
            temp.name = form.name
            temp.password = ''
            temp.foto = ''
            temp.foto_selfie_ktp = ''
            temp.alamat = form.alamat
            temp.no_telp = form.no_telp
            temp.no_anggota = form.no_anggota
            temp.no_ktp = form.no_ktp
            temp.jabatan_id = form.jabatan_id
            temp.status = form.status
            temp.fotoUrl = form.foto ? '/member/' + form.foto : ''
            temp.fotoSelfieUrl = form.foto_selfie_ktp ? '/member/' + form.foto_selfie_ktp : ''
            temp.id = form.id
            temp.birthday = form.birthday ? new Date(form.birthday) : ''
            temp.bloodtype = form.bloodtype ?? "1"

            temp.city_id = form.city_id
            temp.state_id = form.city?.state_id ?? ''
            if (temp.state_id) {
                const res = props.cities.filter((city) => city.state_id == temp.state_id)
                setCities(res)
            } else {
                setCities([])
            }

            temp.hometown_id = form.hometown_id
            temp.homestate_id = form.hometown?.state_id ?? ''
            if (temp.homestate_id) {
                setHometowns(JSON.parse(JSON.stringify(props.cities.filter(city => city.state_id == temp.homestate_id))));
            } else {
                setHometowns([])
            }
            
            temp.birthplace_id = form.birthplace_id
            temp.birthstate_id = form.birthplace?.state_id ?? ''
            if (temp.birthstate_id) {
                setBirthplaces(JSON.parse(JSON.stringify(props.cities.filter(city => city.state_id == temp.birthstate_id))));
            } else {
                setBirthplaces([])
            }

        } else {
            temp.email = ''
            temp.name = ''
            temp.password = ''
            temp.alamat = ''
            temp.no_telp = ''
            temp.no_anggota = ''
            temp.no_ktp = ''
            temp.jabatan_id = 2
            temp.status = "1"
            temp.fotoUrl = ''
            temp.fotoSelfieUrl = ''
            temp.id = ''
            temp.birthday = ''
            temp.bloodtype = "1"
            temp.city_id = ''
            temp.state_id = '2'
            temp.homestate_id = '12'
            temp.birthstate_id = ''
            temp.hometown_id = ''
            temp.birthplace_id = ''

        }
        setFormData(temp)
    }

    const onDelete = (id) => () => {
        props.setDeleteId(id)
    }

    if (!props.data || props.data.length <= 0) return null;
    return (
        <div className="container py-5">
            <h3>Data Anggota</h3>
            <div className="d-flex flex-row justify-content-end">
                <Link className="btn btn-primary mb-3 d-flex flex-row" onClick={onEdit(null)} data-bs-toggle="modal" data-bs-target="#editMemberModal" >
                    <i className="material-icons d-block">add</i>
                    <span>Tambah Anggota</span>
                </Link>
            </div>

            <form method="get">
                <div className="d-flex flex-row justify-content-end">
                    <select className="form-select" name="myOption" value={id_jabatan} onChange={(e) => setJabatanId(e.target.value)}>
                        <option value="">Semua Jabatan</option>
                        {props.jabatan.length > 0 && props.jabatan.map((d, i) => (
                            <option key={i} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </div>
            </form>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Nomor Anggota</th>
                        <th>Jabatan</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                {props.data.length > 0 && props.data.map((d, i) => (
                    <tbody key={i}>
                        <tr>
                            <td>{d.name}</td>
                            <td>{d.no_anggota}</td>
                            <td>{d.jabatan.name}</td>
                            <td>{d.status == 1 ? 'Diverifikasi' : (d.status == 2 ? 'Tidak Aktif' : 'Belum Verifikasi')}</td>
                            <td>
                                <div className="d-flex flex-row gap-2">
                                    <Link className="btn btn-link text-primary text-decoration-none d-flex flex-row" onClick={(onEdit(d))} data-bs-toggle="modal" data-bs-target="#editMemberModal">
                                        <i className="material-icons d-block">edit</i>
                                        <span>Edit</span>
                                    </Link>
                                    <Link className="btn btn-link text-danger text-decoration-none d-flex flex-row" onClick={(onDelete(d.id))} data-bs-toggle="modal" data-bs-target="#deleteModal">
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
                                    )}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                ))}
            </table>
            <form onSubmit={onSubmit} encType="multipart/form-data" method="post" >
                <div id="editMemberModal" className="modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Member</h5>
                                <button type="button" className="btn-close" ref={modalRef} data-bs-dismiss="modal" aria-label="Close"> </button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="memberEmail" className="form-label">Email: </label>
                                    <input id="memberEmail" className="form-control" value={formData.email} placeholder="Email" type="email" required="required" onChange={(e) => inputChange("email", e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="memberName" className="form-label">Nama Anggota: </label>
                                    <input id="memberName" className="form-control" value={formData.name} placeholder="Nama Anggota" required="required" onChange={(e) => inputChange("name", e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="memberState" className="form-label">Provinsi: </label>
                                    <select id="memberState" required="required" className="form-select" value={formData.state_id} onChange={(e) => inputChange("state_id", e.target.value)}>
                                        <option>Pilih Provinsi</option>
                                        {props.states.length > 0 && props.states.map((d, i) => (
                                            <option key={i} value={d.id} >{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="memberCity" className="form-label">Kota di Bali: </label>
                                    <select id="memberCity" required="required" className="form-select" value={formData.city_id} onChange={(e) => inputChange("city_id", e.target.value)}>
                                        <option>Pilih Kota</option>
                                        {cities.length > 0 && cities.map((d, i) => (
                                            <option key={i} value={d.id} >{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="memberAlamat" className="form-label">Alamat di Bali: </label>
                                    <input id="memberAlamat" className="form-control" value={formData.alamat} placeholder="Alamat" required="required" onChange={(e) => inputChange("alamat", e.target.value)} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="memberhomeState" className="form-label">Provinsi Domisili: </label>
                                    <select id="memberhomeState" required="required" className="form-select" value={formData.homestate_id} onChange={(e) => inputChange("homestate_id", e.target.value)}>
                                        <option>Pilih Provinsi</option>
                                        {props.states.length > 0 && props.states.map((d, i) => (
                                            <option key={i} value={d.id} >{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="memberHometown" className="form-label">Kota Domisili: </label>
                                    <select id="memberHometown" required="required" className="form-select" value={formData.hometown_id} onChange={(e) => inputChange("hometown_id", e.target.value)}>
                                        <option>Pilih Kota</option>
                                        {hometowns.length > 0 && hometowns.map((d, i) => (
                                            <option key={i} value={d.id} >{d.name}</option>
                                        ))}
                                    </select>
                                </div>


                                <div className="mb-3">
                                    <label htmlFor="memberNoTelp" className="form-label">No Telpon: </label>
                                    <input id="memberNoTelp" className="form-control" value={formData.no_telp} placeholder="Nomor Telepon" required="required" onChange={(e) => inputChange("no_telp", e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="memberNoAnggota" className="form-label">No Anggota: </label>
                                    <input id="memberNoAnggota" className="form-control" value={formData.no_anggota} placeholder="Nomor Anggota" required="required" onChange={(e) => inputChange("no_anggota", e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="memberPassword" className="form-label">Password: </label>
                                    <input id="memberPassword" className="form-control" value={formData.password} placeholder="Password" type="password" onChange={(e) => inputChange("password", e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="memberNoKtp" className="form-label">No KTP: </label>
                                    <input id="memberNoKtp" className="form-control" value={formData.no_ktp} placeholder="Nomor KTP" required="required" onChange={(e) => inputChange("no_ktp", e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="memberbirthState" className="form-label">Provinsi Lahir: </label>
                                    <select id="memberbirthState" required="required" className="form-select" value={formData.birthstate_id} onChange={(e) => inputChange("birthstate_id", e.target.value)}>
                                        <option>Pilih Provinsi Lahir</option>
                                        {props.states.length > 0 && props.states.map((d, i) => (
                                            <option key={i} value={d.id} >{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="memberbirthPlace" className="form-label">Kota Lahir: </label>
                                    <select id="memberbirthPlace" required="required" className="form-select" value={formData.birthplace_id} onChange={(e) => inputChange("birthplace_id", e.target.value)}>
                                        <option>Pilih Kota Lahir</option>
                                        {birthplaces.length > 0 && birthplaces.map((d, i) => (
                                            <option key={i} value={d.id} >{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="birthday" className="form-label">Tanggal Lahir: </label>
                                    <DatePicker
                                        selected={formData.birthday} //when day is clicked
                                        onChange={(e) => inputChange("birthday", e)} //only when value has changed
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        customInput={<input id="birthday" className="form-control" required="required" />}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="bloodType" className="form-label">Golongan Darah: </label>
                                    <select id="bloodType" required="required" className="form-select" value={formData.bloodtype} onChange={(e) => inputChange("bloodtype", e.target.value)}>
                                        <option value="1">O -</option>
                                        <option value="2">A -</option>
                                        <option value="3">B -</option>
                                        <option value="4">AB -</option>
                                        <option value="5">O +</option>
                                        <option value="6">A +</option>
                                        <option value="7">B +</option>
                                        <option value="8">AB +</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="memberJabatan" className="form-label">Jabatan: </label>
                                    <select id="memberJabatan" required="required" className="form-select" value={formData.jabatan_id} onChange={(e) => inputChange("jabatan_id", e.target.value)}>
                                        <option>Pilih Jabatan</option>
                                        {props.jabatan.length > 0 && props.jabatan.map((d, i) => (
                                            <option key={i} value={d.id} >{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="memberStatus" className="form-label">Status: </label>
                                    <select id="memberStatus" required="required" className="form-select" value={formData.status} onChange={(e) => inputChange("status", e.target.value)}>
                                        <option value="0">Belum Verifikasi</option>
                                        <option value="1">Diverifikasi</option>
                                    </select>
                                </div>
                                <ImageInput id="fotoPlaceholder" name="foto" label="Foto KTP" value={formData.fotoUrl} placeholder="Pilih Foto KTP" onChange={(e) => inputChange('foto', e)} />
                                <ImageInput id="fotoPlaceholder" name="foto_selfie_ktp" label="Foto Selfie KTP" value={formData.fotoSelfieUrl} placeholder="Pilih Foto Selfie KTP" onChange={(e) => inputChange('foto_selfie_ktp', e)} />
                                <input id="memberId" name="id" type="hidden" value={formData.id} />
                                <div className={"alert alert-danger alert-dismissible fade" + (errorMessage ? ' show' : ' hide p-0 m-0')} role="alert">
                                    {errorMessage}
                                    <button type="button" className="btn-close" onClick={() => seterrorMessage("")} aria-label="Close"></button>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary" >Simpan</button>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
