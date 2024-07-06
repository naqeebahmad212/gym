import React, { useEffect, useState } from 'react';
import jimimg from '../assets/img/gym.png';
import breadcrup from "../assets/img/breadcrumb-bg.jpg";
import { Link } from 'react-router-dom';
import { faFaceFrown, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { App_host } from '../utils/hostData';

const Gym = () => {
    const [jim, setJim] = useState([]);
    const [totalPages, SetTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [nearby, setNearby] = useState(false);
    const itemsPerPage = 12;

    useEffect(() => {
        const fetchJim = async () => {
            try {
                const response = await axios.get(`${App_host}/Jim/getAllBusinessLocation?page=${currentPage}&limit=${itemsPerPage}&nearby=${nearby}`);
                setJim(response.data.data.results);
                SetTotalPages(response.data.data.totalPages);
            } catch (error) {
                console.error("Error fetching gym data:", error);
            }
        };

        fetchJim();
    }, [currentPage]); // Reload when currentPage changes

    // const totalPages = Math.ceil(jim.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCheckboxChange = (event) => {
        setNearby(event.target.checked);
    };

    return (
        <>
            <section className="breadcrumb-section set-bg"
                style={{
                    backgroundImage: `url(${breadcrup})`,
                    backgroundSize: "cover",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: "center"
                }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="breadcrumb-text">
                                <h2>Gyms</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </section> 
            {/* <section className="choseus-section spad" style={{ backgroundColor: "#0e0e0e" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title">
                                <h2> <strong>Find Gym</strong> for your Fitness</h2>
                                <p className="text-white">Vorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor incididunt ut <br />labVveniam, quis nostrud exercitation ullamco laboris nisi ut
                                    aliquip</p>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-end py-3">
                        <div class="custom-control custom-switch">
                            <input
                                type="checkbox"
                                class="custom-control-input"
                                id="customSwitch1"
                                onChange={handleCheckboxChange}
                                checked={nearby} />
                            <label class="custom-control-label text-white" for="customSwitch1">
                                Nearby Gyms
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        {jim.length > 0 ? (
                            jim.map((data, index) => (
                                <div key={index} className="col-lg-3 col-md-6 col-sm-6 gymcards">
                                    <div className="card mx-30">
                                        <img
                                            src={data.images.length ? data.images[0] : jimimg}
                                            className="card-img-top center-img"
                                            alt="Gym"
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title text-white">{data.name}</h5>
                                            <p className="text-white">
                                                <i><FontAwesomeIcon icon={faMapMarker} /></i> {data.adress}
                                            </p>
                                            <Link to={`/Details?id=${data._id.toString()}`} type="button" className="btn btn-primary text-white">Register Now</Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="w-100 d-flex justify-content-center">
                                <div className="gymcards d-flex justify-content-center">
                                    <div className="card mx-3">
                                        <div className="card-body">
                                            <i className="w-100 d-flex justify-content-center mb-4">
                                                <FontAwesomeIcon
                                                    icon={faFaceFrown}
                                                    style={{
                                                        color: 'white',
                                                        fontSize: '50px',
                                                    }}
                                                />
                                            </i>
                                            <h5 className="card-title text-white">No available Gyms to Show</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {totalPages > 1 && (
                        <div className="row mt-4">
                            <div className="col-lg-12 d-flex justify-content-center">
                                <nav aria-label="Page navigation example">
                                    <ul className="pagination">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </section> */}
        </>
    );
};

export default Gym;
