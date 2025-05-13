import React from 'react';
import Footer from '../components/footer';
import request from '../axios';
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import ImageInput from '../components/imageinput'
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { el, te } from 'date-fns/locale';

import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css"; // Import stylesheet

const initFormData = {
    email: "",
    name: "",
    foto: "",
    fotoUrl: "",
    foto_selfie_ktp: "",
    fotoSelfieUrl: "",
    profile_pic: "",
    profile_pic_url: "",
    alamat: "",
    no_telp: "",
    ref_id: "",
    no_ktp: "",
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

    const [cities, setCities] = React.useState([]);
    const [states, setStates] = React.useState([]);
    const [hometowns, setHometowns] = React.useState([]);
    const [birthplaces, setBirthplaces] = React.useState([]);


    const { fetchAuth } = useOutletContext();


    const fetch = async () => {
        const res = await request.get('/register')
        if (res.status == 200 && res.data) {

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
            <Register states={states} cities={cities} hometowns={hometowns} birthplaces={birthplaces} />
            <Footer />
        </section>
    )
}

const Register = (props) => {
    const navigate = useNavigate()
    const [formData, setFormData] = React.useState(initFormData)
    const [errorMessage, seterrorMessage] = React.useState("")

    const [phoneNumber, setPhoneNumber] = React.useState(null);
    const [idNumber, setIdNumber] = React.useState(null);
    const [familymember, setFamilymember] = React.useState(null);
    const [emergencyphone, setEmergencyphone] = React.useState(null);
    const modalRef = React.useRef();
    const [cities, setCities] = React.useState([]);
    const [states, setStates] = React.useState([]);
    const [hometowns, setHometowns] = React.useState([]);
    const [birthplaces, setBirthplaces] = React.useState([]);

    const marriageOptions = [
        { value: "1", label: "Single" },
        { value: "2", label: "Menikah" },
        { value: "3", label: "Cerai" },
        { value: "4", label: "Lainnya" }
    ];
    const genderOptions = [
        { value: "1", label: "Laki-laki" },
        { value: "2", label: "Perempuan" }
    ];


    React.useEffect(() => {

        if (props.cities.length > 0 && formData.state_id) {
            setCities(props.cities.filter(city => city.state_id == formData.state_id));
        }
        if (props.hometowns.length > 0 && formData.homestate_id) {
            setHometowns(JSON.parse(JSON.stringify(props.cities.filter(city => city.state_id == formData.homestate_id))));
        }
        if (props.birthplaces.length > 0 && formData.birthstate_id) {
            setBirthplaces(JSON.parse(JSON.stringify(props.cities.filter(city => city.state_id == formData.birthstate_id))));
        }
    }, [props.cities, formData.state_id, props.hometowns, formData.homestate_id, props.birthplaces, formData.birthstate_id]);

    const onSubmit = async (event) => {
        event.preventDefault()
        const data = new FormData()
        data.append('ref_id', formData.ref_id)
        data.append('name', formData.name)
        data.append('alamat', formData.alamat)
        data.append('email', formData.email)
        data.append('no_telp', formData.no_telp)
        data.append('no_anggota', formData.no_anggota)
        data.append('no_ktp', formData.no_ktp)
        if (formData.password) data.append('password', formData.password)

        data.append('bloodtype', formData.bloodtype)
        data.append('religion', formData.religion)
        data.append('marriage', formData.marriage)
        data.append('gender', formData.gender)


        data.append('birthday', formData.birthday ? format(formData.birthday, 'yyyy-MM-dd') : '')
        data.append('jabatan_id', formData.jabatan_id)
        data.append('status', formData.status)
        data.append('foto', formData.foto)
        data.append('foto_selfie_ktp', formData.foto_selfie_ktp)
        data.append('profile_pic', formData.profile_pic)

        data.append('city_id', formData.city_id)
        data.append('hometown_id', formData.hometown_id)
        data.append('birthplace_id', formData.birthplace_id)

        data.append('job', formData.job)
        data.append('sosmed_fb', formData.sosmed_fb)
        data.append('sosmed_ig', formData.sosmed_ig)
        data.append('sosmed_twitter', formData.sosmed_twitter)
        data.append('familymember', formData.familymember)
        data.append('emergency_name', formData.emergency_name)
        data.append('emergency_phone', formData.emergency_phone)
        data.append('emergency_relation', formData.emergency_relation)

        try {
            const res = await request.post('/register', data)
            console.log(res.status)
            if (res.status == 200 && res.data) {
                if (props.fetch) props.fetch()
                navigate(res.data.url);
            }
        } catch (err) {
            seterrorMessage(err.response.data.message)
        }
    }
    const inputChange = (id, value) => {
        const temp = { ...formData }
        temp[id] = value

        if (id == 'no_telp') {
            value = value.replace(/(?!^\+)\D/g, "").slice(0, 16)
            setPhoneNumber(value)
            temp[id] = value
        } else if (id == 'no_ktp') {
            value = value.replace(/\D/g, "").slice(0, 16);
            setIdNumber(value)
            temp[id] = value
        } else if (id == 'familymember') {
            value = value.replace(/\D/g, "");
            setFamilymember(value)
            temp[id] = value
        }
        else if (id == 'emergency_phone') {
            value = value.replace(/(?!^\+)\D/g, "").slice(0, 16)
            setEmergencyphone(value)
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
            temp.ref_id = form.ref_id
            temp.email = form.email
            temp.name = form.name
            temp.password = ''
            temp.foto = ''
            temp.foto_selfie_ktp = ''
            temp.profile_pic = ''
            temp.alamat = form.alamat
            temp.no_telp = form.no_telp

            temp.no_ktp = form.no_ktp
            temp.jabatan_id = form.jabatan_id
            temp.status = "0"
            temp.fotoUrl = form.foto ? '/member/' + form.foto : ''
            temp.fotoSelfieUrl = form.foto_selfie_ktp ? '/member/' + form.foto_selfie_ktp : ''
            temp.profile_pic_url = form.profile_pic ? '/member/' + form.profile_pic : ''

            temp.birthday = form.birthday ? new Date(form.birthday) : ''
            temp.bloodtype = form.bloodtype ?? "1"
            temp.religion = form.religion ?? ""
            temp.marriage = form.marriage ?? ""
            temp.gender = form.gender ?? ""

            temp.job = form.job ?? ""
            temp.sosmed_fb = form.sosmed_fb ?? ""
            temp.sosmed_ig = form.sosmed_ig ?? ""
            temp.sosmed_twitter = form.sosmed_twitter ?? ""
            temp.familymember = form.familymember ?? ""
            temp.emergency_name = form.emergency_name ?? ""
            temp.emergency_phone = form.emergency_phone ?? ""
            temp.emergency_relation = form.emergency_relation ?? ""


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
            temp.ref_id = ''
            temp.email = ''
            temp.name = ''
            temp.password = ''
            temp.alamat = ''
            temp.no_telp = ''
            temp.no_ktp = ''
            temp.jabatan_id = 2
            temp.status = "0"
            temp.fotoUrl = ''
            temp.fotoSelfieUrl = ''
            temp.profile_pic_url = ''
            temp.birthday = ''
            temp.bloodtype = "1"
            temp.religion = ""
            temp.marriage = ""
            temp.gender = ""

            temp.job = ""
            temp.sosmed_fb = ""
            temp.sosmed_ig = ""
            temp.sosmed_twitter = ""
            temp.familymember = ""
            temp.emergency_name = ""
            temp.emergency_phone = ""
            temp.emergency_relation = ""


            temp.city_id = ''
            temp.state_id = '2'
            if (temp.state_id) {
                const res = props.cities.filter((city) => city.state_id == temp.state_id)
                setCities(res)
            } else {
                setCities([])
            }
            temp.homestate_id = '12'
            if (temp.homestate_id) {
                setHometowns(JSON.parse(JSON.stringify(props.cities.filter(city => city.state_id == temp.homestate_id))));
            } else {
                setHometowns([])
            }
            temp.birthstate_id = '12'
            if (temp.birthstate_id) {
                setBirthplaces(JSON.parse(JSON.stringify(props.cities.filter(city => city.state_id == temp.birthstate_id))));
            } else {
                setBirthplaces([])
            }
            temp.hometown_id = ''
            temp.birthplace_id = ''

        }
        setFormData(temp)
    }
    return (
        <div className="container">
            <div className="col-md-8 card m-auto my-5">
                <div className="card-header">Register</div>
                <div className="card-body">
                    <form onSubmit={onSubmit} encType="multipart/form-data" method="post">

                        <div className="mb-3">
                            <label htmlFor="memberRefId" className="form-label">Kode Referensi: </label>
                            <input id="memberRefId" className="form-control" value={formData.ref_id} placeholder="Kode Referensi" onChange={(e) => inputChange("ref_id", e.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="memberEmail" className="form-label">Email: </label>
                            <input id="memberEmail" className="form-control" value={formData.email} placeholder="Email" type="email" required="required" onChange={(e) => inputChange("email", e.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="memberName" className="form-label">Nama Anggota: </label>
                            <input id="memberName" className="form-control" value={formData.name} placeholder="Nama Anggota" required="required" onChange={(e) => inputChange("name", e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <Typeahead
                                id="state-select"
                                labelKey="name" // Display state name in dropdown
                                options={props.states} // List of states from props
                                placeholder="Pilih Provinsi..."
                                selected={props.states.filter((state) => state.id === Number(formData.state_id))} // Pre-select current value
                                inputProps={{ readOnly: true }}
                                onChange={(selected) => {
                                    if (selected.length > 0) {
                                        inputChange("state_id", selected[0].id); // Update form state
                                    } else {
                                        inputChange("state_id", ""); // Allow clearing selection
                                    }
                                }}
                            />

                        </div>
                        <div className="mb-3">
                            <label htmlFor="memberCity" className="form-label">Kota di Bali: </label>
                            <Typeahead
                                id="city-select"
                                labelKey="name" // Display city name in dropdown
                                options={cities} // List of city from props
                                placeholder="Pilih Kota..."
                                selected={cities.filter((city) => city.id === formData.city_id)} // Pre-select current value
                                onChange={(selected) => {
                                    if (selected.length > 0) {
                                        inputChange("city_id", selected[0].id); // Update form city
                                    } else {
                                        inputChange("city_id", ""); // Allow clearing selection
                                    }
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="memberAlamat" className="form-label">Alamat di Bali: </label>
                            <input id="memberAlamat" className="form-control" value={formData.alamat} placeholder="Alamat" required="required" onChange={(e) => inputChange("alamat", e.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="memberhomeState" className="form-label">Provinsi Domisili: </label>

                            <Typeahead
                                id="homestate-select"
                                labelKey="name" // Display state name in dropdown
                                options={props.states} // List of states from props
                                placeholder="Pilih Provinsi..."
                                selected={props.states.filter((homestate) => homestate.id === Number(formData.homestate_id))} // Pre-select current value
                                onChange={(selected) => {
                                    if (selected.length > 0) {
                                        inputChange("homestate_id", selected[0].id); // Update form state
                                    } else {
                                        inputChange("homestate_id", ""); // Allow clearing selection
                                    }
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="memberHometown" className="form-label">Kota Domisili: </label>

                            <Typeahead
                                id="hometown-select"
                                labelKey="name" // Display city name in dropdown
                                options={hometowns} // List of city from props
                                placeholder="Pilih Kota..."
                                selected={hometowns.filter((hometown) => hometown.id === formData.hometown_id)} // Pre-select current value
                                onChange={(selected) => {
                                    if (selected.length > 0) {
                                        inputChange("hometown_id", selected[0].id); // Update form city
                                    } else {
                                        inputChange("hometown_id", ""); // Allow clearing selection
                                    }
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Status Pernikahan:</label>
                            {marriageOptions.map((option) => (
                                <div key={option.value} className="form-check form-check-inline">
                                    <input
                                        type="radio"
                                        id={`marriage-${option.value}`}
                                        name="marriage"
                                        value={option.value}
                                        checked={formData.marriage == option.value}
                                        onChange={(e) => inputChange("marriage", e.target.value)}
                                        className="form-check-input"
                                    />
                                    <label htmlFor={`marriage-${option.value}`} className="form-check-label">
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Jenis Kelamin:</label>
                            {genderOptions.map((option) => (
                                <div key={option.value} className="form-check form-check-inline">
                                    <input
                                        type="radio"
                                        id={`gender-${option.value}`}
                                        name="gender"
                                        value={option.value}
                                        checked={formData.gender == option.value}
                                        onChange={(e) => inputChange("gender", e.target.value)}
                                        className="form-check-input"
                                    />
                                    <label htmlFor={`gender-${option.value}`} className="form-check-label">
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>


                        <div className="mb-3">
                            <label htmlFor="religion" className="form-label">Agama: </label>
                            <select id="religion" required="required" className="form-select" value={formData.religion} onChange={(e) => inputChange("religion", e.target.value)}>
                                <option>Pilih Agama</option>
                                <option value="1">Islam</option>
                                <option value="2">Kristen Protestan</option>
                                <option value="3">Kristen Katolik</option>
                                <option value="4">Hindu</option>
                                <option value="5">Buddha</option>
                                <option value="6">Konghucu</option>
                                <option value="7">Lainnya</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="memberNoTelp" className="form-label">No Telpon: </label>
                            <input id="memberNoTelp" className="form-control" value={formData.no_telp} placeholder="Nomor Telepon" required="required" onChange={(e) => inputChange("no_telp", e.target.value)} />
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

                            <Typeahead
                                id="birthstate-select"
                                labelKey="name" // Display state name in dropdown
                                options={props.states} // List of states from props
                                placeholder="Pilih Provinsi..."
                                selected={props.states.filter((birthstate) => birthstate.id === Number(formData.birthstate_id))} // Pre-select current value
                                onChange={(selected) => {
                                    if (selected.length > 0) {
                                        inputChange("birthstate_id", selected[0].id); // Update form state
                                    } else {
                                        inputChange("birthstate_id", ""); // Allow clearing selection
                                    }
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="memberbirthPlace" className="form-label">Kota Lahir: </label>

                            <Typeahead
                                id="birthplace-select"
                                labelKey="name" // Display city name in dropdown
                                options={birthplaces} // List of city from props
                                placeholder="Pilih Kota..."
                                selected={birthplaces.filter((birthplace) => birthplace.id === formData.birthplace_id)} // Pre-select current value
                                onChange={(selected) => {
                                    if (selected.length > 0) {
                                        inputChange("birthplace_id", selected[0].id); // Update form city
                                    } else {
                                        inputChange("birthplace_id", ""); // Allow clearing selection
                                    }
                                }}
                            />
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
                                <option>Pilih Golongan Darah</option>
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
                            <label htmlFor="memberJob" className="form-label">Pekerjaan: </label>
                            <input id="memberJob" className="form-control" value={formData.job} placeholder="Pekerjaan" required="required" onChange={(e) => inputChange("job", e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="memberSosmedFb" className="form-label">Facebook: </label>
                            <input id="memberSosmedFb" className="form-control" value={formData.sosmed_fb} placeholder="Facebook" required="required" onChange={(e) => inputChange("sosmed_fb", e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="memberSosmedIg" className="form-label">Instagram: </label>
                            <input id="memberSosmedIg" className="form-control" value={formData.sosmed_ig} placeholder="Instagram" required="required" onChange={(e) => inputChange("sosmed_ig", e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="memberSosmedTwitter" className="form-label">Twitter: </label>
                            <input id="memberSosmedTwitter" className="form-control" value={formData.sosmed_twitter} placeholder="Twitter" required="required" onChange={(e) => inputChange("sosmed_twitter", e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="memberFamilyMember" className="form-label">Jumlah Anggota Keluarga di Bali: </label>
                            <input id="memberFamilyMember" className="form-control" value={formData.familymember} placeholder="Anggota Keluarga" required="required" onChange={(e) => inputChange("familymember", e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="memberEmergencyName" className="form-label">Nama Kontak Darurat: </label>
                            <input id="memberEmergencyName" className="form-control" value={formData.emergency_name} placeholder="Nama Kontak Darurat" required="required" onChange={(e) => inputChange("emergency_name", e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="memberEmergencyPhone" className="form-label">Nomor Kontak Darurat: </label>
                            <input id="memberEmergencyPhone" className="form-control" value={formData.emergency_phone} placeholder="Nomor Kontak Darurat" required="required" onChange={(e) => inputChange("emergency_phone", e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="memberEmergencyRelation" className="form-label">Hubungan Kontak Darurat: </label>
                            <input id="memberEmergencyRelation" className="form-control" value={formData.emergency_relation} placeholder="Hubungan Kontak Darurat" required="required" onChange={(e) => inputChange("emergency_relation", e.target.value)} />
                        </div>

                        <ImageInput id="foto" name="foto" label="Foto KTP" value={formData.fotoUrl} placeholder="Pilih Foto KTP" onChange={(e) => inputChange('foto', e)} />
                        <ImageInput id="foto_selfie_ktp" name="foto_selfie_ktp" label="Foto Selfie KTP" value={formData.fotoSelfieUrl} placeholder="Pilih Foto Selfie KTP" onChange={(e) => inputChange('foto_selfie_ktp', e)} />
                        <ImageInput id="profile_pic" name="profile_pic" label="Foto Profil" value={formData.profile_pic_url} placeholder="Pilih Foto Profil" onChange={(e) => inputChange('profile_pic', e)} />

                        <input id="memberId" name="id" type="hidden" value={formData.id} />
                        <div className={"alert alert-danger alert-dismissible fade" + (errorMessage ? ' show' : ' hide p-0 m-0')} role="alert">
                            {errorMessage}
                            <button type="button" className="btn-close" onClick={() => seterrorMessage("")} aria-label="Close"></button>
                        </div>

                        <button className="btn btn-primary">Register</button>

                    </form>
                </div>
            </div>
        </div>
    )
}
