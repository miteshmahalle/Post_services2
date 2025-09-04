import React from "react";
import { useNavigate } from "react-router-dom";
import "./style/navigation.css";

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose(); // Close the navigation after clicking
  };

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
              <li>
                <button onClick={() => handleNavigation("/view/profile")}>
                  View Profile
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation("/edit/profile")}>
                  Edit Profile
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation("/change-password")}>
                  Change Password
                </button>
              </li>
            </ul>
          </div>
          
          <div className="nav-section">
            <h4>Reports</h4>
            <ul>
              <li>
                <button onClick={() => handleNavigation("/reports/current")}>
                  Current Reports
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation("/reports/previous")}>
                  Previous Reports
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation("/reports/download")}>
                  Download Reports
                </button>
              </li>
            </ul>
          </div>
          
          <div className="nav-section">
            <h4>Important Links</h4>
            <ul>
              <li>
                <button onClick={() => handleNavigation("/guidelines")}>
                  Guidelines
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation("/deadlines")}>
                  Deadlines
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation("/support")}>
                  Support
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation("/faq")}>
                  FAQ
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;