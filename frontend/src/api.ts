// src/api.ts
import axios from "axios";
import { User } from "./slices/authSlice"; // adjust if needed

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// ---------------- Response Handler ----------------
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Request failed');
  }
  return response.json();
};

// ---------------- Types ----------------
export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// ---------------- BRSR Report Submission ----------------
export interface BRSRReportRequest {
  division_id: number;
  division_brsr_report_yearly: Array<{
     reporting_month: string; 
    avg_energy_kwh: number;
    avg_energy_bill: number;
    avg_fuel_litres: number;
    avg_paper_reams: number;
    avg_waste_kg: number;
    avg_water_litres: number;
    avg_training_hours: number;
    avg_complaint_count: number;
  }>;
}

export interface BRSRReportResponse {
  message: string;
  report_id: number;
  error?: string;
}

export interface SubmissionStatusResponse {
  has_submitted: boolean;
  last_submission_date?: string;
  error?: string;
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

// Add Change Password types
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordResponse {
  message: string;
  success?: boolean;
  error?: string;
}

// Update the Branch interface in api.ts
export interface Branch {
  branch_id: number;
  branch_code: string;
  branch_name: string;
  manager_name: string;
  phone: string;
}

export interface BranchesResponse {
  branches: Branch[];
  error?: string;
}

// ---------------- Submitted Reports Types ----------------
export interface SubmittedReport {
  report_id: number;
  district_id: number;
  division_name: string;
  manager_name: string;
  phone: string;
  file_path: string;
  created_at: string;
  generated_by_user: string;
}

export interface SubmittedReportsResponse {
  reports: SubmittedReport[];
  error?: string;
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

  // NEW: Change Password API
  changePassword: async (token: string, passwordData: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    const res = await api.post<ChangePasswordResponse>("/auth/change-password", passwordData, {
      headers: { Authorization: `Bearer ${token}` },
    });
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

// ---------------- REPORT TABLE APIs ----------------
export const report_tableApi = {
  getSubmittedReports: async (token: string): Promise<SubmittedReportsResponse> => {
    const res = await api.get<SubmittedReportsResponse>("/fetch_data/submitted-reports", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  // 🔹 New API for division report
    getDivisionReport: async (divisionId: number, token: string): Promise<any> => {
      const res = await api.get(`/fetch_data/division_report?division_id=${divisionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },

};

export const branchApi = {
  getBranchesList: async (token: string): Promise<BranchesResponse> => {
    const res = await api.get<BranchesResponse>("/fetch_data/branches/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};

// ---------------- BRSR REPORT APIs ----------------
export const brsrReportApi = {
  submitBRSRReport: async (token: string, reportData: BRSRReportRequest): Promise<BRSRReportResponse> => {
    const res = await api.post<BRSRReportResponse>("/fetch_data/generate-report", reportData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  checkSubmissionStatus: async (token: string, division_id: number): Promise<SubmissionStatusResponse> => {
    const res = await api.get<SubmissionStatusResponse>(`/fetch_data/check-submission-status?division_id=${division_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};