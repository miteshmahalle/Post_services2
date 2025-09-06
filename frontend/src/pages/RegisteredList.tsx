// src/pages/RegisteredList.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { branchApi, BranchesResponse, Branch } from "../api"; // Import the correct types
import "../style/registered_list.css";
import logo from "../images/India-Post-Color.png";
import DivisionSidebar from "../components/divisionsidebar";
import Header from "../components/Header";

const RegisteredList: React.FC = () => {
  const navigate = useNavigate();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Add this null check
      if (!token) {
        throw new Error("Authentication token not available");
      }
      
      // Use the correct type: BranchesResponse (not Branch)
      const response: BranchesResponse = await branchApi.getBranchesList(token);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setBranches(response.branches || []);
    } catch (err: any) {
      setError(err.message || "Error fetching branches");
    } finally {
      setLoading(false);
    }
  };

  const getHeaderText = () => {
    if (user?.role === "division") return "Registered Branches";
    if (user?.role === "circle") return "Registered Divisions";
    return "Registered List";
  };

  const getButtonText = () => {
    if (user?.role === "division") return "Add Branch";
    if (user?.role === "circle") return "Add Division";
    return "Add New";
  };

  const handleAddButtonClick = () => {
    if (user?.role === "division") navigate("/add-branch");
    // For circle, you might want to navigate to a different route for adding divisions
    else if (user?.role === "circle") navigate("/add-branch");
  };

  const handleBackButtonClick = () => {
    if (user?.role === "division") navigate("/division-dashboard");
    else if (user?.role === "circle") navigate("/circle-dashboard");
  };

  if (loading) {
    return (
      <div className="registered-list-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }
  return (
    <div className="registered-list-container">


      <div className="fixed-header">
        <Header />
      </div>

    
      <nav className="blue_header">
        <div className="nav-text">
        <h2> Division Dashboard for {user?.manager_name}</h2> 
        </div>
      </nav> 

      <div className="dashboard-layout">
        {/* Fixed Sidebar */}
        <div className="fixed-sidebar">
          <DivisionSidebar />
        </div>


      <div className="registered-list-card">
        <div className="registered-list-header">
          <div className="action-buttons">
          <button 
            className="add-button"
            onClick={handleAddButtonClick}
          >
            {getButtonText()}
          </button>
        </div>
          <div className="logo-container">
            <img src={logo} alt="India Post Logo" className="logo" />
          </div>
          <h2>{getHeaderText()}</h2>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="table-container">
          <table className="branches-table">
            <thead>
              <tr>
                <th>Branch ID</th>
                <th>Branch Code</th>
                <th>Branch Name</th>
                <th>Manager Name</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {branches.length === 0 ? (
                <tr>
                  <td colSpan={5} className="no-data">
                    No {user?.role === "division" ? "branches" : "divisions"} found
                  </td>
                </tr>
              ) : (
                branches.map((branch) => (
                  <tr key={branch.branch_id}>
                    <td>{branch.branch_id}</td>
                    <td>{branch.branch_code}</td>
                    <td>{branch.branch_name}</td>
                    <td>{branch.manager_name || "N/A"}</td>
                    <td>{branch.phone || "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
    </div>
  );
};

export default RegisteredList;