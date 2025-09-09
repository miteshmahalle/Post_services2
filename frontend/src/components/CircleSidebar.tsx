// src/components/CircleSidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Building2, ChevronRight } from "lucide-react"; 
import {
  User,
  PlusCircle,
  BookOpen,
  Clock,
  LifeBuoy,
  HelpCircle,
  LayoutDashboard,
  Key
} from "lucide-react";
import "./style/circlesidebar.css";

const CircleSidebar: React.FC = () => {
  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/circle-dashboard" },
    { name: "Add Division", icon: <PlusCircle size={18} />, path: "/registered-list" },
    { name: "Change Password", icon: <Key size={18} />, path: "/change-password" },
    { name: "Profile", icon: <User size={18} />, path: "/view/profile" },
  ];

  const supportItems = [
    { name: "Guidelines", icon: <BookOpen size={18} />, path: "/guidelines" },
    { name: "Deadlines", icon: <Clock size={18} />, path: "/deadlines" },
    { name: "Support", icon: <LifeBuoy size={18} />, path: "/support" },
    { name: "FAQ", icon: <HelpCircle size={18} />, path: "/faq" },
  ];
return (
    <div className="modern-sidebar">
      {/* Brand Section */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Building2 size={24} />
        </div>
        <h2 className="brand-title">Circle</h2>
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

export default CircleSidebar;