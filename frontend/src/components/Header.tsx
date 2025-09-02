import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import "./style/Header.css"; 
import logo from "../images/India-Post-Color.png";

const Header: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="app-header">
      {/* Left Section (Text + Logo) */}
      <div className="govt-header-section">
        <img src={logo} alt="India Post Logo" className="india-post-logo" />
        <div className="govt-header-text">
          <h2>भारतीय डाक</h2>
          <p>India Post</p>
        </div>
      </div>

      {/* Center Section (Main Title + Subtitle) */}
      <div className="header-center">
        <h1 className="header-title">BRSR Report for Postal Services</h1>
        <p className="header-subtitle">Government of India • Department of Posts</p>
      </div>

      {/* Right Section (Branch + Logout) */}
      <div className="header-right">
        <div className="branch-info">
          <span className="branch-name">{user?.branch_name}</span>
          <div className="branch-details-card">
            <p><strong>Manager:</strong> {user?.manager_name}</p>
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Phone:</strong> {user?.phone}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Address:</strong> {user?.address}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
