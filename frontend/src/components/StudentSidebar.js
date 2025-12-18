import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/StudentSidebar.css';

const StudentSidebar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const menuItems = [
    { path: '/student/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/courses', label: 'Browse Courses', icon: '📚' },
    { path: '/student/enrollments', label: 'My Learning', icon: '🎓' },
    { path: '/student/results', label: 'My Results', icon: '📋' },
    { path: '/student/profile', label: 'Profile', icon: '👤' },
    { path: '/verify-certificate', label: 'Certificates', icon: '🏆' }
   /* { path: '/achievements', label: 'Achievements', icon: '🏅' },
    { path: '/progress', label: 'Progress Tracking', icon: '📈' },
    { path: '/favorites', label: 'Favorites', icon: '❤️' },
    { path: '/study-groups', label: 'Study Groups', icon: '👥' },
    { path: '/calendar', label: 'Study Calendar', icon: '📅' },
    { path: '/notes', label: 'My Notes', icon: '📝' },
    { path: '/downloads', label: 'Downloads', icon: '💾' },
    { path: '/help', label: 'Help & Support', icon: '❓' }*/
  ];

  return (
    <div className="student-sidebar">
      {/* Header */}
      
      {/* Scrollable Menu */}
      <div className="sidebar-scroll">
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Main</div>
            {menuItems.slice(0, 3).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>
          
          <div className="nav-section">
           { /*<div className="nav-section-title">Account</div>*/}
            {menuItems.slice(3, 6).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>
          
          <div className="nav-section">
           {/* <div className="nav-section-title">Learning Tools</div>*/}
            {menuItems.slice(6).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;
