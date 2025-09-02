import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "../slices/authSlice";
import { authApi } from "../api";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi"; // ✅ icons
import "../style/login.css";
import logo from "../images/India-Post-Color.png";

interface LoginResponse {
  message: string;
  token: string;
  user: {
    address: string;
    branch_code: string;
    branch_id: number;
    branch_name: string;
    email: string;
    manager_name: string;
    parent_id: number | null;
    phone: string;
    role: string;
    user_id: number;
    username: string;
  };
}

// ✅ Eye icon wrapper
const EyeIcon: React.FC<{ show: boolean }> = ({ show }) => {
  const Icon = (show ? FiEyeOff : FiEye) as React.ElementType;
  return <Icon className="eye-icon" size={18} />;
};

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await authApi.login(username, password) as LoginResponse;

      dispatch(
        loginSuccess({
          token: res.token,
          user: res.user,
        })
      );

      switch (res.user.role) {
        case "branch":
          navigate("/branch-dashboard");
          break;
        case "division":
          navigate("/division-dashboard");
          break;
        case "circle":
          navigate("/circle-dashboard");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-page">
      {/* ✅ Government Header with India Post Logo */}
      <div className="govt-header-section">
        <img 
          src={logo} 
          alt="India Post Logo" 
          className="india-post-logo"
        />
        <div className="govt-header-text">
          <h2>भारतीय डाक</h2>
          <p>India Post</p>
        </div>
      </div>

      {/* ✅ Stylish Logout button top-right */}
      {/* <button
        className="logout-btn"
        onClick={() => {
          dispatch(logout());
          navigate("/login");
        }}
      >
        Logout
      </button> */}

      <div className="login-box">
        {/* ✅ Logo in the circle above login box */}
        <img 
          src={logo} 
          alt="India Post Logo" 
          className="login-box-logo"
        />
        
        {/* ✅ Keep header inside login card */}
        <h1>BRSR Report</h1>
        <p>Postal Services Management System</p>

        {/* Error */}
        {error && <div className="error-message">{error}</div>}

        {/* Username */}
        <input
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="login-input"
        />

        {/* Password */}
        <div className="password-wrapper">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="login-input"
          />
          <button
            type="button"
            className="toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            <EyeIcon show={showPassword} />
          </button>
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="login-btn"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="login-footer">
          © {new Date().getFullYear()} BRSR Report - Postal Services
        </p>
      </div>
    </div>
  );
};

export default LoginPage;