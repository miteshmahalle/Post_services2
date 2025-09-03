// src/pages/login.tsx
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../slices/authSlice"; // removed unused logout
import { authApi } from "../api";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
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
      const res = (await authApi.login(username, password)) as LoginResponse;

      dispatch(
        loginSuccess({
          token: res.token,
          user: res.user,
        })
      );

      // ✅ Redirect to dashboard based on role
      if (res.user.role === "branch") {
        navigate("/branch-dashboard");
      } else if (res.user.role === "division") {
        navigate("/division-dashboard");
      } else if (res.user.role === "circle") {
        navigate("/circle-dashboard");
      } else {
        navigate("/"); // fallback to homepage if role not matched
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
      {/* Government Header with India Post Logo */}
      <header className="govt-header">
        <div className="header-content">
          <img src={logo} alt="India Post Logo" className="header-logo" />
          <div className="header-text">
            <h2>भारतीय डाक</h2>
            <p>India Post</p>
          </div>
        </div>
      </header>

      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <img src={logo} alt="India Post Logo" className="login-logo" />
            <h1>BRSR Report</h1>
            <p>Postal Services Management System</p>
          </div>

          {error && <div className="error-message">{error}</div>}

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

          <button
            onClick={handleLogin}
            disabled={loading}
            className="login-btn"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="login-footer">
            © {new Date().getFullYear()} BRSR Report - Postal Services
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
