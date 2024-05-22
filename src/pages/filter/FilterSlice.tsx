import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Brand } from "../../app/models/Brand";
import { BrandOfModel, ModelProduct } from "../../app/models/ModelProduct";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import { Type } from "../../app/models/Type";
import { Color } from "../../app/models/Color";

interface FilterState {
  brands: Brand[];
  brandLoading: boolean;
  types: Type[];
  typeLoading: boolean;
  colors: Color[];
  colorLoading: boolean;
  models: ModelProduct[];
  modelProductLoading: boolean;
}

const initialState: FilterState = {
  brands: [],
  brandLoading: false,
  types: [],
  typeLoading: false,
  colors: [],
  colorLoading: false,
  models: [],
  modelProductLoading: false,
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

export const getTypesAsync = createAsyncThunk<Type[]>(
  "filter/getTypesAsync",
  async (_, thunkAPI) => {
    try {
      const response = await agent.Type.all();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: (error as any).data });
    }
  }
);

export const getColorsAsync = createAsyncThunk<Color[]>(
  "filter/getColorsAsync",
  async (_, thunkAPI) => {
    try {
      const response = await agent.Color.all();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: (error as any).data });
    }
  }
);

export const getModelsAsync = createAsyncThunk<ModelProduct[]>(
  "filter/getModelsAsync",
  async (_, thunkAPI) => {
    try {
      const response = await agent.ModelProduct.all();
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
    //Brands
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
    //Types
    builder
      .addCase(getTypesAsync.pending, (state, action) => {
        state.typeLoading = true;
      })
      .addCase(getTypesAsync.fulfilled, (state, action) => {
        state.typeLoading = false;
        state.types = action.payload;
      })
      .addCase(getTypesAsync.rejected, (state, action) => {
        console.log("Get all types fail");
        toast.error("Get all type failed, please try again!");
      });
    //Colors
    builder
      .addCase(getColorsAsync.pending, (state, action) => {
        state.colorLoading = true;
      })
      .addCase(getColorsAsync.fulfilled, (state, action) => {
        state.colorLoading = false;
        state.colors = action.payload;
      })
      .addCase(getColorsAsync.rejected, (state, action) => {
        console.log("Get all colors fail");
        toast.error("Get all color failed, please try again!");
      });
    //Models
    builder
      .addCase(getModelsAsync.pending, (state, action) => {
        state.modelProductLoading = true;
      })
      .addCase(getModelsAsync.fulfilled, (state, action) => {
        state.modelProductLoading = false;
        state.models = action.payload;
      })
      .addCase(getModelsAsync.rejected, (state, action) => {
        console.log("Get all models fail");
        toast.error("Get all model failed, please try again!");
      });
  },
});

export const {} = FilterSlice.actions;
