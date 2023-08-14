
/** @format */

import React, { useEffect, useState } from "react";
import { companyC } from "../utils/dataObj";
import Select from "react-select";
import Plot from 'react-plotly.js'



const CryptoConverter = () => {
    const [stockChartXValues, setStockChartXValues] = useState([]);
    const [stockChartYValues, setStockChartYValues] = useState([]);
    const [timeDetail, setTimeDetail] = useState("TIME_SERIES_DAILY");
    const [historicalData, setHistoricalData] = useState([
        { label: "Weekly Chart", value: "TIME_SERIES_DAILY" },
        { label: "Monthly Chart", value: "TIME_SERIES_WEEKLY_ADJUSTED" },
    ]);

    const [currentComp, setCurrentComp] = useState("AAPL");
    const limit = 15;
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchStock();
    }, [currentComp, timeDetail]);

    const changeIt = (e) => {
        setTimeDetail(e.value);
    };

    const changeCompnay = (e) => {
        setCurrentComp(e.value);
    };

    const fetchStock = () => {
        const API_KEY = "DOSWKD9L3URZ6BUR";
        const headerAP = headerAPIFromTimeDetail(timeDetail);
        const API_Call = `https://www.alphavantage.co/query?function=${timeDetail}&symbol=${currentComp}&apikey=${API_KEY}`;
        const stockChartXValuesFunction = [];
        const stockChartYValuesFunction = [];

        fetch(API_Call)
            .then((response) => response.json())
            .then((data) => {
                for (let key in data[headerAP]) {
                    stockChartXValuesFunction.push(key);
                    stockChartYValuesFunction.push(data[headerAP][key]["1. open"]);
                }

                setStockChartXValues(stockChartXValuesFunction);
                setStockChartYValues(stockChartYValuesFunction);
            });
    };

    const handleSubmit = async (e) => {
        // const email = emaill;
        const company = currentComp;

        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:5000/opers/insertW/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // body: JSON.stringify({ email, company, timeDetail }),
            });

            if (response.ok) {
                alert("Data Added to WatchList");
                console.log("watchlist updated");
            } else {
                alert("Some Thing went Wrong!");
                console.error("Error ");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };
    const addToWatchList = (e) => {
        // if (isLoggedIn) {
        //     handleSubmit(e);
        // } else {
        //     alert("Login to add to watchList!");
        // }
    };

    const headerAPIFromTimeDetail = (timeDetail) => {
        if (timeDetail === "TIME_SERIES_WEEKLY_ADJUSTED") {
            return "Weekly Adjusted Time Series";
        } else if (timeDetail === "TIME_SERIES_DAILY") {
            return "Time Series (Daily)";
        } else {
            return "Monthly Time Series";
        }
    };
    return (
        <>
            <div className="row crypto-currency">
                <div className="col-12">
                    <div className="card card-statistics p-0 owl-wrapper">
                        <div className="row align-items-center no-gutters">
                            <div className="col-xs-11 text-center text-xxl-left bg-primary px-3 py-3"
                                 style={{textAlign: 'center'}}>
                                <span className="text-white">Stock Tracker and Currency Converter Dashboard</span>
                                <span className="badge badge-light-inverse ml-xxl-4">USD Pair</span>
                            </div>
                            <div className="col-xs-10 py-3 py-xs-0">
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="row">
                <div className="col-12 col-xxl-8 mb-30">
                    <div className="card card-statistics h-100 mb-0">
                        <div className="card-header d-flex justify-content-between">
                            <div className="card-heading">
                                <h4 className="card-title">Stock Overview - Select Stock to Track</h4>
                            </div>
                           <div className="d-block">
                             <div>
                                 <Select
                                     className="select-option wdth-400"
                                     value={companyC?.companyC?.find(
                                         (option) => option.value === currentComp
                                     )}
                                     options={companyC?.companyC}
                                     onChange={changeCompnay}
                                     placeholder="Select a stock"
                                     isSearchable
                                 />
                             </div>

                              <div className="mt-3">
                                  <Select
                                      className="select-option"
                                      value={historicalData.find(
                                          (option) => option.value === timeDetail
                                      )}
                                      options={historicalData}
                                      onChange={changeIt}
                                      placeholder="Select an interval"
                                      isSearchable
                                  />
                              </div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12">
                    <div className="card card-statistics">
                        <div className="card-header">
                            <div className="card-heading">
                                <h4 className="card-title">Stock Chart</h4>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="chart-container">
                                <Plot
                                    data = {[
                                        {
                                            x: stockChartXValues,
                                            y: stockChartYValues,
                                            type: 'scatter',
                                            mode: 'lines+markers',
                                            marker: {color: 'blue'},
                                        },
                                    ]}
                                    layouts={{
                                        width: '700px',
                                        height: 400,
                                        title: currentComp,
                                        margin: {
                                            l: 40,
                                            r: 40,
                                            t: 40,
                                            b: 40,
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default CryptoConverter;