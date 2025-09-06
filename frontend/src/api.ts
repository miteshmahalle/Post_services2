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
  message?: string;
  success?: boolean;
  error?: string;
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

  register: async (token: string, Formdata: any): Promise<RegisterResponse> => {
  const res = await api.post<RegisterResponse>("/auth/register", Formdata, {
    headers: { Authorization: `Bearer ${token}` },
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
    const res = await api.put<ProfileResponse>("/auth/update_profile", profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};

// ---------------- DASHBOARD APIs ----------------
export const dashboardApi = {
  getBranchDashboard: async (token: string) => {
    const res = await api.get("/dashboard/branch", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getDivisionDashboard: async (token: string) => {
    const res = await api.get("/dashboard/division", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getCircleDashboard: async (token: string) => {
    const res = await api.get("/dashboard/circle", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // ✅ NEW: Submit Branch ESG Report
  submitBranchESG: async (token: string, esgData: any) => {
    const res = await api.post("/branch_esg/submit", esgData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // { message, success }
  },

   // ✅ NEW: Submit Branch ESG Report
  submitDivisionESG: async (token: string, esgData: any) => {
    const res = await api.post("/division_esg/submit", esgData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // { message, success }
  },
  
};

export const divisionDashboard = {

  // ✅ Get Division Graph (dynamic column)
  getGraph: async (token: string, column: string) => {
    const res = await api.get(`division_esg/division_graph?column=${column}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // { column, data: [...], division_id }
  },

  getAverage: async (token: string, column: string) => {
    const res = await api.get(`division_esg/division_averages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // { column, data: [...], division_id }
  },
  getDivisionReport: async (token: string) => {
    const res = await api.get(`division_esg/division_yearly_averages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // { column, data: [...], division_id }
  },
  getDivisionBRSRReport: async (token: string) => {
    const res = await api.get(`division_esg/division_BRSR_report`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // { column, data: [...], division_id }
  },
  getBranchReport: async (token: string) => {
    const res = await api.get(`division_esg/division_branch_yearly_averages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // { column, data: [...], division_id }
  },
}