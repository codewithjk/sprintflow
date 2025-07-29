//authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from './authAPI';
import { LoginDTO } from '../../../../../../libs/shared/types/src';
import { AuthState } from '../../types/state.type';

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  invitation: null,
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ role, ...payload }: LoginDTO & { role: 'user' | 'super_admin' | 'organization' }, thunkAPI) => {
    try {
      let res;
      if (role === 'user') {
        res = await authAPI.loginUser(payload);
        return res.data.user;
      }
      else if (role === 'super_admin') {
        res = await authAPI.loginAdmin(payload);
        return res.data.admin;
      }
      else {
        res = await authAPI.loginOrg(payload);
        return res.data.org;
      }

    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const verifyInvitationThunk = createAsyncThunk(
  'verify/invitation',
  async (token: string, thunkAPI) => {
    try {
      const res = await authAPI.verifyInvitation({ token });
      return res.data.invitation;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
)




export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.invitation = null;
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
      })
      .addCase(verifyInvitationThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      }).addCase(verifyInvitationThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invitation = action.payload;
      })
      .addCase(verifyInvitationThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
  }
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
