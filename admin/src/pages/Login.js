import React from 'react'
import breadcrup from "../assets/img/breadcrumb-bg.jpg"
import loginImg from "../assets/img/login.jpg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker, faMobile, faEnvelope } from '@fortawesome/free-solid-svg-icons';
// import axios from 'axios';

const Login = () => {
    // const data = await axios
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
                                <h2>Login</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="contact-section spad" style={{ backgroundColor: "#151515" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <img src={loginImg} style={{
                                height:"400px",
                                width:"500px"
                            }} />
                        </div>
                        <div className="col-lg-6">
                            <div className="leave-comment">
                                <form action="#">
                                    <input type="text" placeholder="Email" />
                                    <input
                                        type='text'
                                        placeholder="Password"
                                    />
                                    <button type="submit">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login
