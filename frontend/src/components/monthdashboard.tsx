// src/components/monthdashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style/monthdashboard.css"; // import custom CSS

interface Month {
  name: string;
  submitted: boolean;
  value: string;
}

interface DashboardProps {
  months: Month[];
  year: number;
}

const Dashboard: React.FC<DashboardProps> = ({ months, year }) => {
  const navigate = useNavigate();
  const branchId = useSelector((state: any) => state.auth.user?.branch_id); // Get branch ID from auth slice

  const handleMonthClick = (month: Month) => {
    // Check if month is already submitted
    if (month.submitted) {
      alert(`ESG Report for ${month.name} has already been submitted. View summary feature coming soon!`);
      return;
    }
    
    // Navigate to ESG form with month and branch ID as URL parameters
    navigate(`/branch-esg-form?month=${month.value}&year=${year}&branchId=${branchId}`);
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Reports Calendar - {year}</h2>
      <div className="dashboard-grid">
        {months.map((month) => (
          <div
            key={month.value}
            className={`month-card ${month.submitted ? "submitted" : "not-submitted"}`}
            onClick={() => handleMonthClick(month)}
            style={{ cursor: "pointer" }}
          >
            {month.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;