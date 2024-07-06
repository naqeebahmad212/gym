import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import ReactSwiper from '../components/ReactSwiper';
import { App_host } from '../utils/hostData';

const GymDetail = () => {
    const [jimDetail, setJimDetail] = useState({});
    const [Preview, setPreview] = useState("");
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    useEffect(() => {
        getJimDetails();
    }, [id]);

    const getJimDetails = async () => {
        try {
            const response = await axios.get(`${App_host}/Jim/getOneLocation?id=${id}`);
            setJimDetail(response.data.data);
            setPreview(jimDetail?.images[0]);
        } catch (error) {
            console.error("Error fetching gym data:", error);
        }
    };

    return (
        <>
            <section className="classes-section spad">
                <div className="container">
                    <div className="row  h-100 mt-5">
                        <div className="col-lg-6 h-100">
                         <ReactSwiper images={jimDetail.images} />
                        </div>
                        <div className="col-lg-6 titleheading mt-4">
                            <div className="centered-text">
                                {jimDetail && (
                                    <>
                                        <h2>{jimDetail.name}</h2>
                                        <p>{jimDetail.description}</p>
                                        <Link to={`/RegisterIntoJim?id=${jimDetail._id?.toString()}&image=${Preview}`} type="button" className="btn btn-primary" >Register Now</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default GymDetail;
