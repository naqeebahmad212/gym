import React from 'react';
import heroImage from '../assets/img/hero/hero-1.jpg';

const Hero = () => {

    return (
        <section className="hero-section">
            <div className="hs-slider">
                <div className="hs-item set-bg" style={{ backgroundImage: `url(${heroImage})` }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="hi-text">
                                    <h1 style={{ fontSize: '44px', lineHeight: '66px' ,opacity:1,top:0 }}>Transform Your <strong>Fitness Journey</strong> with Our Premier <strong>Gym Network</strong> </h1>
                                    <p className="text-white">Discover, Connect, and Achieve Your Fitness Goals with Ease Through Our Comprehensive Gym Network and User-Friendly Platform</p>
                                    <a href="#" className="primary-btn" style={{ borderRadius: '24px' }}>Register</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
