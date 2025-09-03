import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dashboardApi } from "../api";
import Dashboard from "../components/monthdashboard";
import Header from "../components/Header";     // ✅ Import Header
import Sidebar from "../components/sidebar";   // ✅ Import Sidebar
import "../style/branchdashboard.css";         // ✅ Import CSS file

interface DashboardData {
  branch_id: number;
  months: { name: string; submitted: boolean; value: string }[];
  year: number;
}

const BranchDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  // ✅ get token from Redux authSlice
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return; // wait until token is ready
        const result = await dashboardApi.getBranchDashboard(token);
        setData(result as DashboardData);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      }
    };
    fetchData();
  }, [token]);

  if (!data) return <p className="loading-text">Loading...</p>; // ✅ Use CSS class

  return (
    <div className="branch-dashboard">
      <Header /> {/* ✅ Top Header */}
      <div className="dashboard-layout">
        <Sidebar isOpen={false} onClose={function (): void {
          throw new Error("Function not implemented.");
        } } /> {/* ✅ Sidebar on left */}
        <div className="dashboard-content">
          <Dashboard months={data.months} year={data.year} />
        </div>
      </div>
    </div>
  );
};

export default BranchDashboard;
