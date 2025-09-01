// src/pages/BranchDashboard.tsx
import React from "react";

interface Month {
  name: string;
  value: string;
  submitted: boolean;
}

interface BranchDashboardProps {
  currentYear: number;
  months: Month[];
}

const BranchDashboard: React.FC<BranchDashboardProps> = ({ currentYear, months }) => {
  return (
    <div className="container my-5">
      <div className="card shadow border-0">
        <div className="card-header bg-primary text-white text-center">
          <h4 className="mb-0">Branch Dashboard — {currentYear}</h4>
        </div>
        <div className="card-body">
          <div className="row row-cols-2 row-cols-md-4 g-3">
            {months.map((month, index) => (
              <div className="col" key={index}>
                <div
                  className={`card text-center ${
                    month.submitted ? "border-success" : "border-danger"
                  }`}
                >
                  <div className="card-body">
                    <h5 className="card-title">{month.name}</h5>
                    {month.submitted ? (
                      <span className="badge bg-success">Submitted</span>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline-primary mt-2"
                        onClick={() => {
                          // Navigate to ESG report submission page
                          window.location.href = `/submit-esg/${month.value}`;
                        }}
                      >
                        File Report
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchDashboard;
