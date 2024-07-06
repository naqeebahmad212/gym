import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const ReactSwiper = ({ images }) => {
    return (
        <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        // scrollbar={{ draggable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
        >
            {images && images.length > 0 ? (
                images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img
                            className="d-block w-100 carousel-image curousalimage"
                            src={image}
                            alt={`Slide ${index + 1}`}
                        />
                    </SwiperSlide>
                ))
            ) : (
                <SwiperSlide>
                    <div>No available images to show</div>
                </SwiperSlide>
            )}
        </Swiper>
    );
};

export default ReactSwiper;
