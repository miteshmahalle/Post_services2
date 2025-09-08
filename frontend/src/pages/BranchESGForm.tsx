import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { dashboardApi } from "../api";
import Header from "../components/Header";
import "../style/branchESGForm.css";
import logo from "../images/India-Post-Color.png";

interface ESGFormData {
  reporting_month: string;
  energy_bill: number | "";
  energy_kwh: number | "";
  fuel_litres: number | "";
  paper_reams: number | "";
  waste_kg: number | "";
  water_litres: number | "";
  training_hours: number | "";
  complaints_count: number | "";
}

interface ESGErrors {
  reporting_month?: string;
  energy_bill?: string;
  energy_kwh?: string;
  fuel_litres?: string;
  paper_reams?: string;
  waste_kg?: string;
  water_litres?: string;
  training_hours?: string;
  complaints_count?: string;
}

const BranchESGForm: React.FC = () => {
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth.token);
  const user = useSelector((state: any) => state.auth.user);

   // Extract query params from URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const month = searchParams.get("month"); // e.g. "2025-03"
  
  const [formData, setFormData] = useState<ESGFormData>({
    reporting_month: month || new Date().toISOString().slice(0, 7), // Current month in YYYY-MM format
    energy_bill: "",
    energy_kwh: "",
    fuel_litres: "",
    paper_reams: "",
    waste_kg: "",
    water_litres: "",
    training_hours: "",
    complaints_count: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ESGErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "reporting_month" ? value : (value === "" ? "" : parseFloat(value))
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ESGErrors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ESGErrors = {};
    
    if (!formData.reporting_month) newErrors.reporting_month = "Reporting month is required";
    if (formData.energy_bill === "" || formData.energy_bill < 0) newErrors.energy_bill = "Valid energy bill is required";
    if (formData.energy_kwh === "" || formData.energy_kwh < 0) newErrors.energy_kwh = "Valid energy consumption is required";
    if (formData.fuel_litres === "" || formData.fuel_litres < 0) newErrors.fuel_litres = "Valid fuel consumption is required";
    if (formData.paper_reams === "" || formData.paper_reams < 0) newErrors.paper_reams = "Valid paper usage is required";
    if (formData.waste_kg === "" || formData.waste_kg < 0) newErrors.waste_kg = "Valid waste generation is required";
    if (formData.water_litres === "" || formData.water_litres < 0) newErrors.water_litres = "Valid water consumption is required";
    if (formData.training_hours === "" || formData.training_hours < 0) newErrors.training_hours = "Valid training hours is required";
    if (formData.complaints_count === "" || formData.complaints_count < 0) newErrors.complaints_count = "Valid complaints count is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Call API to submit ESG data
      await dashboardApi.submitBranchESG(token, formData);
      alert("ESG Report submitted successfully!");
      navigate("/branch-dashboard");
    } catch (error) {
      console.error("Error submitting ESG report:", error);
      alert("Error submitting ESG report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="branch-esg-container">
      <Header />
      
      <div className="esg-main-content">
        {/* <div className="welcome-section">
          <p className="welcome-message">Welcome {user?.username || "User"}
            
          </p>
        </div> */}

        <div className="esg-form-container">
          <div className="esg-card">
            <div className="esg-header">
              {/* <div className="logo-container">
                <img src="/India-post-color.png" alt="India Post" className="india-post-color" />
              </div> */}
              <h2 className="esg-title">ESG Report</h2>
              <p className="esg-subtitle">Postal Services Management System</p>
            </div>

            <div className="esg-body">
              <form onSubmit={handleSubmit} className="esg-form">
                <div className="form-group">
                  <label htmlFor="reporting_month" className="form-label">
                    Reporting Month
                  </label>
                  <input
                    type="month"
                    id="reporting_month"
                    name="reporting_month"
                    value={formData.reporting_month}
                    onChange={handleInputChange}
                    className={`form-input ${errors.reporting_month ? "error" : ""}`}
                    readOnly
                  />
                  {errors.reporting_month && <span className="error-text">{errors.reporting_month}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="energy_bill" className="form-label">
                    Energy Bill (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="energy_bill"
                    name="energy_bill"
                    value={formData.energy_bill}
                    onChange={handleInputChange}
                    placeholder="Enter energy bill"
                    className={`form-input ${errors.energy_bill ? "error" : ""}`}
                  />
                  {errors.energy_bill && <span className="error-text">{errors.energy_bill}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="energy_kwh" className="form-label">
                    Energy Consumption (kWh)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="energy_kwh"
                    name="energy_kwh"
                    value={formData.energy_kwh}
                    onChange={handleInputChange}
                    placeholder="Enter energy consumption"
                    className={`form-input ${errors.energy_kwh ? "error" : ""}`}
                  />
                  {errors.energy_kwh && <span className="error-text">{errors.energy_kwh}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="fuel_litres" className="form-label">
                    Fuel Consumption (Litres)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="fuel_litres"
                    name="fuel_litres"
                    value={formData.fuel_litres}
                    onChange={handleInputChange}
                    placeholder="Enter fuel consumption"
                    className={`form-input ${errors.fuel_litres ? "error" : ""}`}
                  />
                  {errors.fuel_litres && <span className="error-text">{errors.fuel_litres}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="paper_reams" className="form-label">
                    Paper Used (Reams)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="paper_reams"
                    name="paper_reams"
                    value={formData.paper_reams}
                    onChange={handleInputChange}
                    placeholder="Enter paper used"
                    className={`form-input ${errors.paper_reams ? "error" : ""}`}
                  />
                  {errors.paper_reams && <span className="error-text">{errors.paper_reams}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="waste_kg" className="form-label">
                    Waste Generated (Kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="waste_kg"
                    name="waste_kg"
                    value={formData.waste_kg}
                    onChange={handleInputChange}
                    placeholder="Enter waste generated"
                    className={`form-input ${errors.waste_kg ? "error" : ""}`}
                  />
                  {errors.waste_kg && <span className="error-text">{errors.waste_kg}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="water_litres" className="form-label">
                    Water Consumption (Litres)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="water_litres"
                    name="water_litres"
                    value={formData.water_litres}
                    onChange={handleInputChange}
                    placeholder="Enter water consumption"
                    className={`form-input ${errors.water_litres ? "error" : ""}`}
                  />
                  {errors.water_litres && <span className="error-text">{errors.water_litres}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="training_hours" className="form-label">
                    Training Hours
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="training_hours"
                    name="training_hours"
                    value={formData.training_hours}
                    onChange={handleInputChange}
                    placeholder="Enter training hours"
                    className={`form-input ${errors.training_hours ? "error" : ""}`}
                  />
                  {errors.training_hours && <span className="error-text">{errors.training_hours}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="complaints_count" className="form-label">
                    Complaints Count
                  </label>
                  <input
                    type="number"
                    id="complaints_count"
                    name="complaints_count"
                    value={formData.complaints_count}
                    onChange={handleInputChange}
                    placeholder="Enter number of complaints"
                    className={`form-input ${errors.complaints_count ? "error" : ""}`}
                  />
                  {errors.complaints_count && <span className="error-text">{errors.complaints_count}</span>}
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => navigate("/branch-dashboard")}
                    className="btn btn-secondary"
                  >
                    <span className="btn-icon">←</span>
                    Back to Dashboard
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                  >
                    <span className="btn-icon">✓</span>
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchESGForm;