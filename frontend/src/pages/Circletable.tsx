import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { report_tableApi } from "../api";
// import { downloadReportApi } from "../api";
import "../style/circletable.css";

interface SubmittedReport {
  report_id: number;
  district_id: number;
  division_name: string;
  manager_name: string;
  phone: string;
  file_path: string;
  created_at: string;
  generated_by_user: string;
}

const Circletable: React.FC = () => {
  const [reports, setReports] = useState<SubmittedReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Get token from Redux
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const result = await report_tableApi.getSubmittedReports(token);
        setReports(result.reports || []);
        setLoading(false);
      } catch (error) {
        console.error("Error loading submitted reports:", error);
        setLoading(false);
      }
    };
    fetchReports();
  }, [token]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (loading) return <p className="loading-text">Loading Submitted Reports...</p>;

  // Add this function to your component
// const handleDownload = async (filename: string) => {
//   try {
//     const blob = await downloadReportApi.downloadReport(token, filename);
    
//     // Create a download link
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.style.display = 'none';
//     a.href = url;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     window.URL.revokeObjectURL(url);
//     document.body.removeChild(a);
//   } catch (error) {
//     console.error("Download failed:", error);
//     alert("Download failed. Please try again.");
//   }
// };


  return (
    <div className="circle-table-container">
      {/* Table Section */}
      <div className="table-section">
        <div className="table-header">
          <h3>Submitted BRSR Reports</h3>
        </div>

        <div className="table-container">
          <table className="branches-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Division Name</th>
                <th>Manager Name</th>
                <th>Phone</th>
                <th>Submitted On</th>
                <th>Take Action</th>
              </tr>
            </thead>
            {/* <tbody>
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report.report_id}>
                    <td>{report.report_id}</td>
                    <td>{report.division_name}</td>
                    <td>{report.manager_name}</td>
                    <td>{report.phone}</td>
                    <td>{formatDate(report.created_at)}</td>
                    <td>
                      <a 
                        href={`/api/reports/${report.file_path.split('/').pop()}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="action-btn download-btn"
                      >
                        Download PDF
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="no-data">
                    No reports submitted yet
                  </td>
                </tr>
              )}
            </tbody> */}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Circletable;