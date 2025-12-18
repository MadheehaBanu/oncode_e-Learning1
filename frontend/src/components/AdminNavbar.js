import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminNavbar.css';

const AdminNavbar = () => {
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <div className="admin-navbar-content">
          <div>
            <Link to="/admin" className="admin-navbar-logo">
              OnCode Admin
            </Link>
          </div>
          
          <div className="admin-navbar-actions">
            <Link to="/" className="admin-navbar-link">
              View Site
            </Link>
            
            <div className="admin-navbar-user">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="admin-navbar-user-btn"
              >
                <div className="admin-navbar-avatar">
                  {currentUser?.name?.charAt(0).toUpperCase()}
                </div>
                <span>{currentUser?.name}</span>
              </button>
              
              {showDropdown && (
                <div className="admin-navbar-dropdown">
                  <Link
                    to="/dashboard"
                    className="admin-navbar-dropdown-link"
                  >
                    User Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="admin-navbar-dropdown-btn"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;