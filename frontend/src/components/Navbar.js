import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css'; // <-- CSS file linked

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const navigationItems = [
    {
      name: 'About',
      path: '/about',
      dropdown: [
        { name: 'Overview', path: '/programmes' },
        { name: 'Mission & Vision', path: '/programmes' },
        { name: 'Our Goal' },
        { name: 'Our objective' },
        { name: 'Our Quality Policy' },
        { name: 'Professional Partnership' },
        { name: 'OnCode Governance' },
        { name: 'Executive Staff' },
        { name: 'Acadamic Staff' }
      ]
    },

    {
      name: 'Programmes',
      path: '/programmes',
      dropdown: [
        { name: 'Master Programme', path: '/programmes' },
        { name: 'Degree Programmes', path: '/programmes' },
        { name: 'Higher National Diploma' },
        { name: 'Advanced Diploma Programmes' },
        { name: 'Certificate Programmes' },
        { name: 'Foundation programmes' },
        { name: 'Professional Certifications' },
        { name: 'Foreign Languages' },
        { name: 'Workshops' },
        { name: 'Transfer Programmes' },
        { name: 'Certification Hub' }

      ]
    },


    {
      name: 'News',
      path: '/news-events'
    },
    {
      name: 'My Results',
      path: '/verify-certificate'
    },

    {
      name: 'Contact',
      path: '/contact'
    }
  ];

  return (
    <>
      <header className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
        <div className="navbar-container">
          <div className="navbar-content">

            {/* Logo */}
            <Link to="/" className="navbar-logo">
              <span className="logo-icon">🎓</span> OnCode
            </Link>

            {/* Desktop Navigation */}
            <nav className="navbar-links">
              {navigationItems.map((item, index) => (
                <div
                  key={item.name}
                  className="nav-item-wrapper"
                  onMouseEnter={() => item.dropdown && setActiveDropdown(index)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link to={item.path} className="nav-item">
                    {item.name}
                    {item.dropdown && <span className="dropdown-arrow">▼</span>}
                  </Link>

                  {item.dropdown && activeDropdown === index && (
                    <div className="dropdown-menu">
                      {item.dropdown.map((dropItem) => (
                        <Link
                          key={dropItem.name}
                          to={dropItem.path}
                          className="dropdown-item"
                        >
                          {dropItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Buttons */}
            <div className="navbar-right">

              {/* Enroll Now */}
              <Link to="/Register" className="btn-enroll">
                Sign Up
              </Link>

              {/* User Menu */}
              {currentUser ? (
                <div className="user-menu-wrapper">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="user-menu-btn"
                  >
                    <div className="user-avatar">
                      {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span>{currentUser.name || 'User'}</span>
                  </button>

                  {showUserMenu && (
                    <div className="user-dropdown">
                      {currentUser.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="dropdown-item"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      <button onClick={handleLogout} className="dropdown-item">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="btn-login">
                  Login
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span /><span /><span />
              </button>
            </div>

          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mobile-menu">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.path}
                    className="mobile-item"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.dropdown && item.dropdown.map((dropItem) => (
                    <Link
                      key={dropItem.name}
                      to={dropItem.path}
                      className="mobile-sub-item"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {dropItem.name}
                    </Link>
                  ))}
                </div>
              ))}

              <Link to="/signup" className="btn-mobile-enroll" onClick={() => setIsMobileMenuOpen(false)}>
                Sign UP
              </Link>

              {!currentUser && (
                <Link to="/login" className="btn-mobile-login" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
