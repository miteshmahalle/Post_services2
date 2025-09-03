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
  HelpCircle
} from "lucide-react";
import "./style/divisionsidebar.css";

const DivisionSidebar: React.FC = () => {
  const navItems = [
    { name: "Profile", icon: <User size={18} />, path: "/division-profile" },
    { name: "Add Branch", icon: <PlusCircle size={18} />, path: "/add-branch" },
    { name: "Division Report", icon: <FileText size={18} />, path: "/division-report" },
    { name: "Branch Report", icon: <Building2 size={18} />, path: "/branch-report" },
  ];

  const supportItems = [
    { name: "Guidelines", icon: <BookOpen size={18} />, path: "/guidelines" },
    { name: "Deadlines", icon: <Clock size={18} />, path: "/deadlines" },
    { name: "Support", icon: <LifeBuoy size={18} />, path: "/support" },
    { name: "FAQ", icon: <HelpCircle size={18} />, path: "/faq" },
  ];

  return (
    <div className="sidebar">
      {/* Top Section */}
      <div>
        <div className="sidebar-header">Division Dashboard</div>

        <nav className="nav-section">
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
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="support-section">
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

export default DivisionSidebar;
