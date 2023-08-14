/** @format */

import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const Datatable = ({ data, columns }) => {


  const rows = data?.map((item, index) => ({ ...item, id: index + 1 }));
  // const rowss = Object?.entries(data?.rates).map(([currency, rate]) => ({
  //   id: currency,
  //   currency,
  //   exchangeRate: rate,
  // }));

  return (
      <div style={{ height: 'auto', width: "100%" }}>
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
                ...data.initialState,
                pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10, 25]}
        />

      </div>
  );
};

export default Datatable;