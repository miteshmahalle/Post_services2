// src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ---------------- AUTH APIs ----------------
export const authApi = {
  login: async (username: string, password: string) => {
    const res = await api.post("/auth/login", { username, password });
    return res.data; // { message, token, user }
  },

  register: async (username: string, password: string) => {
    const res = await api.post("/auth/register", { username, password });
    return res.data; // { message }
  },

  validateToken: async (token: string) => {
    const res = await api.post(
      "/auth/validate",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data; // { valid: boolean }
  },
};

// ---------------- DASHBOARD APIs ----------------
export const dashboardApi = {
  getBranchDashboard: async (token: string) => {
    const res = await api.get("/dashboard/branch", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // { branch_id, months, year }
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