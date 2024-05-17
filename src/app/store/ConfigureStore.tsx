import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { BrandSlice } from "../../pages/brand/BrandSlice";
import { AccountSlice } from "../../pages/account/AccountSlice";
import { ModelVehicleSlice } from "../../pages/modelVehicle/ModelVehicleSlice";
import { VehicleSlice } from "../../pages/products/VehicleSlice";
import { ColorSlice } from "../../pages/color/ColorSlice";
import { FilterSlice } from "../../pages/filter/FilterSlice";
import { DashboardSlice } from "../../pages/dashboard/DashboardSlice";

export const store = configureStore({
  reducer: {
    brand: BrandSlice.reducer,
    account: AccountSlice.reducer,
    modelProduct: ModelVehicleSlice.reducer,
    vehicle: VehicleSlice.reducer,
    color: ColorSlice.reducer,
    dashboard: DashboardSlice.reducer,
    filter: FilterSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
