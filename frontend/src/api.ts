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
}

//Fetch the data of branches
export const branchesApi = {
  getBranchesList: async (token: string): Promise<BranchesResponse> => {
    const res = await api.get<BranchesResponse>("/fetch_data/branches/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};

// ---------------- REPORT TABLE APIs ----------------
export const report_tableApi = {
  getSubmittedReports: async (token: string): Promise<SubmittedReportsResponse> => {
    const res = await api.get<SubmittedReportsResponse>("/fetch_data/submitted-reports", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};

// ---------------- GENERATE REPORT APIs ----------------
export const generateReportApi = {
  generateReport: async (token: string, reportData: any) => {
    const res = await api.post("/generate-report", reportData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};

// ---------------- DOWNLOAD REPORT APIs ----------------
// // In your api.ts file, update the downloadReportApi
// export const downloadReportApi = {
//   downloadReport: async (token: string, filename: string): Promise<Blob> => {
//     const res = await api.get(`/reports/${filename}`, {
//       headers: { Authorization: `Bearer ${token}` },
//       responseType: 'blob' // Important for file downloads
//     });
//     return res.data;
//   },
// };
// Export the api instance for direct use if needed
export default api;

// // src/api.ts
// import axios from "axios";
// import { User } from "./slices/authSlice"; // adjust if needed

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

// // ---------------- Types ----------------
// export interface AuthResponse {
//   message: string;
//   token: string;
//   user: User;
// }

// export interface RegisterResponse {
//   message?: string;
//   success?: boolean;
//   error?: string;
// }

// export interface ValidateResponse {
//   valid: boolean;
// }

// export interface ProfileResponse {
//   message: string;
//   profile: User;
// }


// export interface DashboardResponse {
//   branch_id?: number; // changed to number ✅ to match DashboardData
//   months?: string[];
//   year?: number;
//   [key: string]: any;
// }

// export interface SubmitResponse {
//   message: string;
//   success: boolean;
// }

// // Update the Branch interface in api.ts
// export interface Branch {
//   branch_id: number;
//   branch_code: string;
//   branch_name: string;
//   manager_name: string;
//   phone: string;
// }

// export interface BranchesResponse {
//   branches: Branch[];
//   error?: string;
// }

// // ---------------- AUTH APIs ----------------
// export const authApi = {
//   login: async (username: string, password: string): Promise<AuthResponse> => {
//     const res = await api.post<AuthResponse>("/auth/login", {
//       username,
//       password,
//     });
//     return res.data;
//   },

//   register: async (token: string, Formdata: any): Promise<RegisterResponse> => {
//   const res = await api.post<RegisterResponse>("/auth/register", Formdata, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res.data;
//   },

//   validateToken: async (token: string): Promise<ValidateResponse> => {
//     const res = await api.post<ValidateResponse>(
//       "/auth/validate",
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return res.data;
//   },
// };

// // ---------------- USER PROFILE APIs ----------------
// export const userApi = {
//   getProfile: async (token: string): Promise<ProfileResponse> => {
//     const res = await api.get<ProfileResponse>("/auth/profile", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   },

//   updateProfile: async (
//     token: string,
//     profileData: Partial<User>
//   ): Promise<ProfileResponse> => {
//     const res = await api.put<ProfileResponse>("/auth/update_profile", profileData, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   },
// };

// // ---------------- DASHBOARD APIs ----------------
// export const dashboardApi = {
//   getBranchDashboard: async (token: string) => {
//     const res = await api.get("/dashboard/branch", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   },

//   getDivisionDashboard: async (token: string) => {
//     const res = await api.get("/dashboard/division", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   },

//   getCircleDashboard: async (token: string) => {
//     const res = await api.get("/dashboard/circle", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   },

//   // ✅ NEW: Submit Branch ESG Report
//   submitBranchESG: async (token: string, esgData: any) => {
//     const res = await api.post("/branch_esg/submit", esgData, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data; // { message, success }
//   },

//    // ✅ NEW: Submit Branch ESG Report
//   submitDivisionESG: async (token: string, esgData: any) => {
//     const res = await api.post("/division_esg/submit", esgData, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data; // { message, success }
//   },
  
// };

// export const divisionDashboard = {

//   // ✅ Get Division Graph (dynamic column)
//   getGraph: async (token: string, column: string) => {
//     const res = await api.get(`division_esg/division_graph?column=${column}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data; // { column, data: [...], division_id }
//   },

//   getAverage: async (token: string, column: string) => {
//     const res = await api.get(`division_esg/division_averages`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data; // { column, data: [...], division_id }
//   },
// }

// //Fetch the data of branches
// export const branchesApi = {
//   getBranchesList: async (token: string): Promise<BranchesResponse> => {
//     const res = await api.get<BranchesResponse>("/fetch_data/branches/list", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   },
// };