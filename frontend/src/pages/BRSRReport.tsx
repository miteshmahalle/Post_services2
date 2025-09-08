// src/pages/BRSRReport.tsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import DivisionSidebar from "../components/divisionsidebar";
import { divisionDashboard, brsrReportApi } from "../api";
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
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [lastSubmissionDate, setLastSubmissionDate] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  
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
        
        // Check submission status
        await checkSubmissionStatus();
        
      } catch (error) {
        console.error("Error loading BRSR report:", error);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchData();
  }, [token]);

  const checkSubmissionStatus = async () => {
    if (!token || !user) return;
    
    try {
      const divisionId = user.division_id || user.branch_id;
      const statusResult = await brsrReportApi.checkSubmissionStatus(token, divisionId);
      
      if (statusResult.error) {
        console.error("Error checking submission status:", statusResult.error);
        return;
      }
      
      setHasSubmitted(statusResult.has_submitted);
      setLastSubmissionDate(statusResult.last_submission_date || null);
      
    } catch (error) {
      console.error("Error checking submission status:", error);
    }
  };

  const handleSubmitBRSRReport = async () => {
  if (!token || !data || !selectedYear || hasSubmitted) return;

  setSubmitting(true);
  setSubmitMessage("");

  try {
    // Find the data for the selected year
    const yearData = data.find(item => item.year === selectedYear);

    if (!yearData) {
      throw new Error("No data available for the selected year");
    }

    // ✅ Prepare the report data (now using reporting_month as DATE + avg_complaint_count)
    const reportData = {
      division_id: user.division_id || user.branch_id,
      division_brsr_report_yearly: [
        {
          reporting_month: `${selectedYear}-08-01`, // Example → 1st August of selected year
          avg_energy_kwh: parseFloat(yearData.avg_energy_kwh),
          avg_energy_bill: parseFloat(yearData.avg_energy_bill),
          avg_fuel_litres: parseFloat(yearData.avg_fuel_litres),
          avg_paper_reams: parseFloat(yearData.avg_paper_reams),
          avg_waste_kg: parseFloat(yearData.avg_waste_kg),
          avg_water_litres: parseFloat(yearData.avg_water_litres),
          avg_training_hours: parseFloat(yearData.avg_training_hours),
          avg_complaint_count: parseFloat(yearData.avg_complaints_count), // ✅ renamed
        },
      ],
    };

    const result = await brsrReportApi.submitBRSRReport(token, reportData);

    if (result.error) {
      throw new Error(result.error);
    }

    setSubmitMessage(`Report submitted successfully! Report ID: ${result.report_id}`);
    setHasSubmitted(true); // Prevent multiple submissions
  } catch (error: any) {
    console.error("Error submitting BRSR report:", error);
    setSubmitMessage(error.message || "Failed to submit report");
  } finally {
    setSubmitting(false);
  }
};


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
        <div className="scrollable-content">
          <div className="welcome-section">
            <div className="report-header">
              <div className="welcome-text">
                <h2>Welcome, {user?.manager_name}</h2>
                <p>Business Responsibility and Sustainability Report for {user?.division_name}</p>
                
                {/* Show submission status */}
                {hasSubmitted && (
                  <div className="submission-status submitted">
                    ✓ Report Already Submitted
                    {lastSubmissionDate && (
                      <span className="submission-date">
                        on {new Date(lastSubmissionDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                )}
                
                {!hasSubmitted && !loadingStatus && (
                  <div className="submission-status not-submitted">
                    ⚠️ Report Not Submitted Yet
                  </div>
                )}
              </div>
              
              {/* Updated button with status check */}
              <button 
                className="submit-brsr-btn"
                onClick={handleSubmitBRSRReport}
                disabled={submitting || !data || hasSubmitted || loadingStatus}
                title={hasSubmitted ? "Report already submitted" : ""}
              >
                {submitting ? "Submitting..." : 
                 hasSubmitted ? "Already Submitted" : 
                 "Submit BRSR Report"}
              </button> 
            </div>
            
            {/* Submit message display */}
            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes("success") ? "success" : "error"}`}>
                {submitMessage}
              </div>
            )}
            
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
 //src/pages/BRSRReport.tsx
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import Header from "../components/Header";
// import DivisionSidebar from "../components/divisionsidebar";
// import { divisionDashboard, brsrReportApi } from "../api";
// import "../style/divisiondashboard.css";

// // Import icons
// import { 
//   AlertTriangle, 
//   TrendingUp, 
//   Zap, 
//   Car, 
//   FileText, 
//   Clock, 
//   Trash2, 
//   Droplets, 
//   Target,
//   BarChart3
// } from "lucide-react";

// interface YearlyAverage {
//   avg_complaints_count: string;
//   avg_energy_bill: string;
//   avg_energy_kwh: string;
//   avg_fuel_litres: string;
//   avg_paper_reams: string;
//   avg_training_hours: string;
//   avg_waste_kg: string;
//   avg_water_litres: string;
//   year: number;
// }

// interface BRSRReportResponse {
//   averages: YearlyAverage[];
//   division_id: number;
// }

// interface MetricConfig {
//   key: keyof Omit<YearlyAverage, 'year'>;
//   title: string;
//   icon: React.ComponentType<any>;
//   color: string;
//   unit: string;
//   format: (value: number) => string;
// }

// const BRSRReport: React.FC = () => {
//   const [data, setData] = useState<YearlyAverage[] | null>(null);
//   const [selectedYear, setSelectedYear] = useState<number | null>(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [submitMessage, setSubmitMessage] = useState("");
//   const token = useSelector((state: any) => state.auth.token);
//   const user = useSelector((state: any) => state.auth.user);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!token) return;
//       try {
//         const result = await divisionDashboard.getDivisionBRSRReport(token) as BRSRReportResponse;
//         console.log("BRSR Report API Response:", result);
        
//         setData(result.averages);
        
//         // Set the selected year to the most recent year by default
//         if (result.averages && result.averages.length > 0) {
//           const years = result.averages.map(item => item.year);
//           const mostRecentYear = Math.max(...years);
//           setSelectedYear(mostRecentYear);
//         }
//       } catch (error) {
//         console.error("Error loading BRSR report:", error);
//       }
//     };
//     fetchData();
//   }, [token]);

//   const handleSubmitBRSRReport = async () => {
//     if (!token || !data || !selectedYear) return;
    
//     setSubmitting(true);
//     setSubmitMessage("");
    
//     try {
//       // Find the data for the selected year
//       const yearData = data.find(item => item.year === selectedYear);
      
//       if (!yearData) {
//         throw new Error("No data available for the selected year");
//       }
      
//       // Prepare the report data
//       const reportData = {
//         division_id: user.division_id || user.branch_id,
//         division_brsr_report_yearly: [{
//           year: selectedYear,
//           avg_energy_kwh: parseFloat(yearData.avg_energy_kwh),
//           avg_energy_bill: parseFloat(yearData.avg_energy_bill),
//           avg_fuel_litres: parseFloat(yearData.avg_fuel_litres),
//           avg_paper_reams: parseFloat(yearData.avg_paper_reams),
//           avg_waste_kg: parseFloat(yearData.avg_waste_kg),
//           avg_water_litres: parseFloat(yearData.avg_water_litres),
//           avg_training_hours: parseFloat(yearData.avg_training_hours),
//           avg_complaints_count: parseFloat(yearData.avg_complaints_count),
//         }]
//       };
      
//       const result = await brsrReportApi.submitBRSRReport(token, reportData);
      
//       if (result.error) {
//         throw new Error(result.error);
//       }
      
//       setSubmitMessage(`Report submitted successfully! Report ID: ${result.report_id}`);
      
//     } catch (error: any) {
//       console.error("Error submitting BRSR report:", error);
//       setSubmitMessage(error.message || "Failed to submit report");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const metricConfig: MetricConfig[] = [
//     {
//       key: 'avg_energy_bill',
//       title: 'Energy Bill',
//       icon: TrendingUp,
//       color: '#22c55e',
//       format: (value) => new Intl.NumberFormat().format(parseInt(value.toFixed(0))),
//       unit: '₹',
//     },
//     {
//       key: 'avg_water_litres',
//       title: 'Water Usage',
//       icon: Droplets,
//       color: '#06b6d4',
//       format: (value) => new Intl.NumberFormat().format(parseInt(value.toFixed(0))),
//       unit: 'L'
//     },
//     {
//       key: 'avg_energy_kwh',
//       title: 'Energy Usage',
//       icon: Zap,
//       color: '#eab308',
//       format: (value) => new Intl.NumberFormat().format(parseInt(value.toFixed(0))),
//       unit: 'kWh',
//     },
//     {
//       key: 'avg_fuel_litres',
//       title: 'Fuel Consumption',
//       icon: Car,
//       color: '#3b82f6',
//       format: (value) => new Intl.NumberFormat().format(parseInt(value.toFixed(0))),
//       unit: 'L',
//     },
//     {
//       key: 'avg_paper_reams',
//       title: 'Paper Usage',
//       icon: FileText,
//       color: '#a855f7',
//       format: (value) => value.toFixed(0),
//       unit: 'reams',
//     },
//     {
//       key: 'avg_training_hours',
//       title: 'Training Hours',
//       icon: Clock,
//       color: '#6366f1',
//       format: (value) => value.toFixed(0),
//       unit: 'hrs',
//     },
//     {
//       key: 'avg_waste_kg',
//       title: 'Waste Generated',
//       icon: Trash2,
//       color: '#f97316',
//       format: (value) => new Intl.NumberFormat().format(parseInt(value.toFixed(0))),
//       unit: 'kg',
//     },
//     {
//       key: 'avg_complaints_count',
//       title: 'Complaints',
//       icon: AlertTriangle,
//       color: '#ef4444',
//       format: (value) => value.toFixed(0),
//       unit: '',
//     },
//   ];

//   if (!data) {
//   return (
//     <div className="loader-container">
//       <div className="loader"></div>
//       <p className="loading-text">Loading BRSR Report...</p>
//     </div>
//   );
// }


//   // Get unique years from data
//   const availableYears = Array.from(new Set(data.map(item => item.year))).sort((a, b) => b - a);
  
//   // Get data for selected year
//   const yearData = data.find(item => item.year === selectedYear) || data[0];

//   return (
//     <div className="division-dashboard">
//       {/* Fixed Header */}
//       <div className="fixed-header">
//         <Header />
//       </div>

//       {/* Blue Header */}
//       <nav className="blue_header">
//         <div className="nav-text">
//           <h2>BRSR Report for {user?.manager_name}</h2>
//         </div>
//       </nav>

//       <div className="dashboard-layout">
//         {/* Sidebar */}
//         <div className="fixed-sidebar">
//           <DivisionSidebar />
//         </div>

//         {/* Content */}
//         <div className="scrollable-content">
//           <div className="welcome-section">
//             <div className="report-header">
//               <div>
//                 <h2>Welcome, {user?.manager_name}</h2>
//                 <p>Business Responsibility and Sustainability Report for {user?.division_name}</p>
//               </div>
//               {/* Updated button with onClick handler */}
//               <button 
//                 className="submit-brsr-btn"
//                 onClick={handleSubmitBRSRReport}
//                 disabled={submitting || !data}
//               >
//                 {submitting ? "Submitting..." : "Submit BRSR Report"}
//               </button> 
//             </div>
            
//             {/* Submit message display */}
//             {submitMessage && (
//               <div className={`submit-message ${submitMessage.includes("success") ? "success" : "error"}`}>
//                 {submitMessage}
//               </div>
//             )}
            
//             {/* Year selector */}
//             {availableYears.length > 1 && (
//               <div className="year-selector">
//                 <label htmlFor="year-select">Select Reporting Year: </label>
//                 <select 
//                   id="year-select"
//                   value={selectedYear || availableYears[0]}
//                   onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//                 >
//                   {availableYears.map(year => (
//                     <option key={year} value={year}>{year}</option>
//                   ))}
//                 </select>
//               </div>
//             )}
//           </div>

//           <div className="metrics-container">
//             <div className="metrics-grid">
//               {metricConfig.map((metric) => {
//                 const IconComponent = metric.icon;
//                 const value = parseFloat(yearData[metric.key]);
                
//                 return (
//                   <div key={metric.key} className="metric-card">
//                     <div className="metric-header">
//                       <div className="metric-icon" style={{ backgroundColor: metric.color }}>
//                         <IconComponent size={20} color="white" />
//                       </div>
//                       <h3 className="metric-title">{metric.title}</h3>
//                     </div>
//                     <div className="metric-value">
//                       {metric.unit && <span className="value-unit">{metric.unit}</span>}
//                       {metric.format(value)}
//                     </div>
//                     <div className="metric-year">Reporting Year: {yearData.year}</div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BRSRReport;
