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

  // ✅ Pull user from Redux auth slice
  const user = useSelector((state: any) => state.auth.user);
  const branchId = user?.branch_id;
  const role = user?.role;

  const handleMonthClick = (month: Month) => {
    if (month.submitted) {
      alert(
        `ESG Report for ${month.name} has already been submitted. View summary feature coming soon!`
      );
      return;
    }

    // ✅ Route dynamically based on role
    if (role === "branch") {
      navigate(
        `/branch-esg-form?month=${month.value}&year=${year}&branchId=${branchId}`
      );
    } else if (role === "division") {
      navigate(
        `/division-esg-form?month=${month.value}&year=${year}&branchId=${branchId}`
      );
    } else {
      alert("❌ Unauthorized role – ESG submission not allowed.");
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Reports Calendar - {year}</h2>
      <div className="dashboard-grid">
        {months.map((month) => (
          <div
            key={month.value}
            className={`month-card ${
              month.submitted ? "submitted" : "not-submitted"
            }`}
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
