import React, { useState } from 'react';
import { authApi } from '../api'; // adjust path as needed
import './style/changepassword.css';
import { useSelector } from 'react-redux';

const ChangePassword: React.FC = () => {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);


    const token = useSelector((state: any) => state.auth.token);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    // Validation
    if (!formData.current_password || !formData.new_password || !formData.confirm_password) {
      setMessage('All fields are required');
      setIsSuccess(false);
      setLoading(false);
      return;
    }
    
    if (formData.new_password.length < 6) {
      setMessage('Password must be at least 6 characters');
      setIsSuccess(false);
      setLoading(false);
      return;
    }
    
    if (formData.new_password !== formData.confirm_password) {
      setMessage('New passwords do not match');
      setIsSuccess(false);
      setLoading(false);
      return;
    }
    
    try {
      // Call the API
      const response = await authApi.changePassword(token, formData);
      
      if (response.success) {
        setMessage(response.message || 'Password successfully changed!');
        setIsSuccess(true);
        
        // Clear form
        setFormData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        setMessage(response.error || 'Failed to change password');
        setIsSuccess(false);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to change password');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-header">
        <div className="logo-container">
          <div className="logo">🌐</div>
          <button className="back-button" onClick={() => window.history.back()}>
            &larr; Back to Dashboard
          </button>
        </div>
        <h1>Change Password</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="password-form">
        <div className="form-group">
          <label htmlFor="current_password">Current Password*</label>
          <input
            type="password"
            id="current_password"
            name="current_password"
            value={formData.current_password}
            onChange={handleChange}
            placeholder="Enter current password"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="new_password">New Password*</label>
          <input
            type="password"
            id="new_password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            placeholder="Enter new password (min 6 characters)"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirm_password">Confirm Password*</label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            placeholder="Confirm new password"
          />
        </div>
        
        <button 
          type="submit" 
          className="update-button"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
        
        {message && (
          <div className={`message ${isSuccess ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ChangePassword;