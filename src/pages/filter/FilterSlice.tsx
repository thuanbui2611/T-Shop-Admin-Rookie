import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Brand } from "../../app/models/Brand";
import { BrandOfModel } from "../../app/models/ModelProduct";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";

interface FilterState {
  brands: Brand[];
  brandLoading: boolean;
}

const initialState: FilterState = {
  brands: [],
  brandLoading: false,
};

export const getBrandsAsync = createAsyncThunk<BrandOfModel[]>(
  "filter/getBrandsAsync",
  async (_, thunkAPI) => {
    try {
      const response = await agent.Brand.all();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: (error as any).data });
    }
  }
);

export const FilterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBrandsAsync.pending, (state, action) => {
        state.brandLoading = true;
      })
      .addCase(getBrandsAsync.fulfilled, (state, action) => {
        state.brandLoading = false;
        state.brands = action.payload;
      })
      .addCase(getBrandsAsync.rejected, (state, action) => {
        console.log("Get all brands fail");
        toast.error("Get all brand failed, please try again!");
      });
  },
});

export const {} = FilterSlice.actions;
