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
import { Transaction, TransactionParams } from "../../app/models/Transaction";
  
  interface TransactionState {
    transaction: Transaction | null;
    transactionLoaded: boolean;
    transactionParams: TransactionParams;
    metaData: MetaData | null;
  }
  
  const transactionsAdapter = createEntityAdapter<Transaction>();
  
  function getAxiosParams(transactionParams: TransactionParams) {
    const params = new URLSearchParams();
    params.append("pageNumber", transactionParams.pageNumber.toString());
    params.append("pageSize", transactionParams.pageSize.toString());
    return params;
  }
  
  export const getTransactionsAsync = createAsyncThunk<
    Transaction[],
    void,
    { state: RootState }
  >("transaction/getTransactionsAsync", async (_, ThunkAPI) => {
    const params = getAxiosParams(
      ThunkAPI.getState().transaction.transactionParams
    );
    try {
      const response = await agent.Transaction.list(params);
      debugger;
      ThunkAPI.dispatch(setMetaData(response.metaData));
      return response.items;
    } catch (error: any) {
      return ThunkAPI.rejectWithValue({ error: error.data });
    }
  });
  
  export const updateStatusTransactionAsync = createAsyncThunk<
    Transaction,
    FieldValues
  >("transaction/updateStatusTransactionAsync", async (data, ThunkAPI) => {
    try {
      const response = await agent.Transaction.updateStatusTransaction(data.id, data);
      return response;
    } catch (error: any) {
      return ThunkAPI.rejectWithValue({ error: error.data });
    }
  });
  
  function initParams() {
    return {
      pageNumber: 1,
      pageSize: 5,
    };
  }
  
  export const TransactionSlice = createSlice({
    name: "transaction",
    initialState: transactionsAdapter.getInitialState<TransactionState>({
      transaction: null,
      transactionLoaded: false,
      transactionParams: initParams(),
      metaData: null,
    }),
    reducers: {
      setTransactionParams: (state, action) => {
        state.transactionParams = {
          ...state.transactionParams,
          ...action.payload,
        };
      },
  
      resetTransactionParams: (state) => {
        state.transactionParams = initParams();
      },
      setMetaData: (state, action) => {
        state.metaData = action.payload;
      },
  
      setPageNumber: (state, action) => {
        state.transactionLoaded = false;
        state.transactionParams = {
          ...state.transactionParams,
          ...action.payload,
        };
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(getTransactionsAsync.fulfilled, (state, action) => {
          debugger;
          transactionsAdapter.setAll(state, action.payload);
          state.transactionLoaded = false;
        })
        .addCase(getTransactionsAsync.pending, (state, action) => {
          state.transactionLoaded = true;
        })
        .addCase(getTransactionsAsync.rejected, (state, action) => {
          console.log("Get Transaction rejected: ", action);
          state.transactionLoaded = false;
        });
  
      builder.addCase(updateStatusTransactionAsync.fulfilled, (state, action) => {
        toast.success("Update Transaction successfully!");
        transactionsAdapter.upsertOne(state, action.payload);
      });
     
    },
  });
  
  export const transactionSelectors = transactionsAdapter.getSelectors(
    (state: RootState) => state.transaction
  );
  
  export const {
    setTransactionParams,
    resetTransactionParams,
    setMetaData,
    setPageNumber,
  } = TransactionSlice.actions;
  