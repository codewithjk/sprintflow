
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from './authAPI';
import { LoginDTO } from '../../../../../../libs/shared/types/src';
import { AuthState } from '../../types/state.type';

const initialState : AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const loginThunk = createAsyncThunk('auth/login', async (payload:LoginDTO , thunkAPI) => {
  try {
    const res = await authAPI.login(payload);
    return res.data.user;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});




export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
