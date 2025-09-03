// src/pages/DivisionDashboard.tsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header"; // ✅ Top header
import DivisionSidebar from "../components/divisionsidebar"; // ✅ Sidebar
import { dashboardApi } from "../api"; // ✅ Import dashboardApi
import "../style/divisiondashboard.css"; // ✅ Use new CSS
import { Navigation } from "lucide-react";
import Dashboard from "../components/monthdashboard";

interface Month {
  name: string;
  value: string;
  submitted: boolean;
}

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
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

  // ✅ Get token from Redux
  const token = useSelector((state: any) => state.auth.token);
  const user = useSelector((state: any) => state.auth.user);
  
 const [isNavOpen, setIsNavOpen] = useState(false);
  
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
    <div className="division-dashboard">
      <Header /> {/* ✅ Top header */}
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
      <div className="dashboard-layout">
        <DivisionSidebar
        />
        <div className="dashboard-content">
        {/* Welcome Message */}
        <div className="welcome-section">
          <h2>Welcome, {user?.manager_name}</h2>
          <p>Last logged in on {new Date().toLocaleDateString()}</p>
        </div>

        {/* Main Dashboard Content */}
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
