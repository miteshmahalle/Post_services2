// src/pages/DivisionDashboard.tsx
import React from "react";

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

interface DivisionDashboardProps {
  currentYear: number;
  username: string;
  role: string;
  branchesCount: number;
  stats: Stats;
  months: Month[];
  branches: Branch[];
}

const DivisionDashboard: React.FC<DivisionDashboardProps> = ({
  currentYear,
  username,
  role,
  branchesCount,
  stats,
  months,
  branches,
}) => {
  return (
    <div className="container my-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary">Division Dashboard – {currentYear}</h2>
        <div>
          Logged in as <strong>{username}</strong> ({role})
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6 className="mb-1">Branches</h6>
            <h3>{branchesCount}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6 className="mb-1">Avg Energy (kWh)</h6>
            <h3>{stats.avg_energy_kwh || 0}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6 className="mb-1">Total Energy Bill</h6>
            <h3>₹ {stats.total_energy_bill || 0}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6 className="mb-1">Training Hours</h6>
            <h3>{stats.total_training_hours || 0}</h3>
          </div>
        </div>
      </div>

      {/* Generate Report */}
      <div className="mb-4 text-center">
        <button
          className="btn btn-primary btn-lg"
          onClick={() => {
            // replace with actual API navigation
            window.location.href = "/generate-brsr";
          }}
        >
                    📊 Generate BRSR Report
                  </button>
                </div>
              </div>
            );
          };
          
          export default DivisionDashboard;
