"use client";

import { Provider } from "react-redux";
import store from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import React, { ReactNode } from "react";

type ReduxProviderType = {
  children: ReactNode;
};

function ReduxProvider({ children }: ReduxProviderType) {
  const persistor = persistStore(store); // Create a persistor by wrapping the Redux store with redux-persist

  return (
    <Provider store={store}>
      {children}
      <PersistGate persistor={persistor}> </PersistGate>{" "}
    </Provider>
  );
}

export default ReduxProvider;
