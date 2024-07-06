import React, { useEffect, useState } from 'react'
import jimimage from "../assets/img/gym.png"
import Slider from "../utils/Slider";
import data from '../utils/data';
import axios from 'axios';
import { App_host } from '../utils/hostData';

const FindJim = () => {
    const [jim, setJim] = useState([]);

    useEffect(() => {
        const fetchJim = async () => {
            try {
                const response = await axios.get(`${App_host}/Jim/getAllBusinessLocation?page=1&limit=10`);
                setJim(response.data.data.results);
            } catch (error) {
                console.error("Error fetching gym data:", error);
            }
        };

        fetchJim(); // Call the fetch function inside useEffect
    }, []);

    return (
        <>
            <section className="choseus-section spad" 
            // style={{marginBottom:"35px"}}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title">
                                <h2> <strong>Find Gym</strong> for your Fitness</h2>
                                <p className="text-white">Vorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut <br />labVveniam, quis nostrud exercitation ullamco laboris nisi ut aliquip</p>
                            </div>
                        </div>
                    </div>

                    <div className="row overflowx" style={{overflowX:"hidden"}}>
                          <Slider data={jim} activeSlide={2} />
                    </div>
                </div>
            </section>
        </>
    )
}

export default FindJim
