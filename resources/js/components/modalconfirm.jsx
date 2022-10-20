import React from 'react';
import request from '../axios';

export default (props) => {
    const onSubmit = async(event) => {
        event.preventDefault()
        const res = await request.post(props.deleteUrl, {id:props.id})
        if (res.status == 200 && res.data) {
            props.callBack()
        }
    }
    return (
        <form onSubmit={onSubmit} method="post">
            <input id="deleteId" name="id" type="hidden" value=""/>
            <div id="deleteModal" className="modal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-danger text-decoration-none d-flex flex-row">
                                <i className="material-icons d-block">warning</i>
                                Konfirmasi
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Yakin untuk menghapus?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-danger" data-bs-dismiss="modal">Hapus</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
