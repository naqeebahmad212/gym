import React from 'react';
import { Hourglass, MutatingDots, RotatingLines } from 'react-loader-spinner';

export const Spinner = () => {
    return (
        <div className='spinner-container'>
            <MutatingDots
                visible={true}
                height="100"
                width="100"
                color="#5951FF"
                secondaryColor="#5951FF"
                radius="12.5"
                ariaLabel="mutating-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    );
};

export const Rotating = () => {
    return (
        <RotatingLines
            visible={true}
            height="96"
            width="96"
            color="white"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}}
            wrapperClass=""
        />
    );
};


const Loading = ({ isLoading }) => {
    return (
        <div className={`loading ${isLoading ? 'show' : ''}`}>
            <Hourglass
                visible={true}
                height="80"
                width="80"
                ariaLabel="hourglass-loading"
                wrapperStyle={{}}
                wrapperClass=""
                colors={['#306cce', '#72a1ed']}
            />
        </div>
    );
};


export const showLoading = () => {
    return (<Loading isLoading={true} />)
}

export const hideLoading=()=>{
    return (<Loading isLoading={false} />)
}