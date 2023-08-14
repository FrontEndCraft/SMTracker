
/** @format */

import React, { useEffect, useState } from "react";

const SideBar = () => {

    return (
        <>
            <aside className="app-navbar">
                <div className="sidebar-nav scrollbar scroll_light">
                    <ul className="metismenu " id="sidebarNav">
                        &nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;
                        <li className="active">
                            <a href='/'>Overview</a>
                        </li>
                        <li className="">
                            <a href='/stock'>Stocks List</a>
                        </li>
                        <li className="">
                            <a href='/converter'>Currency Converter</a>
                        </li>
                        &nbsp;&nbsp;&nbsp;
                        <li className="sidebar-banner p-4 bg-gradient text-center m-3 d-block rounded">
                            <h5 className="text-white mb-1">SM Trackr</h5>
                            <p className="font-13 text-white line-20">Stock Tracker and Currency Converter Dashboard</p>
                            <a className="btn btn-square btn-inverse-light btn-xs d-inline-block mt-2 mb-0"
                               href="#"> Tracking Partner</a>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
};

export default SideBar;