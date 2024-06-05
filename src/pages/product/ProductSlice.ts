import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
  } from "@reduxjs/toolkit";
  import { MetaData } from "../../app/models/Pagination";
  import { Product, ProductParams } from "../../app/models/Product";
  import { RootState } from "../../app/store/ConfigureStore";
  import agent from "../../app/api/agent";
  import { FieldValues } from "react-hook-form";
  import { toast } from "react-toastify";
  
  interface ProductState {
    product: Product | null;
    productLoaded: boolean;
    productParams: ProductParams;
    metaData: MetaData | null;
  }
  
  const productsAdapter = createEntityAdapter<Product>();
  
  function getAxiosParams(productParams: ProductParams) {
    const params = new URLSearchParams();
    params.append("pageNumber", productParams.pageNumber.toString());
    params.append("pageSize", productParams.pageSize.toString());
    if (productParams.types && productParams.types!.length > 0) {
      productParams.types!.forEach((type) => {
        params.append("Types", type);
      });
    }
    if (productParams.brands && productParams.brands!.length > 0) {
      productParams.brands!.forEach((brand) => {
        params.append("Brands", brand);
      });
    }
    if (productParams.models && productParams.models!.length > 0) {
      productParams.models!.forEach((model) => {
        params.append("Models", model);
      });
    }
    if (productParams.colors && productParams.colors!.length > 0) {
      productParams.colors!.forEach((color) => {
        params.append("Colors", color);
      });
    }
    if (productParams.search) {
      params.append("Search", productParams.search);
    }
  
    return params;
  }
  
  export const getProductsAsync = createAsyncThunk<
    Product[],
    void,
    { state: RootState }
  >("product/getProductsAsync", async (_, ThunkAPI) => {
    const params = getAxiosParams(ThunkAPI.getState().product.productParams);
    try {
      const response = await agent.Product.list(params);
      ThunkAPI.dispatch(setMetaData(response.metaData));
      return response.items;
    } catch (error: any) {
      return ThunkAPI.rejectWithValue({ error: error.data });
    }
  });
  export const addProductAsync = createAsyncThunk<Product, FormData>(
    "product/addProductAsync",
    async (data, ThunkAPI) => {
      try {
        const response = await agent.Product.create(data);
        return response;
      } catch (error: any) {
        return ThunkAPI.rejectWithValue({ error: error.data });
      }
    }
  );

  export const LockOrUnlockProductAsync = createAsyncThunk(
    "product/LockOrUnlockProductAsync",
    async (data: {productId: string}, ThunkAPI) => {
      try {
        await agent.Product.lockOrUnlock(data);
        return data.productId;
      } catch (error: any) {
        return ThunkAPI.rejectWithValue({ error: error.data });
      }
    }
  );

  export const updateProductAsync = createAsyncThunk<Product, {formData: FormData, id: string}>(
    "product/updateProductAsync",
    async ({formData, id}, ThunkAPI) => {
      try {
        const response = await agent.Product.update(id, formData);
        return response;
      } catch (error: any) {
        return ThunkAPI.rejectWithValue({ error: error.data });
      }
    }
  );
  
  export const deleteProductAsync = createAsyncThunk(
    "product/deleteProductAsync",
    async (id: string) => {
      try {
        await agent.Product.delete(id);
        toast.success("Delete product successfully!");
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
      Types: [],
      Brands: [],
      Models: [],
      Colors: [],
      Search: null,
    };
  }
  
  export const ProductSlice = createSlice({
    name: "product",
    initialState: productsAdapter.getInitialState<ProductState>({
      product: null,
      productLoaded: false,
      productParams: initParams(),
      metaData: null,
    }),
    reducers: {
      addProduct: (state, action) => {
        productsAdapter.addOne(state, action.payload);
      },
      removeProduct: (state, action) => {
        productsAdapter.removeOne(state, action.payload);
      },
      setProductParams: (state, action) => {
        state.productParams = {
          ...state.productParams,
          ...action.payload,
        };
      },
      resetProductParams: (state) => {
        state.productParams = initParams();
      },
      setMetaData: (state, action) => {
        state.metaData = action.payload;
      },
  
      setPageNumber: (state, action) => {
        state.productLoaded = false;
        state.productParams = {
          ...state.productParams,
          ...action.payload,
        };
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(getProductsAsync.fulfilled, (state, action) => {
          productsAdapter.setAll(state, action.payload);
          state.productLoaded = false;
        })
        .addCase(getProductsAsync.pending, (state, action) => {
          state.productLoaded = true;
        })
        .addCase(getProductsAsync.rejected, (state, action) => {
          console.log("Get products rejected: ", action);
          state.productLoaded = false;
        });

      builder.addCase(addProductAsync.fulfilled, (state, action) => {
        toast.success("Add product successfully!");
        productsAdapter.addOne(state, action.payload);
      });

      builder
        .addCase(LockOrUnlockProductAsync.fulfilled, (state, action) => {
          const productId = action.payload;
          const product = state.entities[productId];
          if(product)
          {
            const message = product.isOnStock ? "Lock product successfully!" : "Unlock product successfully!";
            product.isOnStock = !product.isOnStock;
            toast.success(message);
          }
        })
        .addCase(LockOrUnlockProductAsync.rejected, (state, action) => {
          toast.error("Update status product failed!");
        });

      builder.addCase(updateProductAsync.fulfilled, (state, action) => {
        toast.success("Update product successfully!");
        productsAdapter.upsertOne(state, action.payload);
      });
  
      builder.addCase(deleteProductAsync.fulfilled, (state, action) => {
        productsAdapter.removeOne(state, action.payload);
      });
    },
  });
  
  export const productSelectors = productsAdapter.getSelectors(
    (state: RootState) => state.product
  );
  
  export const {
    setProductParams,
    resetProductParams,
    setMetaData,
    setPageNumber,
    addProduct,
    removeProduct,
  } = ProductSlice.actions;