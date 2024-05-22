import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { ModelProductSlice } from "../../pages/modelProduct/ModelProductSlice";
import { ColorSlice } from "../../pages/color/ColorSlice";
import { DashboardSlice } from "../../pages/dashboard/DashboardSlice";
import { TypeSlice } from "../../pages/type/TypeSlice";
import { AccountSlice } from "../../pages/account/AccountSlice";
import { FilterSlice } from "../../pages/filter/FilterSlice";

export const store = configureStore({
  reducer: {
    account: AccountSlice.reducer,
    modelProduct: ModelProductSlice.reducer,
    color: ColorSlice.reducer,
    dashboard: DashboardSlice.reducer,
    type: TypeSlice.reducer,
    filter: FilterSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
