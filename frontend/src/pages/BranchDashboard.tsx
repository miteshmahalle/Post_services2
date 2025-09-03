import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dashboardApi } from "../api";
import Dashboard from "../components/monthdashboard";

import Header from "../components/Header";
import Navigation from "../components/Navigation"; // New navigation component
import "../style/branchdashboard.css";

interface DashboardData {
  branch_id: number;
  months: { name: string; submitted: boolean; value: string }[];
  year: number;
}

const BranchDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const token = useSelector((state: any) => state.auth.token);
  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;
        const result = await dashboardApi.getBranchDashboard(token);
        setData(result as DashboardData);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      }
    };
    fetchData();
  }, [token]);

  if (!data) return <p className="loading-text">Loading...</p>;

  return (
    <div className="branch-dashboard">

      <Header />
      
      {/* Navigation Bar */}
      <nav className="main-navigation">
        <div className="nav-container">
          <button 
            className="hamburger-menu"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            ☰
          </button>
          <ul className="nav-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#reports">Reports</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#notifications">Notifications</a></li>
          </ul>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Welcome Message */}
        <div className="welcome-section">
          <h2>Welcome, {user?.manager_name}</h2>
          <p>Last logged in on {new Date().toLocaleDateString()}</p>
        </div>

        {/* Main Dashboard Content */}
        <div className="dashboard-main">
          <Navigation isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
          
          <div className="dashboard-right">
            <Dashboard months={data.months} year={data.year} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchDashboard;