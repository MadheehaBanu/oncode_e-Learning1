import React, { useState, useEffect } from 'react';
import '../styles/programme.css';

const Programmes = () => {
  const [programmes, setProgrammes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nicNumber: '',
    programme: '',
    address: '',
    dateOfBirth: '',
    gender: ''
  });

  useEffect(() => {
    fetchProgrammes();
    fetchCourses();
  }, []);

  useEffect(() => {
    // On component mount or when programmes change, scroll to hash if present
    const hash = window.location.hash;
    if (hash) {
      const id = hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [programmes]);

  const fetchProgrammes = async () => {
    try {
      const response = await fetch('/api/programmes');
      const data = await response.json();
      if (data.success) setProgrammes(data.data);
    } catch (error) {
      console.error('Error fetching programmes:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/programmes/courses');
      const data = await response.json();
      if (data.success) setCourses(data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/enrollment/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          nicNumber: '',
          programme: '',
          address: '',
          dateOfBirth: '',
          gender: ''
        });

        setTimeout(() => {
          setShowEnrollmentForm(false);
          setMessage('');
        }, 3000);
      } else {
        setMessage(data.message || 'Submission failed. Try again.');
      }
    } catch {
      setMessage('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Separate programmes by level
  const undergraduateProgrammes = programmes.filter(p => p.level && p.level.toLowerCase() === 'undergraduate');
  const postgraduateProgrammes = programmes.filter(p => p.level && p.level.toLowerCase() === 'postgraduate');

  return (
    <div className="pg-container">
      <div className="pg-wrapper">
        <h1 className="pg-title">Our Programmes</h1>

        {/* Undergraduate Section */}
        <section id="undergraduate">
          <h2 className="pg-section-title">Undergraduate Programmes</h2>
          <div className="pg-grid">
            {undergraduateProgrammes.length > 0 ? undergraduateProgrammes.map((programme) => (
              <div className="pg-card" key={programme.id}>
                <div className="pg-icon">{programme.image}</div>
                <h3 className="pg-card-title">{programme.title}</h3>

                <div className="pg-tags">
                  <span className="tag tag-blue">{programme.faculty}</span>
                  <span className="tag tag-green">{programme.duration}</span>
                  <span className="tag tag-yellow">{programme.level}</span>
                </div>

                <p className="pg-description">{programme.description}</p>

                <button className="pg-button" onClick={() => setShowEnrollmentForm(true)}>
                  Apply Now
                </button>
              </div>
            )) : <p>No undergraduate programmes available.</p>}
          </div>
        </section>

        {/* Postgraduate Section */}
        <section id="postgraduate">
          <h2 className="pg-section-title">Postgraduate Programmes</h2>
          <div className="pg-grid">
            {postgraduateProgrammes.length > 0 ? postgraduateProgrammes.map((programme) => (
              <div className="pg-card" key={programme.id}>
                <div className="pg-icon">{programme.image}</div>
                <h3 className="pg-card-title">{programme.title}</h3>

                <div className="pg-tags">
                  <span className="tag tag-blue">{programme.faculty}</span>
                  <span className="tag tag-green">{programme.duration}</span>
                  <span className="tag tag-yellow">{programme.level}</span>
                </div>

                <p className="pg-description">{programme.description}</p>

                <button className="pg-button" onClick={() => setShowEnrollmentForm(true)}>
                  Apply Now
                </button>
              </div>
            )) : <p>No postgraduate programmes available.</p>}
          </div>
        </section>

        {showEnrollmentForm && (
          <div className="pg-modal">
            <div className="pg-modal-box">
              <div className="pg-modal-header">
                <h2>Enrollment Application</h2>
                <button className="pg-close-btn" onClick={() => setShowEnrollmentForm(false)}>×</button>
              </div>

              {message && (
                <div className={`pg-alert ${message.includes('successful') ? 'pg-success' : 'pg-error'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="pg-two-grid">
                  <div className="pg-field">
                    <label>First Name *</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                  </div>

                  <div className="pg-field">
                    <label>Last Name *</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="pg-field">
                  <label>Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>

                <div className="pg-two-grid">
                  <div className="pg-field">
                    <label>Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                  </div>

                  <div className="pg-field">
                    <label>NIC Number *</label>
                    <input type="text" name="nicNumber" value={formData.nicNumber} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="pg-field">
                  <label>Programmes *</label>
                  <select name="programme" value={formData.programme} onChange={handleInputChange} required>
                    <option value="">Select a programme</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.title}>{course.title} - {course.category}</option>
                    ))}
                  </select>
                </div>

                <div className="pg-two-grid">
                  <div className="pg-field">
                    <label>Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} />
                  </div>

                  <div className="pg-field">
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="pg-field">
                  <label>Address *</label>
                  <textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" required />
                </div>

                <div className="pg-actions">
                  <button type="button" className="pg-cancel" onClick={() => setShowEnrollmentForm(false)}>Cancel</button>
                  <button type="submit" className="pg-submit" disabled={loading}>
                    {loading ? 'Submitting…' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Programmes;
