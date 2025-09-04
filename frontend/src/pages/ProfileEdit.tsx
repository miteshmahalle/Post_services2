import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { updateProfile } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./style/Profile.css";
import userLogo from "../images/user-logo.png";

const ProfileEdit: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, profileLoading, profileError, token } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    manager_name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    state: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        manager_name: user.manager_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        pincode: (user as any).pincode || "",
        state: (user as any).state || ""
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if token exists before proceeding
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      // Pass both token and profileData as expected by your action
      await dispatch(updateProfile({ 
        token: token, // token is now guaranteed to be string (not null)
        profileData: formData 
      }) as any);
      
      // Navigate back to profile view after successful update
      navigate("/profile");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="profile-container">
      <Header />
      
      <div className="profile-content">
        <div className="profile-header">
          <button 
            className="back-to-dashboard-btn"
            onClick={() => navigate("/branch-dashboard")}
          >
            ← Back to Dashboard
          </button>
          <h1>Edit Profile</h1>
        </div>

        <div className="profile-card">
          <div className="profile-logo-section">
            <img src={userLogo} alt="User Profile" className="user-logo" />
            <h2>Edit Your Information</h2>
          </div>

          {profileError && (
            <div className="error-message">
              {profileError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-sections">
              <div className="form-section">
                <h3>Personal Information</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Manager Name *</label>
                    <input
                      type="text"
                      name="manager_name"
                      value={formData.manager_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={profileLoading || !token} // Disable if no token
                className="update-btn"
              >
                {profileLoading ? "Updating..." : "Update Profile"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;