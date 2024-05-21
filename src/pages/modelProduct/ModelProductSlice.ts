import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store/ConfigureStore";
import agent from "../../app/api/agent";
import { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import { MetaData } from "../../app/models/Pagination";
import { ModelProduct, ModelProductParams } from "../../app/models/ModelProduct";

interface ModelProductState {
  modelProduct: ModelProduct | null;
  modelProductLoaded: boolean;
  modelProductParams: ModelProductParams;
  metaData: MetaData | null;
}

const modelProductsAdapter = createEntityAdapter<ModelProduct>();

function getAxiosParams(modelProductParams: ModelProductParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", modelProductParams.pageNumber.toString());
  params.append("pageSize", modelProductParams.pageSize.toString());
  return params;
}

export const getModelProductsAsync = createAsyncThunk<
  ModelProduct[],
  void,
  { state: RootState }
>("modelProduct/getModelProductsAsync", async (_, ThunkAPI) => {
  const params = getAxiosParams(
    ThunkAPI.getState().modelProduct.modelProductParams
  );
  try {
    const response = await agent.ModelProduct.list(params);
    ThunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return ThunkAPI.rejectWithValue({ error: error.data });
  }
});

export const addModelProductAsync = createAsyncThunk<ModelProduct, FieldValues>(
  "modelProduct/addModelProductAsync",
  async (data, ThunkAPI) => {
    try {
      const response = await agent.ModelProduct.create(data);
      return response;
    } catch (error: any) {
      return ThunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const updateModelProductAsync = createAsyncThunk<
  ModelProduct,
  FieldValues
>("modelProduct/updateModelProductAsync", async (data, ThunkAPI) => {
  try {
    const response = await agent.ModelProduct.update(data.id, data);
    return response;
  } catch (error: any) {
    return ThunkAPI.rejectWithValue({ error: error.data });
  }
});

export const deleteModelProductAsync = createAsyncThunk(
  "modelProduct/deleteModelProductAsync",
  async (id: string) => {
    try {
      await agent.ModelProduct.delete(id);
      toast.success("Delete modelProduct successfully!");
      return id;
    } catch (error: any) {
      toast.error(error.data.message);
      throw error;
    }
  }
);

function initParams() {
  return {
    pageNumber: 1,
    pageSize: 5,
  };
}

export const ModelProductSlice = createSlice({
  name: "modelProduct",
  initialState: modelProductsAdapter.getInitialState<ModelProductState>({
    modelProduct: null,
    modelProductLoaded: false,
    modelProductParams: initParams(),
    metaData: null,
  }),
  reducers: {
    setModelProductParams: (state, action) => {
      state.modelProductParams = {
        ...state.modelProductParams,
        ...action.payload,
      };
    },

    resetModelProductParams: (state) => {
      state.modelProductParams = initParams();
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },

    setPageNumber: (state, action) => {
      state.modelProductLoaded = false;
      state.modelProductParams = {
        ...state.modelProductParams,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getModelProductsAsync.fulfilled, (state, action) => {
        modelProductsAdapter.setAll(state, action.payload);
        state.modelProductLoaded = false;
      })
      .addCase(getModelProductsAsync.pending, (state, action) => {
        state.modelProductLoaded = true;
      })
      .addCase(getModelProductsAsync.rejected, (state, action) => {
        console.log("Get ModelProduct rejected: ", action);
        state.modelProductLoaded = false;
      });

    builder.addCase(addModelProductAsync.fulfilled, (state, action) => {
      toast.success("Add ModelProduct successfully!");
      modelProductsAdapter.addOne(state, action.payload);
    });

    builder.addCase(updateModelProductAsync.fulfilled, (state, action) => {
      toast.success("Update ModelProduct successfully!");
      modelProductsAdapter.upsertOne(state, action.payload);
    });

    builder.addCase(deleteModelProductAsync.fulfilled, (state, action) => {
      modelProductsAdapter.removeOne(state, action.payload);
    });
  },
});

export const modelProductSelectors = modelProductsAdapter.getSelectors(
  (state: RootState) => state.modelProduct
);

export const {
  setModelProductParams,
  resetModelProductParams,
  setMetaData,
  setPageNumber,
} = ModelProductSlice.actions;
