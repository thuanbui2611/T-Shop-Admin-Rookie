import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { ModelProductSlice } from "../../pages/modelProduct/ModelProductSlice";
import { ColorSlice } from "../../pages/color/ColorSlice";
import { TypeSlice } from "../../pages/type/TypeSlice";
import { AccountSlice } from "../../pages/account/AccountSlice";
import { FilterSlice } from "../../pages/filter/FilterSlice";
import { BrandSlice } from "../../pages/brand/BrandSlice";
import { ProductSlice } from "../../pages/product/ProductSlice";
import { TransactionSlice } from "../../pages/transaction/TransactionSlice";
import { UserSlice } from "../../pages/user/UserSlice";

export const store = configureStore({
  reducer: {
    account: AccountSlice.reducer,
    modelProduct: ModelProductSlice.reducer,
    color: ColorSlice.reducer,
    type: TypeSlice.reducer,
    brand: BrandSlice.reducer,
    product: ProductSlice.reducer,
    filter: FilterSlice.reducer,
    transaction: TransactionSlice.reducer,
    user: UserSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
