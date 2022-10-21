import React from 'react';
import request from '../axios';

export default (props) => {
    if (!props.data || !props.data.data) return null;
    const onPageChanged = (page) => () => {
      if (props.onChange) props.onChange(page)
    }
    const clearText = (text) => text.replace('&raquo;', '»').replace('&laquo;', '«')
    const getPage = (url) => url.substring(url.indexOf('page=') + 5)
    return (
        <div className="d-flex flex-column align-items-center flex-lg-row justify-content-lg-between">
          <span className="caption text-muted my-2">Menampilkan {props.data.from} - {props.data.to} dari {props.data.total}</span>
          <div className="overflow-auto" style={{maxWidth: '100%'}}>
            <ul className="pagination m-0">
              {props.data.links.map(d => (
                <li className={"page-item" + (d.active ? ' active' : '') + (d.url ? '' : ' disabled')}>
                  <button className="pointer text-nowrap page-link" onClick={onPageChanged(d.active || !d.url ? '' : getPage(d.url))}>{clearText(d.label)}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
    )
}
