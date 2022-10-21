import React from 'react';
import Footer from '../components/footer';
import request from '../axios'
import { Link } from "react-router-dom";
import {format, parseISO} from 'date-fns'

export default (props) => {
    const [sliders, setSliders] = React.useState([]);
    const [news, setNews] = React.useState([]);

    const fetch = async() => {
      const res = await request.get('/home')
      if (res.status == 200 && res.data) {
        if (res.data.slider) setSliders(res.data.slider)
        if (res.data.news) setNews(res.data.news)
      }
    }

    React.useEffect(() => {
      fetch()
    }, [])

    return (
      <section className="full-height d-flex flex-column">
        <Sliders data={sliders} />
        <News data={news} />
        <Footer />
      </section>
    )
}

const Sliders = (props) => {
  if (!props.data || props.data.length <= 0) return null;
  return (
    <div id="carouselExampleIndicators" className="carousel slide w-100 " data-bs-ride="true">
      <div className="carousel-indicators">
        { props.data.map((d, i) => {
          return <button key={i} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={i} className={i == 0 ? 'active' : ''} aria-current={i == 0 ? 'true' : ''}></button>
        })}
      </div>
      <div className="carousel-inner">
        { props.data.map((d, i) => {
          return <div key={i} className={'carousel-item slider' + (i == 0 ? ' active' : '')}>
              <div className="slider-content">
                <Link to={d.url}><img src={'/storage/' + d.foto} className="d-block w-100" alt="..." /></Link>
              </div>
          </div>
        })}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  )
}

const News = (props) => {
  if (!props.data || props.data.length <= 0) return null;
  return <div className="flex-fill container">
      <div>
        <h2 className="display-2">News</h2>
      </div>
      <ul className="list-group">
        { props.data.map((d, i) => (
          <Link key={i} to={"/news/" + d.id}>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span>{d.judul}</span>
              <span className="badge bg-primary rounded-pill">{format(parseISO(d.created_at), 'Y-M-d H:m:s')}</span>
            </li>
          </Link>
        ))}
      </ul>
  </div>
}
