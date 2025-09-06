// src/components/CircleSidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Building2 } from "lucide-react"; 
import {
  User,
  PlusCircle,
  BookOpen,
  Clock,
  LifeBuoy,
  HelpCircle
} from "lucide-react";
import "./style/circlesidebar.css";

const CircleSidebar: React.FC = () => {
  const navItems = [
    { name: "Profile", icon: <User size={18} />, path: "/view/profile" },
    { name: "Add Division", icon: <PlusCircle size={18} />, path: "/registered-list" },
  ];

  const supportItems = [
    { name: "Guidelines", icon: <BookOpen size={18} />, path: "/guidelines" },
    { name: "Deadlines", icon: <Clock size={18} />, path: "/deadlines" },
    { name: "Support", icon: <LifeBuoy size={18} />, path: "/support" },
    { name: "FAQ", icon: <HelpCircle size={18} />, path: "/faq" },
  ];

  return (
    <div className="sidebar">
      {/* Sidebar Header */}
      {/* <div className="sidebar-header">Circle</div> */}
      <div className="sidebar-header">
  <Building2 size={22} style={{ marginRight: "8px" }} />
     Circle
    </div>

      {/* Main Menu */}
      <div className="nav-section">
        <div className="menu-label">MAIN MENU</div>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item-active" : ""}`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Support Section */}
      <div className="support-section">
        <div className="menu-label">SUPPORT</div>
        {supportItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `support-item ${isActive ? "support-item-active" : ""}`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default CircleSidebar;
