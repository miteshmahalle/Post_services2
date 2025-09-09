// src/pages/AddBranch.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import "../style/add_branch.css";
import logo from "../images/India-Post-Color.png";
import { authApi } from "../api";
const Add_branch: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role;
  const [formData, setFormData] = useState({
    branch_code: "",
    branch_name: "",
    manager_name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    state: "",
    username: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Phone number validation - only allow numbers and max 10 digits
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prevState => ({
        ...prevState,
        [name]: numericValue
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // All fields are mandatory
    if (!formData.branch_code) newErrors.branch_code = "Branch code is required";
    if (!formData.branch_name) newErrors.branch_name = "Branch name is required";
    if (!formData.manager_name) newErrors.manager_name = "Manager name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.pincode) newErrors.pincode = "Pincode is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    
    // Additional validations
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setIsSubmitting(true);
  setSubmitMessage("");

  try {
    // 🔑 Use authApi.register instead of fetch
   if (!token) {
  setSubmitMessage("You are not authenticated. Please log in again.");
  setIsSubmitting(false);
  return;
  }

     const data = await authApi.register(token, formData);


    // If backend explicitly sends error in response
    if (data.error) {
      const fieldErrors: Record<string, string> = {};

      if (data.error.includes("Email already exists")) {
        fieldErrors.email = "Email already exists";
      } else if (data.error.includes("Phone already exists")) {
        fieldErrors.phone = "Phone already exists";
      } else if (data.error.includes("Username already exists")) {
        fieldErrors.username = "Username already exists";
      } else {
        throw new Error(data.error || "Failed to register user");
      }

      setErrors(fieldErrors);
      return;
    }

    // ✅ Success message
    setSubmitMessage(data.message || "User registered successfully!");

    // 🔀 Redirect based on role
    if (role === "division") {
      setTimeout(() => {
        navigate("/division-dashboard");
      }, 2000);
    } else if (role === "circle") {
      setTimeout(() => {
        navigate("/circle-dashboard");
      }, 2000);
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    setSubmitMessage(
      error.response?.data?.error ||
        error.message ||
        "Error registering user. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="add-branch-container">
      <div className="add-branch-card">
        <div className="add-branch-header">
          <button 
               className="back-button"
                  onClick={() => {
                     navigate("/registered-list")
                      }}
>
                  ← Back
          </button>
          <div className="logo-container">
            <img src={logo} alt="India Post Logo" className="logo" />
          </div>
          <h2>New Branch Registration</h2>
        </div>

        {/* Only show general errors at the top, not field-specific ones */}
        {submitMessage && !submitMessage.includes("already exists") && (
          <div className={`message ${submitMessage.includes("successfully") ? "success" : "error"}`}>
            {submitMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-branch-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="branch_code">Branch Code<span className="required">*</span></label>
              <input
                type="text"
                id="branch_code"
                name="branch_code"
                value={formData.branch_code}
                onChange={handleChange}
                required
                className={errors.branch_code ? "error" : ""}
                placeholder="ex. Jalgaon_Div"
              />
              <div className="example-text">ex. Jalgaon_Div</div>
              {errors.branch_code && <span className="error-text">{errors.branch_code}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="branch_name">Branch Name<span className="required">*</span></label>
              <input
                type="text"
                id="branch_name"
                name="branch_name"
                value={formData.branch_name}
                onChange={handleChange}
                required
                className={errors.branch_name ? "error" : ""}
              />
              {errors.branch_name && <span className="error-text">{errors.branch_name}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="manager_name">Manager Name<span className="required">*</span></label>
              <input
                type="text"
                id="manager_name"
                name="manager_name"
                value={formData.manager_name}
                onChange={handleChange}
                required
                className={errors.manager_name ? "error" : ""}
              />
              {errors.manager_name && <span className="error-text">{errors.manager_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email<span className="required">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone<span className="required">*</span></label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={errors.phone ? "error" : ""}
                maxLength={10}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="pincode">Pincode<span className="required">*</span></label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                className={errors.pincode ? "error" : ""}
                maxLength={6}
              />
              {errors.pincode && <span className="error-text">{errors.pincode}</span>}
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="address">Address<span className="required">*</span></label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className={errors.address ? "error" : ""}
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="state">State<span className="required">*</span></label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className={errors.state ? "error" : ""}
              />
              {errors.state && <span className="error-text">{errors.state}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Username<span className="required">*</span></label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className={errors.username ? "error" : ""}
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password<span className="required">*</span></label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={errors.password ? "error" : ""}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register Branch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add_branch;