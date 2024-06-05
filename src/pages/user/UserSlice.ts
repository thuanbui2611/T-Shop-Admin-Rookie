import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
  } from "@reduxjs/toolkit";
  import { RootState } from "../../app/store/ConfigureStore";
  import agent from "../../app/api/agent";
  import { MetaData } from "../../app/models/Pagination";
import { User, UserParams } from "../../app/models/User";
import { toast } from "react-toastify";
  
  interface UserState {
    user: User | null;
    userLoaded: boolean;
    userParams: UserParams;
    metaData: MetaData | null;
  }
  
  const usersAdapter = createEntityAdapter<User>();
  
  function getAxiosParams(userParams: UserParams) {
    const params = new URLSearchParams();
    params.append("pageNumber", userParams.pageNumber.toString());
    params.append("pageSize", userParams.pageSize.toString());
    return params;
  }
  
  export const getUsersAsync = createAsyncThunk<
    User[],
    void,
    { state: RootState }
  >("user/getUsersAsync", async (_, ThunkAPI) => {
    const params = getAxiosParams(
      ThunkAPI.getState().user.userParams
    );
    try {
      const response = await agent.User.list(params);
      debugger;
      ThunkAPI.dispatch(setMetaData(response.metaData));
      return response.items;
    } catch (error: any) {
      return ThunkAPI.rejectWithValue({ error: error.data });
    }
  });

  export const LockOrUnlockUserAsync = createAsyncThunk(
    "user/LockOrUnlockUserAsync",
    async (data: {userId: string}, ThunkAPI) => {
      try {
        await agent.User.lockOrUnlock(data);
        return data.userId;
      } catch (error: any) {
        return ThunkAPI.rejectWithValue({ error: error.data });
      }
    }
  );

  function initParams() {
    return {
      pageNumber: 1,
      pageSize: 5,
    };
  }
  
  export const UserSlice = createSlice({
    name: "user",
    initialState: usersAdapter.getInitialState<UserState>({
      user: null,
      userLoaded: false,
      userParams: initParams(),
      metaData: null,
    }),
    reducers: {
      setUserParams: (state, action) => {
        state.userParams = {
          ...state.userParams,
          ...action.payload,
        };
      },
  
      resetUserParams: (state) => {
        state.userParams = initParams();
      },
      setMetaData: (state, action) => {
        state.metaData = action.payload;
      },
  
      setPageNumber: (state, action) => {
        state.userLoaded = false;
        state.userParams = {
          ...state.userParams,
          ...action.payload,
        };
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(getUsersAsync.fulfilled, (state, action) => {
          debugger;
          usersAdapter.setAll(state, action.payload);
          state.userLoaded = false;
        })
        .addCase(getUsersAsync.pending, (state, action) => {
          state.userLoaded = true;
        })
        .addCase(getUsersAsync.rejected, (state, action) => {
          console.log("Get User rejected: ", action);
          state.userLoaded = false;
        });

      builder
        .addCase(LockOrUnlockUserAsync.fulfilled, (state, action) => {
          const userId = action.payload;
          const user = state.entities[userId];
          if(user)
          {
            const message = user.isLocked ? "Unlock user successfully!" : "Lock user successfully!";
            user.isLocked = !user.isLocked;
            toast.success(message);
          }
        })
        .addCase(LockOrUnlockUserAsync.rejected, (state, action) => {
          toast.error("Update status user failed!");
        });
    },
  });
  
  export const userSelectors = usersAdapter.getSelectors(
    (state: RootState) => state.user
  );
  
  export const {
    setUserParams,
    resetUserParams,
    setMetaData,
    setPageNumber,
  } = UserSlice.actions;
  