import React from 'react'
import webpreview from "../assets/img/webprev.png"


const Feature = () => {
  return (
    <div>
    <section className="classes-section spad">
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <div className="section-title">
                        <h2 style={{fontSize: "32px"}}><strong>Features</strong> We Provide</h2>
                        <p>Vorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                            ut<br /> labVveniam, quis nostrud exercitation ullamco laboris nisi ut aliquip</p>
                    </div>
                </div>
            </div>
            <div className="row mb-5">
                <div className="col-lg-5 titleheading mt-4">
                    <h2>
                        <strong>Gym</strong> Management
                    </h2><br />
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                        rLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco labon
                        Read More...
                    </p>
                    <a href="#" className="primary-btn" style={{"borderRadius": "24px"}}>learn more</a>

                </div>
                <div className="col-lg-7">
                    <img src={webpreview} alt="" />
                </div>
            </div>
            <div className="row">

                <div className="col-lg-7">
                    <img src={webpreview} alt="" />
                </div>
                <div className="col-lg-5 titleheading mt-4">
                    <h2>
                        <strong>Our</strong> vision
                    </h2><br />
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                        rLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco labon
                        Read More...
                    </p>
                    <a href="#" className="primary-btn" style={{"borderRadius": "24px"}}>learn more</a>

                </div>
            </div>
        </div>
    </section>
</div>
  )
}

export default Feature
