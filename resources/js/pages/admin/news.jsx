import React from 'react';
import request from '../../axios';
import Confirm from '../../components/modalconfirm';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {CustomUploadAdapterPlugin} from '../../ckeditor.plugins'

const editorConfig = {
    extraPlugins: [ CustomUploadAdapterPlugin('/admin/news/image-upload') ],
}

export default (props) => {
  const [news, setNews] = React.useState([])
  const [jabatan, setJabatan] = React.useState([])
  const [deleteId, setDeleteId] = React.useState('')
  const [editData, setEditData] = React.useState()

  const fetch = async() => {
    const res = await request.get('/admin/news')
    if(res.status == 200 && res.data) {
      if(res.data.news) setNews(res.data.news)
      if(res.data.jabatan) setJabatan(res.data.jabatan)
    }
  }

  React.useEffect(() => {
    fetch()
  }, [])

  const onEdit = (form) => () => {
    setEditData(form)
  }

  const onDelete = (id) => () => {
    setDeleteId(id)
  }

  return (
    <div className="full-height container py-5 d-flex flex-column">
      <h3>Data News</h3>
      <div className="d-flex flex-row justify-content-end">
          <a className="btn btn-primary mb-3 d-flex flex-row" onClick={onEdit()} data-bs-toggle="modal" data-bs-target="#editNewsModal" >
              <i className="material-icons d-block">add</i>
              <span>Tambah</span>
          </a>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>News</th>
            <th>Konten</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
        { news && news.length > 0 && news.map((d, i) => (
          <tr key={i}>
            <td>{ d.judul }</td>
            <td>{ d.konten }</td>
            <td>
            <div className="d-flex flex-row gap-2">
              <a className="btn btn-link text-primary text-decoration-none d-flex flex-row" onClick={onEdit(d)} data-bs-toggle="modal" data-bs-target="#editNewsModal">
                <i className="material-icons d-block">edit</i>
                <span>Edit</span>
              </a>
              <a className="btn btn-link text-danger text-decoration-none d-flex flex-row" onClick={onDelete(d.id)} data-bs-toggle="modal" data-bs-target="#deleteModal">
                <i className="material-icons d-block">delete</i>
                <span>Hapus</span>
              </a>
            </div>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <EditNewsForm data={editData} jabatan={jabatan} fetch={fetch} />
      <Confirm deleteUrl="/admin/deletenews" id={deleteId} callBack={fetch} />
    </div>
  )
}

const initFormData = {
  id: '',
  judul: '',
  konten: '',
  receiver: '0',
}

const EditNewsForm = (props) => {
  const [formData, _setFormData] = React.useState(initFormData);
  const formDataRef = React.useRef(formData);
  const [errorMessage, seterrorMessage] = React.useState("");
  const [id_jabatan, setJabatanId] = React.useState("");
  const modalRef = React.useRef();

  const setFormData = (val) => {
    formDataRef.current = val
    _setFormData(val)
  }

  const onSubmit = async(event) => {
    event.preventDefault();

    try {
        const res = await request.post('/admin/news', formData)
        if (res.status == 200 && res.data) {
          if(modalRef.current)
              modalRef.current.click()
        props.fetch()
        } 
    }
    catch (err) {
      seterrorMessage(err.response.data.message)
    }
  }

  React.useEffect(() => {
    const receiver = document.getElementById('receiver');
    if (props.data) {
      const temp = {...formData}
      temp.id = props.data.id
      temp.judul = props.data.judul
      temp.konten = props.data.konten
      setFormData(temp)

      receiver.classList.add("d-none");
      receiver.classList.remove("d-block");
    } else {
      const temp = {...initFormData}
      setFormData(temp)

      receiver.classList.add("d-block");
      receiver.classList.remove("d-none");
    }
  }, [props.data])

  const inputChanged = (id, value) => {
    const temp = {...formDataRef.current}
    temp[id] = value
    setFormData(temp)
  }

  return (
    <form method="post" onSubmit={onSubmit}>
      <div id="editNewsModal" className="modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">News</h5>
              <button type="button" className="btn-close" ref={modalRef} data-bs-dismiss="modal" aria-label="Close">
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="newsJudul" className="form-label">Judul News: </label>
                <input id="newsJudul" className="form-control" name="judul" placeholder="Judul" required="required" value={formData.judul} onChange={(e) => inputChanged('judul', e.target.value)} />
              </div>
              <div className="mb-3 d-none" id="receiver">
                <label htmlFor="receiverId">Kirim Notifikasi: </label>
                <select className="form-select" id="receiverId" value={formData.receiver} onChange={(e) => inputChanged('receiver', e.target.value)}>
                    <option value="0">Tanpa Notifikasi</option>
                    <option value="all">Semua</option>
                    { props.jabatan.length > 0 && props.jabatan.map((d, i) => (
                        <option key={i} value={ d.id }>{ d.name }</option>
                    )) }
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="newsKonten" className="form-label">Konten: </label>
                <CKEditor
                    editor={ ClassicEditor }
                    data={formData.konten}
                    onChange={(e, editor) => inputChanged('konten', editor.getData())}
                    config={editorConfig}
                    />
              </div>
              <input id="newsId" name="id" type="hidden" value={formData.id}/>
              <div className={"alert alert-danger alert-dismissible fade" + (errorMessage?' show' : ' hide p-0 m-0')} role="alert">
                  {errorMessage}
                  <button type="button" className="btn-close" onClick={() => seterrorMessage("")} aria-label="Close"></button>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary">Simpan</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
