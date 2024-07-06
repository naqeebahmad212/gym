import React from 'react'
import breadcrup from "../assets/img/breadcrumb-bg.jpg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker, faMobile, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import ContactSection from '../components/ContactSection';

const Contact = () => {
    return (
        <>
            <section className="breadcrumb-section set-bg"
                style={{
                    backgroundImage: `url(${breadcrup})`,
                    backgroundSize: "cover",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: "center"
                }}
                data-setbg="img/breadcrumb-bg.jpg">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="breadcrumb-text">
                                <h2>Contact Us</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ContactSection background={"#151515"}/>
            <div className="gettouch-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="gt-text">
                                <i> <FontAwesomeIcon icon={faMapMarker} /> </i>
                                <p>333 Middle Winchendon Rd, Rindge,<br /> NH 03461</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="gt-text">
                                <i> <FontAwesomeIcon icon={faMobile} /> </i>
                                <p>
                                    <li>125-711-811</li>
                                    <li>125-668-886</li>
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="gt-text email">
                                <i> <FontAwesomeIcon icon={faEnvelope} /> </i>
                                <p>Support.gymcenter@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contact
