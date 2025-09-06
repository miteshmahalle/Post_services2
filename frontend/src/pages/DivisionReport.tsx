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
  BarChart3,
  Building
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

interface ReportResponse {
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

const DivisionDashboard: React.FC = () => {
  const [divisionData, setDivisionData] = useState<YearlyAverage[] | null>(null);
  const [branchData, setBranchData] = useState<YearlyAverage[] | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const token = useSelector((state: any) => state.auth.token);
  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        // Fetch both reports
        const [divisionResult, branchResult] = await Promise.all([
          divisionDashboard.getDivisionReport(token) as Promise<ReportResponse>,
          divisionDashboard.getBranchReport(token) as Promise<ReportResponse>
        ]);
        
        console.log("Division Report API Response:", divisionResult);
        console.log("Branch Report API Response:", branchResult);
        
        setDivisionData(divisionResult.averages);
        setBranchData(branchResult.averages);
        
        // Set the selected year to the most recent year by default
        if (divisionResult.averages && divisionResult.averages.length > 0) {
          const years = divisionResult.averages.map(item => item.year);
          const mostRecentYear = Math.max(...years);
          setSelectedYear(mostRecentYear);
        }
      } catch (error) {
        console.error("Error loading reports:", error);
      }
    };
    fetchData();
  }, [token, user?.division_id]);

  const metricConfig: MetricConfig[] = [
    {
      key: 'avg_energy_bill',
      title: 'Energy Bill',
      icon: TrendingUp,
      color: '#22c55e',
      unit: '₹',
      format: (value) => new Intl.NumberFormat().format(parseInt(value.toFixed(0)))
    },
    {
      key: 'avg_water_litres',
      title: 'Water Usage',
      icon: Droplets,
      color: '#06b6d4',
      unit: 'L',
      format: (value) => new Intl.NumberFormat().format(parseInt(value.toFixed(0)))
    },
    {
      key: 'avg_energy_kwh',
      title: 'Energy Usage',
      icon: Zap,
      color: '#eab308',
      unit: 'kWh',
      format: (value) => new Intl.NumberFormat().format(parseInt(value.toFixed(0)))
    },
    {
      key: 'avg_fuel_litres',
      title: 'Fuel Consumption',
      icon: Car,
      color: '#3b82f6',
      unit: 'L',
      format: (value) => new Intl.NumberFormat().format(parseInt(value.toFixed(0)))
    },
    {
      key: 'avg_paper_reams',
      title: 'Paper Usage',
      icon: FileText,
      color: '#a855f7',
      unit: 'reams',
      format: (value) => value.toFixed(0)
    },
    {
      key: 'avg_training_hours',
      title: 'Training Hours',
      icon: Clock,
      color: '#6366f1',
      unit: 'hrs',
      format: (value) => value.toFixed(0)
    },
    {
      key: 'avg_waste_kg',
      title: 'Waste Generated',
      icon: Trash2,
      color: '#f97316',
      unit: 'kg',
      format: (value) => new Intl.NumberFormat().format(parseInt(value.toFixed(0)))
    },
    {
      key: 'avg_complaints_count',
      title: 'Complaints',
      icon: AlertTriangle,
      color: '#ef4444',
      unit: '',
      format: (value) => value.toFixed(0)
    }
  ];

  // Get unique years from division data
  const availableYears = divisionData 
    ? Array.from(new Set(divisionData.map(item => item.year))).sort((a, b) => b - a)
    : [];
  
  // Get data for selected year
  const divisionYearData = divisionData 
    ? divisionData.find(item => item.year === selectedYear) || divisionData[0]
    : null;
    
  const branchYearData = branchData 
    ? branchData.find(item => item.year === selectedYear) || (branchData.length > 0 ? branchData[0] : null)
    : null;

  if (!divisionData || !branchData) {
    return (
    <div className="loader-container">
      <div className="loader"></div>
      <p className="loading-text">Loading Division Report...</p>
    </div>
  );
  }

  return (
    <div className="division-dashboard">
      {/* Fixed Header */}
      <div className="fixed-header">
        <Header />
      </div>

      {/* Blue Header */}
      <nav className="blue_header">
        <div className="nav-text">
          <h2>Sustainability Reports</h2>
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
            <h2>Welcome, {user?.manager_name}</h2>
            <p>
              Sustainability performance data for{" "}
              <b>{user?.division_name}</b>
            </p>
            
            {/* Year selector */}
            {availableYears.length > 1 && (
              <div className="year-selector">
                <label htmlFor="year-select">Select Year: </label>
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

          <div className="reports-container">
            {/* Division Report Section */}
            <div className="report-section">
              <div className="report-header">
                <BarChart3 size={24} />
                <h3>Yearly Division Report</h3>
              </div>
              
              {divisionYearData && (
                <div className="metrics-grid">
                  {metricConfig.map((metric) => {
                    const IconComponent = metric.icon;
                    const value = parseFloat(divisionYearData[metric.key]);
                    
                    return (
                      <div key={`division-${metric.key}`} className="metric-card">
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
                        <div className="metric-year">Year: {divisionYearData.year}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Branch Report Section */}
            <div className="report-section">
              <div className="report-header">
                <Building size={24} />
                <h3>Yearly Branch Report</h3>
              </div>
              
              {branchYearData ? (
                <div className="metrics-grid">
                  {metricConfig.map((metric) => {
                    const IconComponent = metric.icon;
                    const value = parseFloat(branchYearData[metric.key]);
                    
                    return (
                      <div key={`branch-${metric.key}`} className="metric-card">
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
                        <div className="metric-year">Year: {branchYearData.year}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-data-message">
                  <p>No branch data available for the selected year.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DivisionDashboard;