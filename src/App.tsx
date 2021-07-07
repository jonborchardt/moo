import * as React from "react";
import { createGlobalStyle } from "styled-components";
import { Provider } from "react-redux";

import { store } from "./store/store";
import { Board } from "./Board";
import { hydrateAll } from "./store/cards2";

import "antd/dist/antd.css";

const GlobalStyle = createGlobalStyle`
  body {
   background: rgb(1, 38, 52);
  }
`;

export const App = () => {
  // todo: remove
  hydrateAll();

  return (
    <Provider store={store}>
      <GlobalStyle />
      <Board />
    </Provider>
  );
};
