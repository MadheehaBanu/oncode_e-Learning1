import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>OnCode</h3>
            <p>
              Empowering learners worldwide with quality programming education and industry-recognized certifications.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/verify-certificate">Verify Certificate</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li><span>Web Development</span></li>
              <li><span>Data Science</span></li>
              <li><span>Mobile Development</span></li>
              <li><span>Programming Languages</span></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <ul className="footer-contact">
              <li>📧 support@oncode.com</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>📍 123 Tech Street, San Francisco, CA</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>
            © 2024 OnCode. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;