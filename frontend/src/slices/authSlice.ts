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
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;