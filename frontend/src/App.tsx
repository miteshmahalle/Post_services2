// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store";
import { logout } from "./slices/authSlice"; // Import logout action

// Pages
import Login from "./pages/login";
import Homepage from "./pages/Homepage";
import BranchDashboard from "./pages/BranchDashboard";
import BranchESGForm from "./pages/BranchESGForm";
import DivisionESGForm from "./pages/DivisionESGForm";
import DivisionDashboard from "./pages/DivisionDashboard";
import CircleDashboard from "./pages/CircleDashboard";
import ProfileView from "./pages/ProfileView";
import ProfileEdit from "./pages/ProfileEdit";
import Add_branch from "./pages/Add_branch";
import RegisteredList from "./pages/RegisteredList"; // Import the RegisteredList component

// Protected Route wrapper
const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return token && isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Optional: Clear authentication on app load if you want fresh login every time
  useEffect(() => {
    // Uncomment the line below if you want to force logout on app start
    // dispatch(logout());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public HomePage (default route) */}
        <Route path="/Homepage" element={<Homepage />} />
      
        {/* Public Login */}
        <Route path="/login" element={<Login />} />

        {/* Private dashboards - only accessible when authenticated */}
        <Route
          path="/branch-dashboard/*"
          element={
            <PrivateRoute>
              <BranchDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/branch-esg-form"
          element={
            <PrivateRoute>
              <BranchESGForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/division-esg-form"
          element={
            <PrivateRoute>
              <DivisionESGForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/division-dashboard/*"
          element={
            <PrivateRoute>
              <DivisionDashboard
              />
            </PrivateRoute>
          }
        />
   
        <Route
          path="/view/profile"
          element={
            <PrivateRoute>
              <ProfileView
              />
            </PrivateRoute>
          }
        />

         {/* Add the RegisteredList route with PrivateRoute */}
        <Route 
          path="/registered-list" 
          element={
            <PrivateRoute>
              <RegisteredList />
            </PrivateRoute>
          }
        />
          
        <Route 
          path="/add-branch" 
          element={
            <PrivateRoute>
             <Add_branch
             />
            </PrivateRoute>
          }
        />
          
        <Route
          path="/edit/profile"
          element={
            <PrivateRoute>
              <ProfileEdit
              />
            </PrivateRoute>
          }
        />

        <Route
          path="/circle-dashboard/*"
          element={
            <PrivateRoute>
              <CircleDashboard/>
            </PrivateRoute>
          }
        />

        {/* Catch all -> redirect to homepage */}
        <Route path="*" element={<Navigate to="/Homepage" replace />} />
      </Routes>
    </Router>
  );
}

export default App;