import React from 'react';
import Footer from '../components/footer';
import request from '../axios'
import { Link } from "react-router-dom";
import { format, parseISO } from 'date-fns'

export default (props) => {
  const [sliders, setSliders] = React.useState([]);
  //const [news, setNews] = React.useState([]);

  
  const [news, setNews] = React.useState([]);   // accumulated items
  const [meta, setMeta] = React.useState(null); // paginator info
  const perPage =5;                   // match controller

  // const fetch = async () => {
  //   const res = await request.get('/home')
  //   if (res.status == 200 && res.data) {
  //     if (res.data.slider) setSliders(res.data.slider)
  //     //if (res.data.news) setNews(res.data.news)
  //   }
  // }
  const fetchPage = async (page = 1) => {
    const res = await request.get('/home', { params: { page, per_page: perPage }});
    if (res.status === 200 && res.data) {
      const p = res.data.news;          // ← paginator object
      setNews(prev => page === 1 ? p.data : [...prev, ...p.data]);
      setMeta(p);
      if (res.data.slider) setSliders(res.data.slider);
    }
  };

  // React.useEffect(() => {
  //   fetch()
  // }, [])

  React.useEffect(() => { fetchPage(1); }, []);

  return (
    <section className="full-height d-flex flex-column">
      <Sliders data={sliders} />
      {/* <News data={news} /> */}
      <News
        data={news}
        meta={meta}
        onLoadMore={() => fetchPage((meta?.current_page || 1) + 1)}
      />
      <Footer />
    </section>
  )
}

const Sliders = (props) => {
  if (!props.data || props.data.length <= 0) return null;
  return (
    <div id="carouselExampleIndicators" className="carousel slide w-100 " data-bs-ride="true">
      <div className="carousel-indicators">
        {props.data.map((d, i) => {
          return <button key={i} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={i} className={i == 0 ? 'active' : ''} aria-current={i == 0 ? 'true' : ''}></button>
        })}
      </div>
      <div className="carousel-inner">
        {props.data.map((d, i) => {
          return <div key={i} className={'carousel-item slider' + (i == 0 ? ' active' : '')}>
            <div className="slider-content">
              <Link to={d.url}><img src={'/storage/' + d.foto} className="d-block h-100 w-100" style={{ objectFit: "contain" }} alt="..." /></Link>
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

// const News = (props) => {
//   if (!props.data || props.data.length <= 0) return null;
//   return <div className="flex-fill container">
//     <div>
//       <h2 className="display-2">News</h2>
//     </div>
//     <ul className="list-group">
//       {props.data.map((d, i) => (
//         <Link key={i} to={"/news/" + d.id}>
//           <li className="list-group-item d-flex justify-content-between align-items-center">
//             <span>{d.judul}</span>
//             <span className="badge bg-primary rounded-pill">{format(parseISO(d.created_at), 'Y-M-d H:m:s')}</span>
//           </li>
//         </Link>
//       ))}
//     </ul>
//   </div>
// }
const News = ({ data = [], meta, onLoadMore }) => {
 
  if (data.length === 0) return null; 
  return (
    <div className="flex-fill container">
      <h2 className="display-2">News</h2>

      <ul className="list-group">
        {data.map(d => (
          <Link key={d.id} to={'/news/' + d.id}>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span>{d.judul}</span>
              <span className="badge bg-primary rounded-pill">
                {format(parseISO(d.created_at), 'yyyy-MM-dd HH:mm:ss')}
              </span>
            </li>
          </Link>
        ))}
      </ul>

      {/* load‑more button only if another page exists */}
      {meta && meta.current_page < meta.last_page && (
        <div className="text-center my-3">
          <button onClick={onLoadMore} className="btn btn-outline-primary">
            Load more
          </button>
        </div>
      )}
    </div>
  );
};
