import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  X, Home, Users, FileText, Settings, 
  BarChart3, Building, MapPin, UserCheck, 
  Shield, Bell, Calendar, PieChart 
} from 'lucide-react';
import "./style/sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: any) => state.auth.user);

  const userRole = user?.role || 'branch'; // branch | division
  const basePath = userRole === 'division' ? '/division-dashboard' : '/branch-dashboard';

  // ✅ Navigation items with role-based paths
  const getNavigationItems = (role: 'division' | 'branch'): NavigationItem[] => {
    const commonItems: NavigationItem[] = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, path: `${basePath}` },
      { id: 'profile', label: 'Profile', icon: UserCheck, path: `${basePath}/profile` },
    ];

    if (role === 'division') {
      return [
        ...commonItems,
        { id: 'branches', label: 'Branch Management', icon: Building, path: `${basePath}/branches` },
        { id: 'users', label: 'User Management', icon: Users, path: `${basePath}/users` },
        { id: 'reports', label: 'Reports', icon: FileText, path: `${basePath}/reports` },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, path: `${basePath}/analytics` },
        { id: 'locations', label: 'Locations', icon: MapPin, path: `${basePath}/locations` },
        { id: 'notifications', label: 'Notifications', icon: Bell, path: `${basePath}/notifications` },
        { id: 'calendar', label: 'Calendar', icon: Calendar, path: `${basePath}/calendar` },
        { id: 'admin', label: 'Admin Panel', icon: Shield, path: `${basePath}/admin` },
        { id: 'settings', label: 'Settings', icon: Settings, path: `${basePath}/settings` },
      ];
    } else {
      return [
        ...commonItems,
        { id: 'local-reports', label: 'Local Reports', icon: FileText, path: `${basePath}/local-reports` },
        { id: 'local-analytics', label: 'Branch Analytics', icon: PieChart, path: `${basePath}/local-analytics` },
        { id: 'calendar', label: 'Calendar', icon: Calendar, path: `${basePath}/calendar` },
        { id: 'settings', label: 'Settings', icon: Settings, path: `${basePath}/settings` },
      ];
    }
  };

  const navigationItems = getNavigationItems(userRole);

  const handleNavigation = (item: NavigationItem) => {
    navigate(item.path);
    onClose(); // auto-close sidebar on mobile
  };

  // Close sidebar on outside click (mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('.sidebar') && !target.closest('.hamburger-btn')) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div className="brand-text">
              <h2 className="brand-title">
                {userRole === 'division' ? 'Division Panel' : 'Branch Panel'}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="sidebar-close-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className={`nav-icon ${isActive ? 'active' : ''}`} />
                <span className="nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <UserCheck className="w-4 h-4 text-gray-600" />
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name || 'John Doe'}</p>
              <p className="user-role">{userRole} User</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
