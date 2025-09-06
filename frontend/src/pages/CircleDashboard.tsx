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

  if (!data) return <p className="loading-text">Loading Circle Dashboard...</p>;

  return (
    <div className="circle-dashboard">
      {/* Fixed Header */}
      <div className="fixed-header">
        <Header />
      </div>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <CircleSidebar />

        {/* Content */}
        <div className="dashboard-content scrollable-content">
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

// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import Header from "../components/Header";
// import CircleSidebar from "../components/CircleSidebar";
// import { dashboardApi } from "../api";
// import "../style/circledashboard.css";

// interface CircleDashboardData {
//   year: number;
//   circle_id: number;
//   divisionsCount: number;
//   branchesCount: number;
// }

// const CircleDashboard: React.FC = () => {
//   const [data, setData] = useState<CircleDashboardData | null>(null);

//   // Get token & user from Redux
//   const token = useSelector((state: any) => state.auth.token);
//   const user = useSelector((state: any) => state.auth.user);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result = await dashboardApi.getCircleDashboard(token);
//         setData(result as CircleDashboardData);
//       } catch (error) {
//         console.error("Error loading circle dashboard:", error);
//       }
//     };
//     fetchData();
//   }, [token, user]);

//   if (!data) return <p className="loading-text">Loading Circle Dashboard...</p>;

//   return (
//     <div className="circle-dashboard">
//       {/* Fixed Header */}
//       <div className="fixed-header">
//         <Header />
//       </div>

//       <div className="dashboard-layout">
//         {/* Sidebar */}
//         <CircleSidebar />

//         {/* Content */}
//         <div className="dashboard-content scrollable-content">
//           {/* Welcome Section just below header */}
//           <div className="welcome-section">
//             <h2>Welcome, {user?.manager_name}</h2>
//             <p>Last logged in on {new Date().toLocaleDateString()}</p>
//           </div>

//           {/* Summary statistics */}
//           <div className="summary-stats">
//             <div className="stat-card">
//               <div className="stat-number">{data.divisionsCount}</div>
//               <div className="stat-label">Total Divisions</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-number">{data.branchesCount}</div>
//               <div className="stat-label">Total Branches</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CircleDashboard;
