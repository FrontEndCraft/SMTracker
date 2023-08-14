/** @format */

import React from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";

const Loader = () => {
  const override = css`
    display: flex;
    justify-content: center;
    border-color: #6460d1;
    margin-top: 20px;
    margin-borrom: 20px;
    height: 70vh;
  `;
  return <BeatLoader css={override} size={10} color={"#6460d1"} />;
};

export default Loader;
