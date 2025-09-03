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
      {/* Logo and India Post Text */}
      <div className="header-logo-section">
        <img src={logo} alt="India Post Logo" className="header-logo" />
        <div className="header-logo-text">
          <h2>भारतीय डाक</h2>
          <p>India Post</p>
        </div>
      </div>

      {/* Center Title */}
      <div className="header-title-section">
        <h1>BRSR Report for Postal Services</h1>
        <p>Government of India • Department of Posts</p>
      </div>

      {/* Branch Info and Logout */}
      <div className="header-actions">
        <div className="branch-info">
          <span className="branch-name">{user?.branch_name}</span>
          <div className="branch-details">
            <p><strong>Manager:</strong> {user?.manager_name}</p>
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Phone:</strong> {user?.phone}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Address:</strong> {user?.address}</p>
          </div>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;