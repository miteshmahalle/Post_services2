import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import DivisionSidebar from "../components/divisionsidebar";
import DivisionScroll from "../components/divisionscroll";
import { dashboardApi } from "../api";
import "../style/divisiondashboard.css";
import Dashboard from "../components/monthdashboard";
import DivisionGraph from "../components/DivisionGraph";

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
  year: number;
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

  // ✅ Get token & user from Redux
  const token = useSelector((state: any) => state.auth.token);
  const user = useSelector((state: any) => state.auth.user);

  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const result = await dashboardApi.getDivisionDashboard(token);
        setData(result as DivisionDashboardData);
      } catch (error) {
        console.error("Error loading division dashboard:", error);
      }
    };
    fetchData();
  }, [token]);

  if (!data) return <p className="loading-text">Loading Division Dashboard...</p>;

  return (
    <div className="division-dashboard">
      {/* Fixed Header */}
      <div className="fixed-header">
        <Header />
      </div>

      {/* Fixed Navigation
       <nav className="blue_header">
        <div className="nav-text">
        <h2> Business Responsibility and Sustainability Reporting </h2> 
        </div>
      </nav> */}

      <div className="dashboard-layout">
        {/* Fixed Sidebar */}
        <div className="fixed-sidebar">
          <DivisionSidebar />
        </div>

        {/* Scrollable Content */}
        <div className="dashboard-content scrollable-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h2>Welcome, {user?.manager_name}</h2>
            <p>Last logged in on {new Date().toLocaleDateString()}</p>
          </div>

          {/* Division Scroll Component - Metrics Cards */}
          <div className="division-scroll-section">
            <DivisionScroll />
          </div>

          {/* Division Graph */}
          <div className="dashboard-graph">
            <div className="graph-wrapper">
              <DivisionGraph />
            </div>
          </div>

          {/* Month Dashboard */}
          <div className="dashboard-main">
            <div className="dashboard-right">
              <Dashboard months={data.months} year={data.year} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DivisionDashboard;
