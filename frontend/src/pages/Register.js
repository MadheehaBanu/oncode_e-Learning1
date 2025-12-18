import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    age: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      return setError('Please enter a valid email address');
    }
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Failed to create account. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-form-container">
        <div>
          <Link to="/" className="register-back-link">
            ← Back to Home
          </Link>
        </div>
        <div>
          <h2 className="register-title">
            Create your account
          </h2>
        </div>
        <form className="register-form" onSubmit={handleSubmit}>
          {error && (
            <div className="register-error">
              {error}
            </div>
          )}
          <div className="register-grid">
            <div className="register-form-group">
              <label htmlFor="name" className="register-form-label">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="register-form-input"
                placeholder="Enter your full name"
              />
            </div>
            <div className="register-form-group">
              <label htmlFor="age" className="register-form-label">Age</label>
              <input
                id="age"
                name="age"
                type="number"
                min="13"
                max="100"
                value={formData.age}
                onChange={handleChange}
                className="register-form-input"
                placeholder="Enter your age"
              />
            </div>
          </div>
          <div className="register-form-group">
            <label htmlFor="email" className="register-form-label">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="register-form-input"
              placeholder="Enter your email"
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="phone" className="register-form-label">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="register-form-input"
              placeholder="Enter your phone number"
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="address" className="register-form-label">Address</label>
            <textarea
              id="address"
              name="address"
              rows="2"
              value={formData.address}
              onChange={handleChange}
              className="register-form-textarea"
              placeholder="Enter your address"
            />
          </div>
          <div className="register-grid">
            <div className="register-form-group">
              <label htmlFor="city" className="register-form-label">City</label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                className="register-form-input"
                placeholder="Enter your city"
              />
            </div>
            <div className="register-form-group">
              <label htmlFor="country" className="register-form-label">Country</label>
              <input
                id="country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleChange}
                className="register-form-input"
                placeholder="Enter your country"
              />
            </div>
          </div>
          <div className="register-grid">
            <div className="register-form-group">
              <label htmlFor="password" className="register-form-label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="register-form-input"
                placeholder="Enter your password"
              />
            </div>
            <div className="register-form-group">
              <label htmlFor="confirmPassword" className="register-form-label">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="register-form-input"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="register-submit-btn"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>

          <div className="register-login-link">
            <span className="register-login-text">
              Already have an account?{' '}
              <Link to="/login" className="register-login-anchor">
                Sign in
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;