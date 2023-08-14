
/** @format */

import React, { useEffect, useState } from "react";

const Header = () => {

    return (
        <>
            <header className="app-header top-bar">
                <nav className="navbar navbar-expand-md">
                    <div className="navbar-header d-flex align-items-center">
                        <a href="#" className="mobile-toggle"><i
                            className="ti ti-align-right"></i></a>
                        <a className="navbar-brand" href="index.html">
                            <img src="assets/img/logo.png" className="img-fluid logo-desktop" alt="logo"/>
                            <img src="assets/img/logo.png" className="img-fluid logo-mobile" alt="logo"/>
                        </a>
                    </div>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <i className="ti ti-align-left"></i>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <div className="navigation d-flex">
                            <ul className="navbar-nav nav-left">
                                <li className="nav-item">
                                    <a href="#" className="nav-link sidebar-toggle">
                                        <i className="ti ti-align-right"></i>
                                    </a>
                                </li>
                                <li className="nav-item full-screen d-none d-lg-block" id="btnFullscreen">
                                    <a href="#" className="nav-link expand">
                                        <i className="icon-size-fullscreen"></i>
                                    </a>
                                </li>
                            </ul>
                            <ul className="navbar-nav nav-right ml-auto">
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Header;