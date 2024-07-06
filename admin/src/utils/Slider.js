import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faMapMarker,
  faFaceFrown
} from "@fortawesome/free-solid-svg-icons";
import "./styles.css";
import jimimage from "../assets/img/gym.png";
import { Link } from "react-router-dom";

const GymSlider = (props) => {
  const [activeSlide, setActiveSlide] = useState(props.activeSlide || 0);

  const next = () => {
    if (activeSlide < props?.data?.length - 1) {
      setActiveSlide(activeSlide + 1);
    }
  };

  const prev = () => {
    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    }
  };

  const getStyles = (index) => {
    const distance = index - activeSlide;
    const baseTranslateX = 240; // Adjust based on slide width
    const baseTranslateZ = -500; // Adjust based on desired depth
    const baseRotate = 35; // Adjust based on desired rotation

    let opacity = 0;
    let transform = `translateX(${distance * baseTranslateX}px) translateZ(${baseTranslateZ}px) rotateY(${(distance * baseRotate) / 3}deg)`;

    if (Math.abs(distance) === 0) {
      opacity = 1;
      transform = `translateX(0px) translateZ(0px) rotateY(0deg)`;
    } else if (Math.abs(distance) === 1) {
      opacity = 0.8;
      transform = `translateX(${(distance * baseTranslateX) * 1.2}px) translateZ(${baseTranslateZ}px) rotateY(${(distance * baseRotate) / 3}deg)`;
    } else if (Math.abs(distance) === 2) {
      opacity = 0.6;
      transform = `translateX(${(distance * baseTranslateX) * 1.2}px) translateZ(${baseTranslateZ}px) rotateY(${(distance * baseRotate) / 3}deg)`;
    }

    return {
      opacity,
      transform,
      zIndex: 10 - Math.abs(distance)
    };
  };

  const renderSlides = () => {
    const startIndex = Math.max(0, activeSlide - 2);
    const endIndex = Math.min(props?.data?.length - 1, activeSlide + 2);
    if (props.data && props?.data?.length) {
      return props.data.map((item, i) => {
        if (i >= startIndex && i <= endIndex) {
          return (
            <div key={item.id} className="gymcards slide" style={getStyles(i)}>
              <div className="card mx-30">
                <img
                  src={item?.images?.length ? item?.images[0] : jimimage}
                  className="card-img-top center-img"
                  alt="Gym"
                />
                <div className="card-body">
                  <h5 className="card-title text-white">{item.name}</h5>
                  <p className="text-white">
                    <i><FontAwesomeIcon icon={faMapMarker} /></i> {item.adress}
                  </p>
                  <Link to={`/Details?id=${item._id.toString()}`} type="button" className="btn btn-primary text-white">Register Now</Link>
                </div>
              </div>
            </div>
          );
        } else {
          return null; // Render null for items outside the visible range
        }
      });
    } else {
      return (
        <div className="gymcards slide" >
          <div className="card mx-3">
            <div className="card-body">
              <i className="w-100 d-flex justify-content-center mb-4"><FontAwesomeIcon icon={faFaceFrown} style={{
                color: "white",
                fontSize: "50px",
              }} /></i>
              <h5 className="card-title text-white">No available Gym's to Show</h5>
              <h6 className="text-white">
              </h6>
              <br />
              <a href="#"></a>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="container mt-5">
      <div className="slideC mx-auto">{renderSlides()}</div>

      <div className="btns" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <FontAwesomeIcon
          className="btn"
          style={{ color: "white" }}
          onClick={prev}
          icon={faChevronLeft}
          size="2x"
        />
        <FontAwesomeIcon
          className="btn"
          onClick={next}
          style={{ color: "white" }}
          icon={faChevronRight}
          size="2x"
        />
      </div>
    </div>
  );
};

export default GymSlider;


