import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      const docRef = doc(db, 'settings', 'contact');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContactInfo(docSnap.data());
      }
    } catch (error) {
      console.error('Error loading contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!contactInfo) {
    return <div className="flex justify-center items-center h-screen">Unable to load contact information</div>;
  }

  return (
    <div className="contact-container">
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1>Contact Us</h1>
          <p>
            Have questions about our courses or need support? We're here to help!
          </p>
        </div>
      </div>

      <div className="contact-content">
        <div className="contact-content-container">
          <div className="contact-grid">
            <div className="contact-form">
              <h2>Get in Touch</h2>
              
              {submitted ? (
                <div className="contact-success">
                  Thank you for your message! We'll get back to you within 24 hours.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="contact-form-group">
                    <label htmlFor="name" className="contact-form-label">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="contact-form-input"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="email" className="contact-form-label">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="contact-form-input"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="subject" className="contact-form-label">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="contact-form-select"
                    >
                      <option value="">Select a subject</option>
                      <option value="course-inquiry">Course Inquiry</option>
                      <option value="enrollment-support">Enrollment Support</option>
                      <option value="certificate-verification">Certificate Verification</option>
                      <option value="technical-support">Technical Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="message" className="contact-form-label">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="contact-form-textarea"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button type="submit" className="contact-submit-btn">
                    Send Message
                  </button>
                </form>
              )}
            </div>

            <div className="contact-info">
              <h2>Contact Information</h2>
              
              <div className="contact-info-list">
                <div className="contact-info-item">
                  <div className="contact-info-icon email">
                    <span>📧</span>
                  </div>
                  <div className="contact-info-content">
                    <h3>Email</h3>
                    <p>{contactInfo.email}</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon phone">
                    <span>📞</span>
                  </div>
                  <div className="contact-info-content">
                    <h3>Phone</h3>
                    <p>{contactInfo.phone}</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon address">
                    <span>📍</span>
                  </div>
                  <div className="contact-info-content">
                    <h3>Address</h3>
                    <p style={{ whiteSpace: 'pre-line' }}>{contactInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;