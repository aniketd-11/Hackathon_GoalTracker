/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import trackerDetailsInfoReducer from "./slices/trackerDetailsSlice";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";

import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// Creates a fallback storage mechanism for server-side rendering
const createNoopStorage = () => {
  return {
    getItem(_key: string): Promise<null> {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string): Promise<string> {
      return Promise.resolve(value);
    },
    removeItem(_key: string): Promise<void> {
      return Promise.resolve();
    },
  };
};

// Selects the appropriate storage based on the environment (client or server)
const storage =
  typeof window === "undefined"
    ? createNoopStorage() // For server-side rendering, uses a no-op storage
    : createWebStorage("local"); // For client-side, uses the local storage

// Configuration object for redux-persist
const persistConfig = {
  key: "root", // Root key for the persisted state
  version: 1, // Version for potential migrations in the future
  storage: storage, // Defines the storage mechanism to use
};

// Combines individual reducers into a single root reducer
const reducer = combineReducers({
  auth: authReducer,
  trackerDetails: trackerDetailsInfoReducer,
});

// Persists the root reducer with the defined persist configuration
const persistedReducer = persistReducer(persistConfig, reducer);

// Configures the Redux store with the persisted reducer and middleware settings
const store = configureStore({
  reducer: persistedReducer, // Uses the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Exports the configured Redux store
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
