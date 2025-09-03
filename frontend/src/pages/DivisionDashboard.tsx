// src/pages/DivisionDashboard.tsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header"; // ✅ Top header
import Sidebar from "../components/sidebar"; // ✅ Sidebar
import { dashboardApi } from "../api"; // ✅ Import dashboardApi
import "../style/branchdashboard.css"; // ✅ Reuse same layout CSS

interface Month {
  name: string;
  value: string;
  submitted: boolean;
}

interface Branch {
  branch_id: number;
  branch_code: string;
  branch_name: string;
  level: string;
  state: string;
  pincode: string;
}

interface Stats {
  avg_energy_kwh: number;
  total_energy_bill: number;
  total_training_hours: number;
}

interface DivisionDashboardData {
  currentYear: number;
  username: string;
  role: string;
  branchesCount: number;
  stats: Stats;
  months: Month[];
  branches: Branch[];
}

const DivisionDashboard: React.FC = () => {
  const [data, setData] = useState<DivisionDashboardData | null>(null);

  // ✅ Get token from Redux
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const result = await dashboardApi.getDivisionDashboard(token); // ✅ Use API helper
        setData(result as DivisionDashboardData);
      } catch (error) {
        console.error("Error loading division dashboard:", error);
      }
    };
    fetchData();
  }, [token]);

  if (!data) return <p className="loading-text">Loading Division Dashboard...</p>;

  return (
    <div className="branch-dashboard">
      <Header /> {/* ✅ Top header */}
      <div className="dashboard-layout">
        <Sidebar
          isOpen={false}
          onClose={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
        <div className="dashboard-content">
          {/* Title */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="text-primary">Division Dashboard – {data.currentYear}</h2>
            <div>
              Logged in as <strong>{data.username}</strong> ({data.role})
            </div>
          </div>

          {/* KPI Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card p-3 shadow-sm">
                <h6 className="mb-1">Branches</h6>
                <h3>{data.branchesCount}</h3>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card p-3 shadow-sm">
                <h6 className="mb-1">Avg Energy (kWh)</h6>
                <h3>{data.stats.avg_energy_kwh || 0}</h3>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card p-3 shadow-sm">
                <h6 className="mb-1">Total Energy Bill</h6>
                <h3>₹ {data.stats.total_energy_bill || 0}</h3>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card p-3 shadow-sm">
                <h6 className="mb-1">Training Hours</h6>
                <h3>{data.stats.total_training_hours || 0}</h3>
              </div>
            </div>
          </div>

          {/* Generate Report */}
          <div className="mb-4 text-center">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                window.location.href = "/generate-brsr";
              }}
            >
              📊 Generate BRSR Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DivisionDashboard;
