import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import CircleSidebar from "../components/CircleSidebar";
import Circletable from "../pages/Circletable";
import { dashboardApi } from "../api";
import "../style/circledashboard.css";

interface CircleDashboardData {
  year: number;
  circle_id: number;
}

const CircleDashboard: React.FC = () => {
  const [data, setData] = useState<CircleDashboardData | null>(null);

  // Get token & user from Redux
  const token = useSelector((state: any) => state.auth.token);
  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dashboardApi.getCircleDashboard(token);
        setData(result as CircleDashboardData);
      } catch (error) {
        console.error("Error loading circle dashboard:", error);
      }
    };
    fetchData();
  }, [token, user]);

  if (!data) return <div className="loader-container">
      {/* Fixed Header */}
      <div className="fixed-header">
        <Header />
      </div>

      {/* Blue Header */}
      <nav className="blue_header">
        <div className="nav-text">
          <h2>Circle Dashboard for {user?.manager_name}</h2>
        </div>
      </nav>
      <div className="loader"></div>
      {/* Sidebar */}
        <div className="fixed-sidebar">
          <CircleSidebar />
        </div>
      
      <p className="loading-text">Loading Division Data...</p>
    </div>;

  return (
    <div className="circle-dashboard">
      {/* Fixed Header */}
      <div className="fixed-header">
        <Header />
      </div>

      <nav className="blue_header">
        <div className="nav-text">
        <h2> Circle Dashboard for {user?.manager_name}</h2> 
        </div>
      </nav> 

      <div className="dashboard-layout">
        {/* Sidebar */}
        <CircleSidebar />

        {/* Content */}
        <div className="scrollable-content">
          {/* Welcome Section just below header */}
          <div className="welcome-section">
            <h2>Welcome, {user?.manager_name}</h2>
            <p>Last logged in on {new Date().toLocaleDateString()}</p>
          </div>

          {/* Submitted Reports Table */}
          <Circletable />
        </div>
      </div>
    </div>
  );
};

export default CircleDashboard;