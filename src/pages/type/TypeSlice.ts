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
import { Type, TypeParams } from "../../app/models/Type";

interface TypeState {
  type: Type | null;
  typeLoaded: boolean;
  typeParams: TypeParams;
  metaData: MetaData | null;
}

const typesAdapter = createEntityAdapter<Type>();

function getAxiosParams(typeParams: TypeParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", typeParams.pageNumber.toString());
  params.append("pageSize", typeParams.pageSize.toString());
  return params;
}

export const getTypesAsync = createAsyncThunk<
  Type[],
  void,
  { state: RootState }
>("type/getTypesAsync", async (_, ThunkAPI) => {
  const params = getAxiosParams(
    ThunkAPI.getState().type.typeParams
  );
  try {
    const response = await agent.Type.list(params);
    ThunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return ThunkAPI.rejectWithValue({ error: error.data });
  }
});

export const addTypeAsync = createAsyncThunk<Type, FieldValues>(
  "type/addTypeAsync",
  async (data, ThunkAPI) => {
    try {
      const response = await agent.Type.create(data);
      return response;
    } catch (error: any) {
      return ThunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const updateTypeAsync = createAsyncThunk<
  Type,
  FieldValues
>("type/updateTypeAsync", async (data, ThunkAPI) => {
  try {
    const response = await agent.Type.update(data.id, data);
    return response;
  } catch (error: any) {
    return ThunkAPI.rejectWithValue({ error: error.data });
  }
});

export const deleteTypeAsync = createAsyncThunk(
  "type/deleteTypeAsync",
  async (id: string) => {
    try {
      await agent.Type.delete(id);
      toast.success("Delete type successfully!");
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

export const TypeSlice = createSlice({
  name: "type",
  initialState: typesAdapter.getInitialState<TypeState>({
    type: null,
    typeLoaded: false,
    typeParams: initParams(),
    metaData: null,
  }),
  reducers: {
    setTypeParams: (state, action) => {
      state.typeParams = {
        ...state.typeParams,
        ...action.payload,
      };
    },

    resetTypeParams: (state) => {
      state.typeParams = initParams();
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },

    setPageNumber: (state, action) => {
      state.typeLoaded = false;
      state.typeParams = {
        ...state.typeParams,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTypesAsync.fulfilled, (state, action) => {
        typesAdapter.setAll(state, action.payload);
        state.typeLoaded = false;
      })
      .addCase(getTypesAsync.pending, (state, action) => {
        state.typeLoaded = true;
      })
      .addCase(getTypesAsync.rejected, (state, action) => {
        console.log("Get Type rejected: ", action);
        state.typeLoaded = false;
      });

    builder.addCase(addTypeAsync.fulfilled, (state, action) => {
      toast.success("Add Type successfully!");
      typesAdapter.addOne(state, action.payload);
    });

    builder.addCase(updateTypeAsync.fulfilled, (state, action) => {
      toast.success("Update Type successfully!");
      typesAdapter.upsertOne(state, action.payload);
    });

    builder.addCase(deleteTypeAsync.fulfilled, (state, action) => {
      typesAdapter.removeOne(state, action.payload);
    });
  },
});

export const typeSelectors = typesAdapter.getSelectors(
  (state: RootState) => state.type
);

export const {
  setTypeParams,
  resetTypeParams,
  setMetaData,
  setPageNumber,
} = TypeSlice.actions;
