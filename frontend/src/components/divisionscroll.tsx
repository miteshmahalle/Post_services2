import React, { useState, useEffect } from 'react';
import { TrendingUp, Zap, Droplets, FileText, Trash2, Clock, AlertTriangle, Car } from 'lucide-react';
import './style/DivisionScroll.css';
import { useSelector } from 'react-redux';
import { divisionDashboard } from '../api';

interface DivisionScroll {
  averages: {
    avg_complaints_count: string;
    avg_energy_bill: string;
    avg_energy_kwh: string;
    avg_fuel_litres: string;
    avg_paper_reams: string;
    avg_training_hours: string;
    avg_waste_kg: string;
    avg_water_litres: string;
  };
  division_id: number;
}

interface MetricConfig {
  key: keyof DivisionScroll['averages'];
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  unit: string;
  format: (value: string) => string;
}

const DivisionScroll: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DivisionScroll | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const token = useSelector((state: any) => state.auth.token);
  
  // Configuration for each metric with icons and formatting
  const metricConfig: MetricConfig[] = [
    {
      key: 'avg_complaints_count',
      title: 'Complaints',
      icon: AlertTriangle,
      color: 'red',
      unit: '',
      format: (value) => value
    },
    {
      key: 'avg_energy_bill',
      title: 'Energy Bill',
      icon: TrendingUp,
      color: 'green',
      unit: '$',
      format: (value) => new Intl.NumberFormat().format(parseInt(value))
    },
    {
      key: 'avg_energy_kwh',
      title: 'Energy Usage',
      icon: Zap,
      color: 'yellow',
      unit: 'kWh',
      format: (value) => new Intl.NumberFormat().format(parseInt(value))
    },
    {
      key: 'avg_fuel_litres',
      title: 'Fuel Consumption',
      icon: Car,
      color: 'blue',
      unit: 'L',
      format: (value) => new Intl.NumberFormat().format(parseInt(value))
    },
    {
      key: 'avg_paper_reams',
      title: 'Paper Usage',
      icon: FileText,
      color: 'purple',
      unit: 'reams',
      format: (value) => value
    },
    {
      key: 'avg_training_hours',
      title: 'Training Hours',
      icon: Clock,
      color: 'indigo',
      unit: 'hrs',
      format: (value) => value
    },
    {
      key: 'avg_waste_kg',
      title: 'Waste Generated',
      icon: Trash2,
      color: 'orange',
      unit: 'kg',
      format: (value) => new Intl.NumberFormat().format(parseInt(value))
    },
    {
      key: 'avg_water_litres',
      title: 'Water Usage',
      icon: Droplets,
      color: 'cyan',
      unit: 'L',
      format: (value) => new Intl.NumberFormat().format(parseInt(value))
    }
  ];

  // Auto-scroll effect
  useEffect(() => {
    if (!dashboardData) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex + 4 >= metricConfig.length ? 0 : prevIndex + 4
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [dashboardData]);

  // Manual navigation
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 4 >= metricConfig.length ? 0 : prevIndex + 4
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 4 < 0 ? Math.max(0, metricConfig.length - 4) : prevIndex - 4
    );
  };

  // Fetch data from API
  const fetchDashboardData = async () => {
    if (!token) {
      setError('Authentication token not available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await divisionDashboard.getAverage(token, 'column');
      setDashboardData(response as DivisionScroll);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load division data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <p>Loading division metrics...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!dashboardData) {
    return (
      <div className="dashboard-container">
        <div className="no-data-state">
          <p>No division data available</p>
        </div>
      </div>
    );
  }

  const visibleCards = metricConfig.slice(currentIndex, currentIndex + 4);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Division Dashboard</h1>
      </div>

      {/* Cards Container */}
      <div className="cards-wrapper">
        <div className="cards-container">
          {visibleCards.map((config, index) => {
            const IconComponent = config.icon;
            const value = dashboardData.averages[config.key];
            
            return (
              <div
                key={config.key}
                className={`card card-${config.color}`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="card-header">
                  <div className={`icon-container icon-${config.color}`}>
                    <IconComponent className="icon" />
                  </div>
                  <div className="value-container">
                    <p className="card-value">
                      {config.unit === '$' ? config.unit : ''}{config.format(value)}{config.unit !== '$' ? ` ${config.unit}` : ''}
                    </p>
                  </div>
                </div>
                <h3 className="card-title">{config.title}</h3>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill progress-${config.color}`}
                    style={{ width: `${Math.min(100, (parseInt(value) / 1000) * 10)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="navigation-controls">
          <button onClick={goToPrev} className="nav-button">
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Progress Dots */}
          <div className="progress-dots">
            {Array.from({ length: Math.ceil(metricConfig.length / 4) }).map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${
                  Math.floor(currentIndex / 4) === index ? 'active' : ''
                }`}
              />
            ))}
          </div>

          <button onClick={goToNext} className="nav-button">
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DivisionScroll;