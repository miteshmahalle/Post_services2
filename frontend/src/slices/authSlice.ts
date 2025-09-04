// src/store/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../api";

// Make sure User interface includes all response fields
export interface User {
  address: string;
  branch_code: string;
  branch_id: number;
  branch_name: string;
  email: string;
  manager_name: string;
  parent_id: number | null;
  phone: string;
  role: string;
  user_id: number;
  username: string;
  pincode?: string;    // Add optional properties
  state?: string; 
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  registerMessage: string | null;
  isAuthenticated: boolean;
  profileLoading: boolean;
  profileError: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
  registerMessage: null,
  isAuthenticated: false,
  profileLoading: false,
  profileError: null,
};

// ✅ Async thunk for updating profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    { token, profileData }: { token: string; profileData: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.updateProfile(token, profileData);
      // Based on your API response structure
      return response.profile; // Your API returns { profile: User }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

// ✅ Async thunk for fetching profile
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await userApi.getProfile(token);
      // Based on your API response structure
      return response.profile; // Your API returns { profile: User }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ============ LOGIN ACTIONS ============
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },

    // ============ REGISTER ACTIONS ============
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
      state.registerMessage = null;
    },
    registerSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.registerMessage = action.payload;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.registerMessage = null;
    },

    // ============ GENERAL ACTIONS ============
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.registerMessage = null;
      state.profileLoading = false;
      state.profileError = null;
    },
    clearError: (state) => {
      state.error = null;
      state.profileError = null;
    },
    clearRegisterMessage: (state) => {
      state.registerMessage = null;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },

    // ============ TOKEN VALIDATION ============
    validateTokenStart: (state) => {
      state.loading = true;
    },
    validateTokenSuccess: (state, action: PayloadAction<{ user: User }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },
    validateTokenFailure: (state) => {
      state.loading = false;
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Profile update
      .addCase(updateProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        if (state.user && action.payload) {
          state.user = { ...state.user, ...action.payload };
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload as string;
      })
      // Profile fetch
      .addCase(getProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        if (action.payload) {
          state.user = action.payload;
        }
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload as string;
      });
  },
});

export const {
  // Login actions
  loginStart,
  loginSuccess,
  loginFailure,

  // Register actions
  registerStart,
  registerSuccess,
  registerFailure,

  // General actions
  logout,
  clearError,
  clearRegisterMessage,
  setAuthenticated,

  // Token validation actions
  validateTokenStart,
  validateTokenSuccess,
  validateTokenFailure,
} = authSlice.actions;

export default authSlice.reducer;