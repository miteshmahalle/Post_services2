// src/pages/BRSRReport.tsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import DivisionSidebar from "../components/divisionsidebar";
import { divisionDashboard } from "../api";
import "../style/divisiondashboard.css";

// Import icons
import { 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  Car, 
  FileText, 
  Clock, 
  Trash2, 
  Droplets, 
  Target,
  BarChart3
} from "lucide-react";

interface YearlyAverage {
  avg_complaints_count: string;
  avg_energy_bill: string;
  avg_energy_kwh: string;
  avg_fuel_litres: string;
  avg_paper_reams: string;
  avg_training_hours: string;
  avg_waste_kg: string;
  avg_water_litres: string;
  year: number;
}

interface BRSRReportResponse {
  averages: YearlyAverage[];
  division_id: number;
}

interface MetricConfig {
  key: keyof Omit<YearlyAverage, 'year'>;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  unit: string;
  format: (value: number) => string;
}

const BRSRReport: React.FC = () => {
  const [data, setData] = useState<YearlyAverage[] | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const token = useSelector((state: any) => state.auth.token);
  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const result = await divisionDashboard.getDivisionBRSRReport(token) as BRSRReportResponse;
        console.log("BRSR Report API Response:", result);
        
        setData(result.averages);
        
        // Set the selected year to the most recent year by default
        if (result.averages && result.averages.length > 0) {
          const years = result.averages.map(item => item.year);
          const mostRecentYear = Math.max(...years);
          setSelectedYear(mostRecentYear);
        }
      } catch (error) {
        console.error("Error loading BRSR report:", error);
      }
    };
    fetchData();
  }, [token]);

  const metricConfig: MetricConfig[] = [
    {
      key: 'avg_energy_bill',
      title: 'Energy Bill',
      icon: TrendingUp,
      color: '#22c55e',
      format: (value) => new Intl.NumberFormat().format(parseInt(value.toFixed(0))),
      unit: '₹',
    },
    {
      key: 'avg_water_litres',
      title: 'Water Usage',
      icon: Droplets,
      color: '#06b6d4',
      format: (value) => new Intl.NumberFormat().format(parseInt(value.toFixed(0))),
      unit: 'L'
    },
    {
      key: 'avg_energy_kwh',
      title: 'Energy Usage',
      icon: Zap,
      color: '#eab308',
      format: (value) => new Intl.NumberFormat().format(parseInt(value.toFixed(0))),
      unit: 'kWh',
    },
    {
      key: 'avg_fuel_litres',
      title: 'Fuel Consumption',
      icon: Car,
      color: '#3b82f6',
      format: (value) => new Intl.NumberFormat().format(parseInt(value.toFixed(0))),
      unit: 'L',
    },
    {
      key: 'avg_paper_reams',
      title: 'Paper Usage',
      icon: FileText,
      color: '#a855f7',
      format: (value) => value.toFixed(0),
      unit: 'reams',
    },
    {
      key: 'avg_training_hours',
      title: 'Training Hours',
      icon: Clock,
      color: '#6366f1',
      format: (value) => value.toFixed(0),
      unit: 'hrs',
    },
    {
      key: 'avg_waste_kg',
      title: 'Waste Generated',
      icon: Trash2,
      color: '#f97316',
      format: (value) => new Intl.NumberFormat().format(parseInt(value.toFixed(0))),
      unit: 'kg',
    },
    {
      key: 'avg_complaints_count',
      title: 'Complaints',
      icon: AlertTriangle,
      color: '#ef4444',
      format: (value) => value.toFixed(0),
      unit: '',
    },
  ];

  if (!data) {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p className="loading-text">Loading BRSR Report...</p>
    </div>
  );
}


  // Get unique years from data
  const availableYears = Array.from(new Set(data.map(item => item.year))).sort((a, b) => b - a);
  
  // Get data for selected year
  const yearData = data.find(item => item.year === selectedYear) || data[0];

  return (
    <div className="division-dashboard">
      {/* Fixed Header */}
      <div className="fixed-header">
        <Header />
      </div>

      {/* Blue Header */}
      <nav className="blue_header">
        <div className="nav-text">
          <h2>BRSR Report for {user?.manager_name}</h2>
        </div>
      </nav>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <div className="fixed-sidebar">
          <DivisionSidebar />
        </div>

        {/* Content */}
        <div className="dashboard-content scrollable-content">
          <div className="welcome-section">
            <div className="report-header">
              <div>
                <h2>Welcome, {user?.manager_name}</h2>
              </div>
            </div>
            
            {/* Year selector */}
            {availableYears.length > 1 && (
              <div className="year-selector">
                <label htmlFor="year-select">Select Reporting Year: </label>
                <select 
                  id="year-select"
                  value={selectedYear || availableYears[0]}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="metrics-container">
            <div className="metrics-grid">
              {metricConfig.map((metric) => {
                const IconComponent = metric.icon;
                const value = parseFloat(yearData[metric.key]);
                
                return (
                  <div key={metric.key} className="metric-card">
                    <div className="metric-header">
                      <div className="metric-icon" style={{ backgroundColor: metric.color }}>
                        <IconComponent size={20} color="white" />
                      </div>
                      <h3 className="metric-title">{metric.title}</h3>
                    </div>
                    <div className="metric-value">
                      {metric.unit && <span className="value-unit">{metric.unit}</span>}
                      {metric.format(value)}
                    </div>
                    <div className="metric-year">Reporting Year: {yearData.year}</div>
                  </div>
                );
              })}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default BRSRReport;