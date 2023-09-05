import { configureStore } from "@reduxjs/toolkit";
import stateSlice from "./slice";

export const store = configureStore({
  reducer: {
    state: stateSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
