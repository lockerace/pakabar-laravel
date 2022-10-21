import React from 'react';
import Footer from '../components/footer'
import request from '../axios'
import { Link, useParams } from "react-router-dom";

export default (props) => {
  const { id } = useParams();
  const [data, setData] = React.useState({});

  const fetch = async() => {
    const res = await request.get('/news/' + encodeURIComponent(id))
    if (res.status == 200 && res.data) {
      setData(res.data)
    }
  }

  React.useEffect(() => {
    fetch()
  }, [])

  return (
    <section className="full-height d-flex flex-column">
        <div className="flex-fill container pt-5">
            <h1 className="display-3 py-3">{data.judul}</h1>
            <div dangerouslySetInnerHTML={{ __html: data.konten }} />
        </div>
        <Footer />
    </section>
  )
}
