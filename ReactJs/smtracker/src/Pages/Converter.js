
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

const Converter = () => {
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



                            <CurrencyConverter />

                          </div>


                    </div>
                </div>
            </div>
        </>
    );
};

export default Converter;