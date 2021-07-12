import * as React from "react";
import { createGlobalStyle } from "styled-components";
import { Provider } from "react-redux";

import { store } from "./store/store";
import { Board } from "./Board";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: rgb(1, 38, 52);
  }
`;

export const App = () => {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <Board />
    </Provider>
  );
};
