/** @format */

import React, { useState, useEffect } from "react";
// import Datatable from "./Datatable";

import DataTableExtensions from "react-data-table-component-extensions";
import DataTable from "react-data-table-component";
import 'react-data-table-component-extensions/dist/index.css';
import {Bar} from "react-chartjs-2";

const MajorGainer = () => {
    const [perPage, setPerPage] = useState(10)
    const [gainers, setGainers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [columns, setColumns] = useState([
        {
            name: 'Symbol',
            selector: 'symbol',
            sortable: true,
        },
        {
            name: 'Name',
            selector: 'name',
            sortable: true,
        },
        {
            name: 'Price',
            selector: 'price',
            sortable: true,
        },
        {
            name: 'Change',
            selector: 'change',
            sortable: true,
        }
    ])


    const handlePerRowsChanges = (perPage) => {
        setPerPage(perPage);
        // onPageChange(perPage); // Calling the function passed from the parent with the new page value

    }

    useEffect(() => {
        const fetchGainers = async () => {
            try {
                const gainerAPI = "be86972b1310bc955a9017b37c8bee78";
                const url = `https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${gainerAPI}`;
                const response = await fetch(url);
                const data = await response.json();
                setGainers(data);
            } catch (error) {
                console.error("Error fetching gainers:", error);
            }
        };

        fetchGainers();
    }, []);





    const stockSymbolGainers = gainers?.slice(0, perPage).map((stock) => stock.symbol);
    const stockChangeGainers = gainers?.slice(0, perPage).map((stock) => stock.changesPercentage);

    const colors = [
        'rgba(0, 128, 0, 1)',
        'rgba(255, 99, 71, 0.8)',
        'rgba(255, 0, 0, 1)',
        'rgba(128, 0, 128, 1)',
        'rgba(0, 0, 0, 1)',
        'rgba(54, 162, 235, 0.6)',
        // Add more colors as needed
    ];

    const chartDataGainer = {
        labels: stockSymbolGainers,
        datasets: [
            {
                label: 'Changes Percentage',
                data: stockChangeGainers,
                backgroundColor: colors, // Use the array of colors here
                borderWidth: 1,
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

    const data = gainers?.slice(0, perPage);
    const totalRows = gainers?.length
    const tableData = { columns, data };
  return (
      <div className="row">
          <div className="col-lg-6">
              <div className="card card-statistics">
                  <div>
                      <div className="card-heading">
                          <h4 className="card-title">Top Gainers</h4>
                      </div>
                      <div className="justifycontent-center mt-4">
                          <div className="col-12">
                              <div className="py-1 mt-3 table-container shadowsm">
                                  <DataTableExtensions {...tableData}>
                                      <DataTable
                                          columns={columns}
                                          data={data}
                                          noHeader
                                          defaultSortAsc={false}
                                          highlightOnHover
                                          pagination={true}
                                          paginationServer={true}
                                          paginationResetDefaultPage={true}
                                          paginationPerPage={perPage}
                                          paginationTotalRows={totalRows}
                                          paginationRowsPerPageOptions={[2, 4, 8, 16, 32, 64]}
                                          onChangeRowsPerPage={handlePerRowsChanges}
                                          style={{ cursor: "pointer" }}
                                      />
                                  </DataTableExtensions>
                              </div>
                          </div>
                      </div>                  </div>
              </div>
          </div>
          <div className="col-lg-6">
              <div className="card card-statistics" id="majorGainersContainer">
                  <div className="card-header">
                      <div className="card-heading">
                          <h4 className="card-title">Major Gainers Chart</h4>
                      </div>
                  </div>
                  <div className="card-body">
                      return <Bar data={chartDataGainer} options={chartOptions} />;
                  </div>
              </div>
          </div>
      </div>

  );
};

export default MajorGainer;
