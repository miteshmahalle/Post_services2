// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import Login from "./pages/login";
import Navbar from "./components/navbar";

// Import dashboards
import BranchDashboard from "./pages/BranchDashboard";
import BranchESGForm from "./pages/BranchESGForm"; // ✅ NEW Import
import DivisionDashboard from "./pages/DivisionDashboard";
import CircleDashboard from "./pages/CircleDashboard";

// Protected Route wrapper
const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/branch-dashboard"
          element={
            <PrivateRoute>
              <BranchDashboard/>
            </PrivateRoute>
          }
        />

        {/* ✅ NEW: Branch ESG Form Route */}
        <Route
          path="/branch-esg-form"
          element={
            <PrivateRoute>
              <BranchESGForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/division-dashboard"
          element={
            <PrivateRoute>
              <DivisionDashboard
              />
            </PrivateRoute>
          }
        />

        <Route
          path="/circle-dashboard"
          element={
            <PrivateRoute>
              <CircleDashboard
                currentYear={new Date().getFullYear()}
                username=""
                role="circle"
                branchesCount={0}
                stats={{
                  avg_energy_kwh: 0,
                  total_energy_bill: 0,
                  total_training_hours: 0,
                }}
                months={[]}
                branches={[]}
              />
            </PrivateRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;