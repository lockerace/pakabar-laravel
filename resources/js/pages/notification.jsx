import React from 'react';
import Footer from '../components/footer'
import Pagination from '../components/pagination';
import request from '../axios'
import { Link, useParams, useOutletContext } from "react-router-dom";
import { parseISO, formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

export default (props) => {
  const { id } = useParams();
  const {auth, fetchAuth} = useOutletContext();
  const [data, setData] = React.useState({});
  const [message, setMessage] = React.useState();
  const [jabatan, setJabatan] = React.useState([]);
  const [users, setUsers] = React.useState([]);

  const fetch = async(page) => {
    let url = '/notification'
    if (page) {
      url += '?page=' + encodeURIComponent(page)
    }
    const res = await request.get(url)
    if (res.status == 200 && res.data) {
      if (res.data.notifikasi) setData(res.data.notifikasi)
      if (res.data.jabatan) setJabatan(res.data.jabatan)
      if (res.data.user) setUsers(res.data.user)
    }
  }

  React.useEffect(() => {
    fetch()
  }, [])

  const onPage = (page) => fetch(page)

  return (
    <section className="full-height d-flex flex-column">
        <div className="flex-fill container pt-5">
          <h1 className="display-3">Notifikasi</h1>
          { auth && auth.jabatan_id == 1 && <SendNotif fetch={fetch} fetchAuth={fetchAuth} jabatan={jabatan} users={users} /> }
          { data && data.data && data.data.length > 0 && (<>
            <ul className="list-group">
              { data.data.map((d, i) => (
                  <NotifItem key={i} data={d} setMessage={setMessage} fetch={fetch} fetchAuth={fetchAuth} />
              ))}
            </ul>
            <Pagination data={data} onChange={onPage} />
          </>)}

          <div id="messageModal" className="modal" tabIndex="-1">
              <div className="modal-dialog">
                  <div className="modal-content">
                      <div className="modal-header">
                          <h5 className="modal-title">{message ? message.data.title : ''}</h5>
                          <a className="btn-close" aria-label="Close" data-bs-dismiss="modal"></a>
                      </div>
                      <div className="modal-body">
                          <p>{message ? message.data.message : ''}</p>
                      </div>
                      <div className="modal-footer">
                          <a href="#" className="btn btn-secondary" data-bs-dismiss="modal">Close</a>
                      </div>
                  </div>
              </div>
          </div>
        </div>
        <Footer />
    </section>
  )
}

const NotifItem = (props) => {
  if (!props.data) return null;

  const onMessageShow = async(data) => {
    if (props.setMessage) props.setMessage(data)

    if (!data.read_at) {
      const res = await request.get('/notification/read/' + encodeURIComponent(data.id))
      if (res.status == 200 && res.data) {
        props.fetch()
        props.fetchAuth()
      }
    }
  }

  return (
    <a data-bs-toggle="modal" onClick={() => onMessageShow(props.data)} data-bs-target="#messageModal">
        <li className={"list-group-item d-flex justify-content-between align-items-center" + (props.data.read_at ? ' text-muted bg-transparent' : '')}>
            <span>{props.data.data.title}</span>
            <span className="badge bg-primary rounded-pill">{ formatDistanceToNow(parseISO(props.data.created_at), {locale: id}) }</span>
        </li>
    </a>
  )
}

const initFormData = {
    title: "",
    message: "",
    groupReceiver: "all",
    singleReceiver: "",
}

const SendNotif = (props) => {
  const [formData, setFormData] = React.useState(initFormData);
  const modalRef = React.useRef();

  const inputChange = (id, value) =>{
      const temp = {...formData}
      temp[id] = value
      setFormData(temp)

      if(id == "groupReceiver") {
        const single = document.getElementById('singleReceiver')
        if(value == "single") {
          single.classList.add('d-block')
          single.classList.remove('d-none')
        } else {
          single.classList.add('d-none')
          single.classList.remove('d-block')
        }
      }
  }

  const onSubmit = async(event) =>{
      event.preventDefault()
      const res = await request.post('/admin/send-notification', formData)
      if (res.status == 200 && res.data) {
          if(modalRef.current)
              modalRef.current.click()
          props.fetch()
          props.fetchAuth()
          setFormData(initFormData)

        const single = document.getElementById('singleReceiver')
        single.classList.add('d-none')
        single.classList.remove('d-block')
      }
  }

  return (<>
    <div className="d-flex flex-row justify-content-end">
        <a className="btn btn-primary mb-3 d-flex flex-row" data-bs-toggle="modal" data-bs-target="#editNotifikasiModal" >
            <i className="material-icons d-block">add</i>
            <span>Kirim Notifikasi</span>
        </a>
    </div>
    <form method="post" onSubmit={onSubmit}>
        <div id="editNotifikasiModal" className="modal" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Kirim Notifikasi</h5>
                        <button type="button" className="btn-close" ref={modalRef} data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="notifTitle" className="form-label">Title: </label>
                            <input id="notifTitle" className="form-control" name="title" placeholder="Judul" required="required" value={formData.title} onChange={(e)=>inputChange("title", e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="notifMessage" className="form-label">Pesan: </label>
                            <input id="notifMessage" className="form-control" name="message" placeholder="Isi pesan" required="required" value={formData.message} onChange={(e)=>inputChange("message", e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="notifGroupReceiver" className="form-label">Penerima: </label>
                            <select className="form-select" id="notifGroupReceiver" value={formData.groupReceiver} onChange={(e) => inputChange('groupReceiver', e.target.value)}>
                              <option value="all">Semua</option>
                              <option value="single">Individu</option>
                              <option disabled>- - - - - - -</option>
                              { props.jabatan.length > 0 && props.jabatan.map((d, i) => (
                                  <option key={i} value={ d.id }>{ d.name }</option>
                              )) }
                            </select>
                        </div>
                        <div className="mb-3 d-none" id="singleReceiver">
                            <label htmlFor="notifSingleReceiver" className="form-label">Penerima: </label>
                            <select className="form-select" id="notifSingleReceiver" value={formData.singleReceiver} onChange={(e) => inputChange('singleReceiver', e.target.value)}>
                              <option disabled value="">Pilih Penerima</option>
                              { props.users.length > 0 && props.users.map((d, i) => (
                                  <option key={i} value={ d.id }>{ d.name }</option>
                              )) }
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button  className="btn btn-primary">Kirim</button>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
  </>)
}
