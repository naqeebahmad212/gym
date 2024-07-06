import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import logo from "../assets/img/logo.png";
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();

    return (
        <div>
            <section className="footer-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="fs-about">
                                <div className="fa-logo">
                                    <a href="#"><img src={logo} alt="" /></a>
                                </div>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                                    labore dolore magna aliqua endisse ultrices gravida lorem.</p>
                                <div className="fa-social">
                                    <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
                                    <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                                    <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
                                    <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                                    <a href="#"><FontAwesomeIcon icon={faEnvelope} /></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6">
                            <div className="fs-widget">
                                <h4>Useful links</h4>
                                <ul>
                                    <li className={location.pathname === "/" ? "active" : ""}>
                                        <Link to="/" style={{ textDecoration: 'none' }}>Home</Link>
                                    </li>
                                    <li className={location.pathname === "/Gyms" ? "active" : ""}>
                                        <Link to="/Gym" style={{ textDecoration: 'none' }}>Gyms</Link>
                                    </li>
                                    <li><Link to="/Contact-us" style={{ textDecoration: 'none' }}>Register As A Gym</Link></li>
                                    <li className={location.pathname === "/Contact-us" ? "active" : ""}>
                                        <Link to="/Contact-us" style={{ textDecoration: 'none' }}>Contact Us</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6">
                            <div className="fs-widget">
                                <h4>Support</h4>
                                <ul>
                                    <li><a href="#">Login</a></li>
                                    <li><a href="#">Contact</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="copyright-text">
                                <p>
                                    Copyright &copy;
                                    <script>document.write(new Date().getFullYear());</script> All rights reserved by FLEXFLOW
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Footer;
