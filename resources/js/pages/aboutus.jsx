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
            <div class="full-height d-flex flex-column">
    <div class="flex-fill container pt-5">
        <h1 class="display-1">About Us</h1>
        <div>Description goes here...</div>

        <div class="row pt-5">
        { founders.length > 0 && founders.map((d, i) => (
            <div class="col col-md-4">
            <div class="card">
                {!d.foto && (
                    <div class="w-100 ratio-1 position-relative">
                    <div class="slider-content d-flex justify-content-center align-items-center">
                        <i class="material-icons d-block display-1">person</i>
                    </div>
                </div>
                )}
                {d.foto && (
                    <img src={"/member/" + d.foto} class="card-img-top" alt="..."></img>
                )}    
                <div class="card-body">
                    <h5 class="card-title text-center">{ d.name }</h5>
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