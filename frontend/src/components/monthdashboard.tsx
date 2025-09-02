// src/components/Dashboard.tsx
import React from "react";
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
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Reports Calender - {year}</h2>
      <div className="dashboard-grid">
        {months.map((month) => (
          <div
            key={month.value}
            className={`month-card ${month.submitted ? "submitted" : "not-submitted"}`}
          >
            {month.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
