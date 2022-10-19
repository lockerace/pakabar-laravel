import React from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import request from '../axios';

export default (props) => {
    const [founders, setFounders] = React.useState([]);

    const fetch = async() => {
        const res = await request.get('/about')
        if(res.status == 200 && res.data) {
            if(res.data.founder) setFounders(res.data.founder)
        }
    }

    React.useEffect(() => {
        fetch()
    }, [])

    return (
        <div>
            <Header/>
            <div className="full-height d-flex flex-column">
    <div className="flex-fill container pt-5">
        <h1 className="display-1">About Us</h1>
        <div>Description goes here...</div>

        <div className="row pt-5">
        { founders.length > 0 && founders.map((d, i) => (
            <div className="col col-md-4">
            <div className="card">
                {!d.foto && (
                    <div className="w-100 ratio-1 position-relative">
                    <div className="slider-content d-flex justify-content-center align-items-center">
                        <i className="material-icons d-block display-1">person</i>
                    </div>
                </div>
                )}
                {d.foto && (
                    <img src={"/member/" + d.foto} className="card-img-top" alt="..."></img>
                )}    
                <div className="card-body">
                    <h5 className="card-title text-center">{ d.name }</h5>
                </div>
            </div>
        </div>
        )) }
        </div>
    </div>
    <Footer/>
    </div>
</div>    

    )
}