import React from 'react';
import request from '../../axios';
import Confirm from '../../components/modalconfirm';
import ImageInput from '../../components/imageinput'

export default (props) => {
  const [sliders, setSliders] = React.useState([]);
  const [deleteId, setDeleteId] = React.useState('');
  const [editData, setEditData] = React.useState();

  const fetch = async() => {
    const res = await request.get('/admin/slider')
    if(res.status == 200 && res.data) {
      if(res.data.slider) setSliders(res.data.slider)
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
      <h3>Data Slider</h3>
      <div className="d-flex flex-row justify-content-end">
          <a className="btn btn-primary mb-3 d-flex flex-row" onClick={onEdit()} data-bs-toggle="modal" data-bs-target="#editSliderModal" >
              <i className="material-icons d-block">add</i>
              <span>Tambah</span>
          </a>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
              <th>Foto Slider</th>
              <th>Url</th>
              <th>Status</th>
              <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
        { sliders && sliders.length > 0 && sliders.map((d, i) => (
          <tr key={i}>
              <td>{ d.foto }</td>
              <td>{ d.url }</td>
              <td>{ d.status }</td>
              <td>
                <div className="d-flex flex-row gap-2">
                  <a className="btn btn-link text-primary text-decoration-none d-flex flex-row" onClick={onEdit(d)} data-bs-toggle="modal" data-bs-target="#editSliderModal">
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
      <EditSliderForm data={editData} fetch={fetch} />
      <Confirm deleteUrl="/admin/deleteslider" id={deleteId} callBack={fetch} />
    </div>
  )
}

const initFormData = {
  id: '',
  foto: '',
  url: '',
  status: 'aktif',
  fotoUrl: '',
}

const EditSliderForm = (props) => {
  const [formData, setFormData] = React.useState(initFormData);
  const [errorMessage, seterrorMessage] = React.useState("");
  const modalRef = React.useRef();

  const onSubmit = async(event) => {
    event.preventDefault();
    const data = new FormData();
    if (formData.id) data.append('id', formData.id)
    data.append('url', formData.url)
    if (formData.foto) data.append('foto', formData.foto)
    data.append('status', formData.status)

    try {
        const res = await request.post('/admin/slider', data)
        if (res.status == 200 && res.data) {
            if(modalRef.current)
                modalRef.current.click()
            props.fetch()
        }
    } catch (err) {
        seterrorMessage(err.response.data.message)
    }
    
  }

  React.useEffect(() => {
    if (props.data) {
      const temp = {...formData}
      temp.id = props.data.id
      temp.foto = '';
      temp.url = props.data.url
      temp.status = props.data.status
      temp.fotoUrl = "/storage/" + props.data.foto
      setFormData(temp)
    } else {
      const temp = {...initFormData}
      setFormData(temp)
    }
  }, [props.data])

  const inputChanged = (id, value) => {
    const temp = {...formData}
    temp[id] = value
    setFormData(temp)
  }

  return (
    <form method="post" encType="multipart/form-data" onSubmit={onSubmit}>
      <div id="editSliderModal" className="modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Slider</h5>
              <button type="button" className="btn-close" ref={modalRef} data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <ImageInput id="fotoPlaceholder" name="foto" label="Foto" value={formData.fotoUrl} placeholder="Pilih Foto" onChange={(e) => inputChanged('foto', e)} />
              <div className="mb-3">
                <label htmlFor="sliderUrl" className="form-label">URL: </label>
                <input id="sliderUrl" className="form-control" name="url" placeholder="URL Slider" required="required" value={formData.url} onChange={e => inputChanged('url', e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="sliderStatus" className="form-label">Status: </label>
                <select id="sliderStatus" required="required" className="form-select" name="status" value={formData.status} onChange={e => inputChanged('status', e.target.value)}>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>
              <input id="sliderId" name="id" type="hidden" value={formData.id}/>
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
