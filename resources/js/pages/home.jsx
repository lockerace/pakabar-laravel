import React from 'react';
import Footer from '../components/footer';
import Header from '../components/header';

export default (props) => {
    return (
        <div>
            <Header/>
            <section className="full-height d-flex flex-column">
                <h1>{props.Judul}</h1>
                <Footer/>
            </section>
        </div>
    )
}