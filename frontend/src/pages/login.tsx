import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../slices/authSlice";
import { authApi } from "../api";
import React, { useState } from "react";
import "../style/login.css"; // <-- import CSS

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
      const res: LoginResponse = await authApi.login(username, password);

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
      <div className="login-box">
        {/* Header */}
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
            {showPassword ? "Hide" : "Show"}
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
