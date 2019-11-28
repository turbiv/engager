import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Main from "./Main";
import store from "./store/configureStore";
import { SnackbarProvider } from "notistack";

ReactDOM.render(
  <Provider store={store}>
    <SnackbarProvider maxSnack={1}>
      <Main />
    </SnackbarProvider>
  </Provider>,
  document.getElementById("root")
);
