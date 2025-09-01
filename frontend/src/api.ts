// src/api.ts
const API_BASE_URL = "http://localhost:5000/api"; // change to your backend base URL

// Helper function for requests
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errorMsg = "Something went wrong";
    try {
      const err = await res.json();
      errorMsg = err.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return res.json();
}

// Auth APIs
export const authApi = {
  login: async (username: string, password: string) => {
    const res = await request<{
      message: string;
      token: string;
      user: {
        user_id: number;
        username: string;
        role: string;
        branch_id: number;
        branch_name: string;
        branch_code: string;
        manager_name: string;
        email: string;
        phone: string;
        parent_id: number | null;
        address: string;
      };
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    // Return the response exactly as received from server
    return res;
  },

  register: (username: string, password: string) =>
    request<{ message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  validateToken: (token: string) =>
    request<{ valid: boolean }>("/auth/validate", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),
};