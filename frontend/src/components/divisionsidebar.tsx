// src/components/DivisionSidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  User,
  PlusCircle,
  FileText,
  Building2,
  BookOpen,
  Clock,
  LifeBuoy,
  HelpCircle,
  ChevronRight,
  LayoutDashboard
} from "lucide-react";
import "./style/divisionsidebar.css";

const DivisionSidebar: React.FC = () => {
  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/division-dashboard" },
    { name: "Add Branch", icon: <PlusCircle size={20} />, path: "/registered-list" },
    { name: "BRSR Report", icon: <FileText size={20} />, path: "/brsr-report" },
    { name: "Division Report", icon: <Building2 size={20} />, path: "/division-report" },
    { name: "Profile", icon: <User size={20} />, path: "/view/profile" },
  ];

  const supportItems = [
    { name: "Guidelines", icon: <BookOpen size={20} />, path: "/guidelines" },
    { name: "Deadlines", icon: <Clock size={20} />, path: "/deadlines" },
    { name: "Support", icon: <LifeBuoy size={20} />, path: "/support" },
    { name: "FAQ", icon: <HelpCircle size={20} />, path: "/faq" },
    { name: "Guidelines", icon: <BookOpen size={20} />, path: "/guidelines" },
    { name: "Deadlines", icon: <Clock size={20} />, path: "/deadlines" },
    { name: "Support", icon: <LifeBuoy size={20} />, path: "/support" },
    { name: "FAQ", icon: <HelpCircle size={20} />, path: "/faq" },
  ];

  return (
    <div className="modern-sidebar">
      {/* Brand Section */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Building2 size={24} />
        </div>
        <h2 className="brand-title">Division</h2>
      </div>
    <div className="modern-sidebar">
      {/* Brand Section */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Building2 size={24} />
        </div>
        <h2 className="brand-title">Division</h2>
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

export default DivisionSidebar;