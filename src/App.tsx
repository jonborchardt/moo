import * as React from "react";
import { createGlobalStyle } from "styled-components";
import { Provider } from "react-redux";

import { Theme } from "./theme";
import { store } from "./store/store";
import { Board } from "./Board";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: ${Theme.palette.background.dark};
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
