import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../style/Profile.css";
import userLogo from "../images/user-logo.png";
import DivisionSidebar from "../components/divisionsidebar";
import CircleSidebar from "../components/CircleSidebar";
import Navigation from "../components/Navigation";

const ProfileView: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setProfileData(user);
    }
  }, [user]);

  // Function to render the appropriate sidebar based on user role
  const renderSidebar = () => {
    switch (user?.role) {
      case "branch":
        return <Navigation isOpen={false} onClose={() => {}} />;
      case "division":
        return <DivisionSidebar />;
      case "circle":
        return <CircleSidebar />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <Header />
        <div className="loading-container">Loading profile...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-container">
        <Header />
        <div className="error-container">Failed to load profile data</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="fixed-header">
        <Header />
      </div>

      <nav className="blue_header">
        <div className="nav-text">
          <h2>Profile {user?.manager_name}</h2> 
        </div>
      </nav>

      {/* Render only the appropriate sidebar */}
      <div className="fixed-sidebar">
        {renderSidebar()}
      </div>

      <div className="profile-content">
        <div className="profile-header">
          {/* <button 
            className="back-to-dashboard-btn"
            onClick={() => {
              if (profileData?.role === "branch") {
                navigate("/branch-dashboard");
              } else if (profileData?.role === "division") {
                navigate("/division-dashboard");
              } else if (profileData?.role === "circle") {
                navigate("/circle-dashboard");
              } else {
                navigate("/");
              }
            }}
          >
            ← Back to Dashboard
          </button> */}

          <h1>Manager Profile</h1>
        </div>

        <div className="profile-card">
          <div className="profile-logo-section">
            <img src={userLogo} alt="User Profile" className="user-logo" />
            <h2>{profileData.manager_name}</h2>
            <p>{profileData.role} • {profileData.branch_name}</p>
          </div>

          <div className="profile-info-grid">
            <div className="info-section">
              <h3>Personal Information</h3>
              <div className="info-item">
                <label>Manager Name:</label>
                <span>{profileData.manager_name}</span>
              </div>
              <div className="info-item">
                <label>Email Address:</label>
                <span>{profileData.email}</span>
              </div>
              <div className="info-item">
                <label>Phone Number:</label>
                <span>{profileData.phone}</span>
              </div>
              <div className="info-item">
                <label>Address:</label>
                <span>{profileData.address}</span>
              </div>
              {profileData.pincode && (
                <div className="info-item">
                  <label>Pincode:</label>
                  <span>{profileData.pincode}</span>
                </div>
              )}
              {profileData.state && (
                <div className="info-item">
                  <label>State:</label>
                  <span>{profileData.state}</span>
                </div>
              )}
            </div>

            <div className="info-section">
              <h3>Branch Information</h3>
              <div className="info-item">
                <label>Branch Name:</label>
                <span>{profileData.branch_name}</span>
              </div>
              <div className="info-item">
                <label>Branch Code:</label>
                <span>{profileData.branch_code}</span>
              </div>
              <div className="info-item">
                <label>Username:</label>
                <span>{profileData.username}</span>
              </div>
              <div className="info-item">
                <label>Role:</label>
                <span className="role-badge">{profileData.role}</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              className="edit-profile-btn"
              onClick={() => navigate("/edit/profile")}
            >
              Edit Profile
            </button>
            <button 
              className="change-password-btn"
              onClick={() => navigate("/change-password")}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;

// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../store";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";
// import "../style/Profile.css";
// import userLogo from "../images/user-logo.png";
// import DivisionSidebar from "../components/divisionsidebar";
// import CircleSidebar from "../components/CircleSidebar";
// import Navigation  from "../components/Navigation";
// const ProfileView: React.FC = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user, loading } = useSelector((state: RootState) => state.auth);
  
//   const [profileData, setProfileData] = useState<any>(null);

//   useEffect(() => {
//     // You'll need to implement getProfile function or use existing user data
//     if (user) {
//       setProfileData(user);
//     }
//   }, [user]);

//   if (loading) {
//     return (
//       <div className="profile-container">
//         <Header />
//         <div className="loading-container">Loading profile...</div>
//       </div>
//     );
//   }

//   if (!profileData) {
//     return (
//       <div className="profile-container">
//         <Header />
//         <div className="error-container">Failed to load profile data</div>
//       </div>
//     );
//   }

//   return (
//     <div className="profile-container">
//       <div className="fixed-header">
//         <Header />
//       </div>

//       <nav className="blue_header">
//         <div className="nav-text">
//         <h2> Profile {user?.manager_name} </h2> 
//         </div>
//       </nav>
//       <div className="fixed-sidebar">
//           <Navigation isOpen={false} onClose={function (): void {
//           throw new Error("Function not implemented.");
//         } } />
//         </div>
//       <div className="fixed-sidebar">
//           <DivisionSidebar />
//         </div>
//       <div className="fixed-sidebar">
//           <CircleSidebar />
//         </div>
//       <div className="profile-content">
//         <div className="profile-header">
//           {/* <button 
//             className="back-to-dashboard-btn"
//             onClick={() => {
//               if (profileData?.role === "branch") {
//                 navigate("/branch-dashboard");
//               } else if (profileData?.role === "division") {
//                 navigate("/division-dashboard");
//               } else if (profileData?.role === "circle") {
//                 navigate("/circle-dashboard");
//               } else {
//                 // fallback if role is unknown
//                 navigate("/");
//               }
//             }}
//           >
//             ← Back to Dashboard
//           </button> */}

//           <h1>Manager Profile</h1>
//         </div>

//         <div className="profile-card">
//           <div className="profile-logo-section">
//             <img src={userLogo} alt="User Profile" className="user-logo" />
//             <h2>{profileData.manager_name}</h2>
//             <p>{profileData.role} • {profileData.branch_name}</p>
//           </div>

//           <div className="profile-info-grid">
//             <div className="info-section">
//               <h3>Personal Information</h3>
//               <div className="info-item">
//                 <label>Manager Name:</label>
//                 <span>{profileData.manager_name}</span>
//               </div>
//               <div className="info-item">
//                 <label>Email Address:</label>
//                 <span>{profileData.email}</span>
//               </div>
//               <div className="info-item">
//                 <label>Phone Number:</label>
//                 <span>{profileData.phone}</span>
//               </div>
//               <div className="info-item">
//                 <label>Address:</label>
//                 <span>{profileData.address}</span>
//               </div>
//               {profileData.pincode && (
//                 <div className="info-item">
//                   <label>Pincode:</label>
//                   <span>{profileData.pincode}</span>
//                 </div>
//               )}
//               {profileData.state && (
//                 <div className="info-item">
//                   <label>State:</label>
//                   <span>{profileData.state}</span>
//                 </div>
//               )}
//             </div>

//             <div className="info-section">
//               <h3>Branch Information</h3>
//               <div className="info-item">
//                 <label>Branch Name:</label>
//                 <span>{profileData.branch_name}</span>
//               </div>
//               <div className="info-item">
//                 <label>Branch Code:</label>
//                 <span>{profileData.branch_code}</span>
//               </div>
//               <div className="info-item">
//                 <label>Username:</label>
//                 <span>{profileData.username}</span>
//               </div>
//               <div className="info-item">
//                 <label>Role:</label>
//                 <span className="role-badge">{profileData.role}</span>
//               </div>
//             </div>
//           </div>

//           <div className="profile-actions">
//             <button 
//               className="edit-profile-btn"
//               onClick={() => navigate("/edit/profile")}
//             >
//               Edit Profile
//             </button>
//             <button 
//               className="change-password-btn"
//               onClick={() => navigate("/change-password")}
//             >
//               Change Password
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileView;