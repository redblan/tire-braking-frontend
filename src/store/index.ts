import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "./authSlice";
import draftReducer from "./draftSlice";
import feedReducer from "./feedSlice";
import searchReducer from "./searchSlice";
import tireConditionsReducer from "./tireConditionsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tireConditions: tireConditionsReducer,
    feed: feedReducer,
    draft: draftReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
