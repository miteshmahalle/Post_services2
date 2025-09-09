import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./style/navigation.css";
import { 
  Building2, 
  ChevronRight, 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  BarChart3, 
  User,
  BookOpen,
  Clock,
  LifeBuoy,
  HelpCircle
} from "lucide-react";

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // Define navItems array
  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/branch-dashboard" },
    { name: "View Profile", icon: <PlusCircle size={18} />, path: "/view/profile" },
    { name: "Edit Profile", icon: <FileText size={18} />, path: "/edit/profile" },
    { name: "Change Password", icon: <BarChart3 size={18} />, path: "/change-password" },

  ];

  // Define supportItems array
  const supportItems = [
    { name: "Guidelines", icon: <BookOpen size={18} />, path: "/guidelines" },
    { name: "Deadlines", icon: <Clock size={18} />, path: "/deadlines" },
    { name: "Support", icon: <LifeBuoy size={18} />, path: "/support" },
    { name: "FAQ", icon: <HelpCircle size={18} />, path: "/faq" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose(); // Close the navigation after clicking
  };

  return (
    <div className="modern-sidebar">
      {/* Brand Section */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Building2 size={24} />
        </div>
        <h2 className="brand-title">Branch</h2>
      </div>

      {/* Main Navigation */}
      <div className="nav-content">
        <div className="nav-group">
          <h3 className="nav-group-title">Main Menu</h3>
          <nav className="nav-list">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                <div className="nav-link-content">
                  <div className="nav-icon">{item.icon}</div>
                  <span className="nav-text">{item.name}</span>
                </div>
                <ChevronRight size={16} className="nav-arrow" />
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Support Section */}
        <div className="nav-group">
          <h3 className="nav-group-title">Support</h3>
          <nav className="nav-list">
            {supportItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link support-link ${isActive ? "support-link-active" : ""}`
                }
              >
                <div className="nav-link-content">
                  <div className="nav-icon">{item.icon}</div>
                  <span className="nav-text">{item.name}</span>
                </div>
                <ChevronRight size={16} className="nav-arrow" />
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="footer-content">
          <div className="status-indicator"></div>
          <span className="status-text">Online</span>
        </div>
      </div>
    </div>
  );
};

export default Navigation;