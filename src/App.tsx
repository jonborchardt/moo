import * as React from "react";
import { createGlobalStyle } from "styled-components";

import { Board } from "./Board";

import "antd/dist/antd.css";

const GlobalStyle = createGlobalStyle`
  body {
   background: rgb(1, 38, 52);
  }
`;

export const App = () => {
  return (
    <>
      <GlobalStyle />
      <Board />
    </>
  );
};
