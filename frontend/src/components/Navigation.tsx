import React from "react";
import "./style/navigation.css";

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="nav-overlay" onClick={onClose}></div>}
      
      {/* Side Navigation */}
      <div className={`side-navigation ${isOpen ? "open" : ""}`}>
        <div className="nav-header">
          <h3>Menu</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="nav-content">
          <div className="nav-section">
            <h4>Profile</h4>
            <ul>
              <li><a href="#profile">View Profile</a></li>
              <li><a href="#edit-profile">Edit Profile</a></li>
              <li><a href="#change-password">Change Password</a></li>
            </ul>
          </div>
          
          <div className="nav-section">
            <h4>Reports</h4>
            <ul>
              <li><a href="#current-reports">Current Reports</a></li>
              <li><a href="#previous-reports">Previous Reports</a></li>
              <li><a href="#download-reports">Download Reports</a></li>
            </ul>
          </div>
          
          <div className="nav-section">
            <h4>Important Links</h4>
            <ul>
              <li><a href="#guidelines">Guidelines</a></li>
              <li><a href="#deadlines">Deadlines</a></li>
              <li><a href="#support">Support</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;