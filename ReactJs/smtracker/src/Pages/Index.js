
/** @format */

import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import SideBar from "../Components/SideBar";
import CryptoConverter from "../Components/CryptoConverter";
import Loader from "../Components/Loader";
import MajorGainer from "../Components/MajorGainer";
import MajorLoser from "../Components/MajorLoser";
import CurrencyConverter from "../Components/CurrencyConverter";
import circleGiff from "../assets/images/circle.gif"
import axios from "axios";
import swal from 'sweetalert';

const Index = () => {
    const [loading, setLoading] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [isAutoOpen, setIsAutoOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const toggleAutoModal = () => {
        setIsAutoOpen(!isAutoOpen);
        // Set a timeout to close the modal after 5 seconds
        if (!isAutoOpen) {
            setTimeout(() => {
                setIsAutoOpen(false);
            }, 5000);
        }
    };

    const handleButtonClick = async () => {
        setLoading(true)
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            const ipAddress = response.data.ip;
            showIPAddress(ipAddress);
            setLoading(false)
            setIsOpen(false)

        } catch (error) {
            console.error('Error fetching IP address:', error);
        }
    };
    const showIPAddress = (ipAddress) => {
        swal('Your IP Address', ipAddress, 'success');
    };

    return (
        <>
            <div className="app-wrap">
                <Header />
                <div className="app-container">
                <SideBar />
                <div className="app-main" id="main">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-12 m-b-30">
                                    <div className="d-block d-sm-flex flex-nowrap align-items-center">
                                        <div className="page-title mb-2 mb-sm-0">
                                            <h1>Stock Tracker and Currency Converter Dashboard</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <CryptoConverter />

                            <MajorGainer />

                             <MajorLoser />


                           <CurrencyConverter />

                            <div className="row sweet-wrapper">
                                <div className="col-md-6 mb-30">
                                    <div className="card card-statistics mb-30">
                                        <div className="card-body">
                                            <h5 className="card-title">Auto Close Timer</h5>
                                            <button onClick={toggleAutoModal} className="btn btn-primary"
                                                    aria-label="Try me! Example: A message with auto close timer">Try
                                                me!
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-30">
                                    <div className="card card-statistics">
                                        <div className="card-body">
                                            <h5 className="card-title"> Public IP Request </h5>
                                            <button onClick={toggleModal} className="btn btn-primary"
                                                    aria-label="Try me! Example: Dynamic queue">
                                                {loading ? <Loader /> : 'Fetch IP'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div>
                        {isAutoOpen && (
                            <div className="modals">
                                <div className="modals-content">

                                    <h3>Auto Close Alert !</h3>
                                    <p className='mt-2'>I will close in 5 seconds</p>

                                            <img style={{width: '60px', height:'60px', marginTop:'15px'}} src={circleGiff} />

                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        {isOpen && (
                            <div className="modals">
                                <div className="modals-content">
                                    <h3>Your Public IP</h3>
                                    <p>
                                        {
                                            loading &&
                                            <img style={{width: '60px', height:'60px'}} src={circleGiff} />
                                        }
                                    </p>
                                    <button onClick={handleButtonClick} className="btn btn-success mt-3"
                                            aria-label="Show My Public IP">
                                        { 'Show My Public IP'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Index;