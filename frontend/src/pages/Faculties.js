import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { facultyService } from '../services/facultyService';
import './Faculties.css';

const Faculties = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const data = await facultyService.getAllFaculties();
        setFaculties(data);
      } catch (err) {
        setError('Failed to load faculties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, []);

  if (loading) {
    return (
      <div className="faculties-container">
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p>Loading faculties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="faculties-container">
        <div style={{ textAlign: 'center', padding: '4rem', color: 'red' }}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="faculties-container">

      {/* Hero Section */}
      <div className="faculties-hero">
        <div className="faculties-hero-content">
          <h1>Our Faculties</h1>
          <p>Discover world-class education across diverse academic disciplines</p>
        </div>
      </div>

      {/* Grid */}
      <div className="faculties-grid-container">
        <div className="faculties-grid">
          {faculties.map(faculty => (
            <div key={faculty.id} className="faculty-card">

              <div className="faculty-icon" style={{ background: faculty.color }}>
                {faculty.icon}
              </div>

              <h3 className="faculty-name">{faculty.name}</h3>
              <p className="faculty-description">{faculty.description}</p>

              <div>
                <h4 className="program-title">Programs Offered:</h4>
                <div className="program-list">
                  {faculty.programs.map((program, index) => (
                    <span
                      key={index}
                      className="program-chip"
                      style={{
                        background: `${faculty.color}15`,
                        color: faculty.color,
                      }}
                    >
                      {program}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                className="faculty-button"
                style={{ background: faculty.color }}
                to={`/faculties/${faculty.slug}`}
              >
                Learn More
              </Link>

            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Academic Journey?</h2>
          <p>
            Explore our comprehensive programs and find the perfect fit for your career goals.
          </p>
          <button className="cta-button">Apply Now</button>
        </div>
      </div>
    </div>
  );
};

export default Faculties;
