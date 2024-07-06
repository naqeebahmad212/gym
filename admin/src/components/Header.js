import React from 'react'
import Hero1 from "../assets/img/hero/hero-1.jpg"
import { Link } from 'react-router-dom'


const Header = () => {
    return (
        <>
            <div className="offcanvas-menu-overlay"></div>
            <div className="offcanvas-menu-wrapper text-white" style={{ backgroundColor: "black" }}>
                <div className="canvas-close">
                    <i className="fa fa-close"></i>
                </div>

                <nav className="canvas-menu mobile-menu">
                    <ul>
                        <li className="active"><Link to={"/Gym"}>Home</Link></li>
                        <li><Link to={"/RegisterIntoJim"}>Register into Gym</Link></li>
                        <li><Link to={'Contact-us'}>Contact Us</Link></li>
                    </ul>
                </nav>
                <div id="mobile-menu-wrap"></div>
                <div className="canvas-social">
                    <a href="#" className="primary-btn text-white" style={{ borderRadius: "24px", backgroundColor: "#161C27" }}>Register as a
                        Gym</a>

                    <a href="#" className="primary-btn text-white mt-2" style={{ borderRadius: "24px" }}>Login</a>
                </div>
            </div>

        </>
    )
}

export default Header
