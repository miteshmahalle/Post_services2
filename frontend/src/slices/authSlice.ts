// src/store/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Make sure User interface includes all response fields
export interface User {
  address: string;
  branch_code: string;
  branch_id: number;
  branch_name: string;
  email: string;
  manager_name: string; // Added missing field
  parent_id: number | null;
  phone: string;       // Changed from 'mobile' to 'phone'
  role: string;
  user_id: number;
  username: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  registerMessage: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
  registerMessage: null,
  isAuthenticated: false,
};

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
    },
    clearError: (state) => {
      state.error = null;
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