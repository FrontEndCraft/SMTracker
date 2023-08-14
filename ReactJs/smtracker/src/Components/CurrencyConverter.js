
/** @format */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import Multiselect from 'multiselect-react-dropdown';
Chart.register(...registerables);

const CurrencyConverter = () => {
    const [exchangeRates, setExchangeRates] = useState({});
    const [sourceCurrency, setSourceCurrency] = useState("");
    const [targetCurrency, setTargetCurrency] = useState("");
    const [amount, setAmount] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchExchangeRates();
    }, []);

    const fetchExchangeRates = async () => {
        const apiKey = '5d8b9157d1c096dd9eb5449d';
        const baseCurrency = 'USD';
        try {
            const response = await axios.get(
                `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`
            );
            const { conversion_rates } = response.data;
            setExchangeRates(conversion_rates);
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
        }
    };

    const handleCurrencyConversion = async (e) => {
        e.preventDefault();
        setLoading(true);
        const apiKey = '5d8b9157d1c096dd9eb5449d';
        try {
            const response = await axios.get(
                `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${sourceCurrency}`
            );
            const { conversion_rates } = response.data;
            const conversionRate = conversion_rates[targetCurrency];
            setResult((parseFloat(amount) * conversionRate).toFixed(2));
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error converting currency:", error);
        }
    };

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [updateClick, setUpdateClick] = useState(false);



    const options = Object.entries(exchangeRates).map(([currency, rate]) => ({
        key: currency,
        value: rate,
    }));

    const onSelect = (selectedList, selectedItem) => {
        setSelectedOptions(selectedList);
    };

    const onRemove = (selectedList, removedItem) => {
        setSelectedOptions(selectedList);
    };


    const colors = [
        'rgba(0, 128, 0, 1)',
        'rgba(255, 99, 71, 0.8)',
        'rgba(255, 0, 0, 1)',
        'rgba(128, 0, 128, 1)',
        'rgba(0, 0, 0, 1)',
        'rgba(54, 162, 235, 0.6)',
        // Add more colors as needed
    ];


    const chartDataMultiSelect = {
        labels: updateClick && selectedOptions.map(option => option.key),
        datasets: [
            {
                label: 'Exchange Rates',
                backgroundColor: colors,
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,192,192,0.8)',
                hoverBorderColor: 'rgba(75,192,192,1)',
                data: updateClick && selectedOptions.map(option => option.value),
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };
    return (
        <>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card card-statistics">
                        <div className="card-header">
                            <div className="card-heading">
                                <h4 className="card-title" style={{textAlign:'center'}}>Currency
                                    Converter</h4>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">
                                <div className="card card-statistics mail-contant">
                                    <div className="card-body p-0">
                                        <form
                                            onSubmit={handleCurrencyConversion}
                                        >
                                            <div className="row no-gutters">
                                                <div className="col-md-3 col-xxl-2 col-md-3">
                                                    <div className="mail-sidebar">
                                                        <div className="row justify-content-center">
                                                            <div className="col-12">
                                                                <div
                                                                    className="text-center mail-sidebar-title px-4">
                                                                    Source Currency<i
                                                                    className="fa fa-money pl-2"></i>
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="px-4 py-4">
                                                                    <div
                                                                        className="card card-statistics h-100 mb-0 o-hidden">

                                                                        <select
                                                                            className="form-control form-border form-search mr-2 mb-3 mb-md-0"
                                                                            value={sourceCurrency}
                                                                            onChange={(e) => setSourceCurrency(e.target.value)}
                                                                        >
                                                                            <option value="">Select currency</option>
                                                                            {Object.keys(exchangeRates).map((currency) => (
                                                                                <option key={currency} value={currency}>
                                                                                    {currency}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-xxl-2 col-md-3">
                                                    <div className="mail-sidebar">
                                                        <div className="row justify-content-center">
                                                            <div className="col-12">
                                                                <div
                                                                    className="text-center mail-sidebar-title px-4">
                                                                    Amount <i
                                                                    className="fa fa-money pl-2"></i>
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="px-4 py-4">
                                                                    <form>
                                                                        <div className="form-group">
                                                                            <input
                                                                                className="form-control"
                                                                                id="amount" min="0"
                                                                                step="0.01"
                                                                                type="number"
                                                                                value={amount}
                                                                                onChange={(e) => setAmount(e.target.value)}
                                                                                placeholder="Enter Amount" />
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-xxl-2 col-md-3">
                                                    <div className="mail-sidebar">
                                                        <div className="row justify-content-center">
                                                            <div className="col-12">
                                                                <div
                                                                    className="text-center mail-sidebar-title px-4">
                                                                    Target Currency <i
                                                                    className="fa fa-money pl-2"></i>
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="px-4 py-4">
                                                                    <div
                                                                        className="card card-statistics h-100 mb-0 o-hidden">
                                                                        <select
                                                                            className="form-control form-border form-search mr-2 mb-3 mb-md-0"
                                                                            value={targetCurrency}
                                                                            onChange={(e) => setTargetCurrency(e.target.value)}
                                                                        >
                                                                            <option value="">Select currency</option>
                                                                            {Object.keys(exchangeRates).map((currency) => (
                                                                                <option key={currency} value={currency}>
                                                                                    {currency}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-xxl-2 col-md-3">
                                                    <div className="mail-sidebar">
                                                        <div className="row justify-content-center">
                                                            <div className="col-12">
                                                                <div className="px-4 py-4"
                                                                     style={{textAlign:'center', marginTop:'30px'}}>
                                                                    <button type='submit'
                                                                            className="btn btn-primary">Convert
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-xxl-2 col-md-3">
                                                    <div className="mail-sidebar">
                                                        <div className="row justify-content-center">
                                                            <div className="col-12">
                                                                <div
                                                                    className="text-center mail-sidebar-title px-4">
                                                                    Amount<i
                                                                    className="fa fa-money pl-2"></i>
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="px-4 py-4">
                                                                    <div
                                                                        className="card card-statistics h-100 m-b-0">
                                                                        <div
                                                                            className="card-header bg-gradient">
                                                                            <div
                                                                                className="row align-items-center"
                                                                                style={{justifyContent:'center'}}>
                                                                                <p
                                                                                    style={{color:'white'}}>                       {result} {targetCurrency}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="row">
                <div className="col-xxl-4 m-b-30">
                    <div className="card card-statistics h-100 mb-0">
                        <div className="card-header d-flex align-items-center justify-content-between">
                            <div className="card-heading">
                                <h4 className="card-title">Live USD Currency Pairs Table</h4>
                            </div>
                        </div>
                        <div className="card-body scrollbar scroll_dark pt-0"
                             style={{maxHeight:'350px'}}>
                            <div className="datatable-wrapper table-responsive">
                                <table id="export-table" className="table table-bordered">
                                    <thead className="thead-light">
                                    <tr>
                                        <th>Currency Pair</th>
                                        <th>Exchange Rate</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Object.entries(exchangeRates).map(([currency, rate]) => (
                                        <tr key={currency}>
                                            <td>{`USD/${currency}`}</td>
                                            <td>{rate.toFixed(4)}</td>
                                        </tr>
                                    ))}

                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-8 m-b-30">
                    <div className="card card-statistics">
                        <div className="card-header">
                            <div className="card-heading">
                                <h4 className="card-title">USD Currency Pairs Exchange Rates</h4>
                            </div>
                        </div>
                        <div className="card-body">
                            <label htmlFor="currencyPairSelect">Select up to 15 Currency
                                Pairs: </label>
                            <div className="d-flex">

                                <Multiselect
                                    options={options}
                                    displayValue="value"
                                    onSelect={onSelect}
                                    onRemove={onRemove}
                                    selectedValues={selectedOptions}
                                    placeholder="Select options"
                                />
                                <button className="btn btn-primary ml-3" onClick={() => setUpdateClick(true)}>Update Chart</button>
                            </div>
                            <div style={{width:'600px'}}>
                                return <Bar data={chartDataMultiSelect} options={chartOptions} />;
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default CurrencyConverter;