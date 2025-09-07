import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { updateProfile } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../style/Profile.css";
import userLogo from "../images/user-logo.png";
import { userApi } from "../api";

const ProfileEdit: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profileLoading, profileError, token } = useSelector(
    (state: RootState) => state.auth
  );

  // Get user role from Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  const role = user?.role;

  const [formData, setFormData] = useState({
    manager_name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    state: ""
  });

  // ✅ Fetch profile directly from backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await userApi.getProfile(token);
        const profile = res.profile;

        setFormData({
          manager_name: profile.manager_name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
          pincode: (profile as any).pincode || "",
          state: (profile as any).state || ""
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, [token]);

  // Function to get the correct dashboard path based on role
  const getDashboardPath = () => {
    switch (role) {
      case 'branch':
        return '/branch-dashboard';
      case 'division':
        return '/division-dashboard';
      case 'circle':
        return '/circle-dashboard';
      default:
        return '/view/profile'; // fallback
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      await dispatch(
        updateProfile({
          token,
          profileData: formData
        }) as any
      );

      navigate("/view/profile");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleCancel = () => {
    navigate("/view/profile");
  };

  const handleBackToDashboard = () => {
    navigate(getDashboardPath());
  };

  return (
    <div className="profile-container">
      <div className="fixed-header">
        <Header />
      </div>

      <nav className="blue_header">
        <div className="nav-text">
          <h2> Edit Profile </h2> 
        </div>
      </nav>

      <div className="edit-profile-content">
        <div className="profile-header">
          <button
            className="back-to-dashboard-btn"
            onClick={handleBackToDashboard} // Use the new function
          >
            ← Back to Dashboard
          </button>
          <h1>Edit Profile</h1>
        </div>

        {/* ... rest of your component remains the same ... */}
        <div className="profile-card">
          <div className="profile-logo-section">
            <img src={userLogo} alt="User Profile" className="user-logo" />
            <h2>Edit Your Information</h2>
          </div>

          {profileError && (
            <div className="error-message">{profileError}</div>
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
                disabled={profileLoading || !token}
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
// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../store";
// import { updateProfile } from "../slices/authSlice";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";
// import "../style/Profile.css";
// import userLogo from "../images/user-logo.png";
// import { userApi } from "../api"; // ✅ import userApi

// const ProfileEdit: React.FC = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { profileLoading, profileError, token } = useSelector(
//     (state: RootState) => state.auth
//   );

//   const role = useSelector((state: RootState) => state.auth.user?.role);

//   const [formData, setFormData] = useState({
//     manager_name: "",
//     email: "",
//     phone: "",
//     address: "",
//     pincode: "",
//     state: ""
//   });

//   // ✅ Fetch profile directly from backend
//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!token) return;
//       try {
//         const res = await userApi.getProfile(token);
//         const profile = res.profile;

//         setFormData({
//           manager_name: profile.manager_name || "",
//           email: profile.email || "",
//           phone: profile.phone || "",
//           address: profile.address || "",
//           pincode: (profile as any).pincode || "",
//           state: (profile as any).state || ""
//         });
//       } catch (err) {
//         console.error("Failed to fetch profile:", err);
//       }
//     };

//     fetchProfile();
//   }, [token]);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!token) {
//       console.error("No authentication token found");
//       return;
//     }

//     try {
//       // ✅ Always send all fields in formData
//       await dispatch(
//         updateProfile({
//           token,
//           profileData: formData
//         }) as any
//       );

//       navigate("/view/profile");
//     } catch (error) {
//       console.error("Update failed:", error);
//     }
//   };

//   const handleCancel = () => {
//     navigate("/view/profile");
//   };

//   return (
//     <div className="profile-container">
//       <div className="fixed-header">
//         <Header />
//       </div>

//       <nav className="blue_header">
//         <div className="nav-text">
//         <h2> Edit Profile </h2> 
//         </div>
//       </nav>

//       <div className="edit-profile-content">
//         <div className="profile-header">
//           <button
//             className="back-to-dashboard-btn"
            
//             onClick={() => {
//                 navigate("/view/profile");
//             }}
//           >
//             ← Back to Profile
//           </button>
//           <h1>Edit Profile</h1>
//         </div>

//         <div className="profile-card">
//           <div className="profile-logo-section">
//             <img src={userLogo} alt="User Profile" className="user-logo" />
//             <h2>Edit Your Information</h2>
//           </div>

//           {profileError && (
//             <div className="error-message">{profileError}</div>
//           )}

//           <form onSubmit={handleSubmit} className="profile-form">
//             <div className="form-sections">
//               <div className="form-section">
//                 <h3>Personal Information</h3>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Manager Name *</label>
//                     <input
//                       type="text"
//                       name="manager_name"
//                       value={formData.manager_name}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Email Address *</label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Phone Number</label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="form-group">
//                   <label>Address</label>
//                   <textarea
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     rows={3}
//                   />
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Pincode</label>
//                     <input
//                       type="text"
//                       name="pincode"
//                       value={formData.pincode}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>State</label>
//                     <input
//                       type="text"
//                       name="state"
//                       value={formData.state}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="form-actions">
//               <button
//                 type="submit"
//                 disabled={profileLoading || !token}
//                 className="update-btn"
//               >
//                 {profileLoading ? "Updating..." : "Update Profile"}
//               </button>
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="cancel-btn"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileEdit;
