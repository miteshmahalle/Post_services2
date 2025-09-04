// src/api.ts
import axios from "axios";
import { User } from "./slices/authSlice"; // adjust if needed

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ---------------- Types ----------------
export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
}

export interface ValidateResponse {
  valid: boolean;
}

export interface ProfileResponse {
  message: string;
  profile: User;
}

export interface DashboardResponse {
  branch_id?: number; // changed to number ✅ to match DashboardData
  months?: string[];
  year?: number;
  [key: string]: any;
}

export interface SubmitResponse {
  message: string;
  success: boolean;
}

// ---------------- AUTH APIs ----------------
export const authApi = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/login", {
      username,
      password,
    });
    return res.data;
  },

  register: async (
    username: string,
    password: string
  ): Promise<RegisterResponse> => {
    const res = await api.post<RegisterResponse>("/auth/register", {
      username,
      password,
    });
    return res.data;
  },

  validateToken: async (token: string): Promise<ValidateResponse> => {
    const res = await api.post<ValidateResponse>(
      "/auth/validate",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },
};

// ---------------- USER PROFILE APIs ----------------
export const userApi = {
  getProfile: async (token: string): Promise<ProfileResponse> => {
    const res = await api.get<ProfileResponse>("/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  updateProfile: async (
    token: string,
    profileData: Partial<User>
  ): Promise<ProfileResponse> => {
    const res = await api.put<ProfileResponse>("/auth/profile", profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};

// ---------------- DASHBOARD APIs ----------------
export const dashboardApi = {
  getBranchDashboard: async (token: string): Promise<DashboardResponse> => {
    const res = await api.get<DashboardResponse>("/dashboard/branch", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getDivisionDashboard: async (token: string): Promise<DashboardResponse> => {
    const res = await api.get<DashboardResponse>("/dashboard/division", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getCircleDashboard: async (token: string): Promise<DashboardResponse> => {
    const res = await api.get<DashboardResponse>("/dashboard/circle", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  submitBranchESG: async (
    token: string,
    esgData: any
  ): Promise<SubmitResponse> => {
    const res = await api.post<SubmitResponse>("/branch_esg/submit", esgData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
