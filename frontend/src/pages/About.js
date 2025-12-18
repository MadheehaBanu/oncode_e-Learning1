import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/About.css';
import ForeignAffiliations from '../components/ForeignAffiliations';
const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      const docRef = doc(db, 'settings', 'about');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAboutData(docSnap.data());
      }
    } catch (error) {
      console.error('Error loading about data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!aboutData) {
    return <div className="flex justify-center items-center h-screen">Unable to load content</div>;
  }

  return (
    <div className="about-container">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>About OnCode</h1>
          <p>
            Empowering learners worldwide with quality programming education and industry-recognized certifications.
          </p>
        </div>
      </div>

      <div className="about-content">
        <div className="about-content-container">
          <div className="about-mission-grid">
            <div className="about-mission">
              <h2>Our Mission</h2>
              <p>{aboutData.mission}</p>
            </div>
            <div className="about-feature-card">
              <div className="icon">🎯</div>
              <h3>Quality Education</h3>
              <p>Industry-standard courses with verified certifications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-impact">
        <div className="about-content-container">
          <h2>Our Impact</h2>
          <div className="about-stats-grid">
            <div>
              <div className="about-stat-number blue-700">{aboutData.studentsCount}</div>
              <p className="about-stat-label">Students Enrolled</p>
            </div>
            <div>
              <div className="about-stat-number blue-600">{aboutData.coursesCount}</div>
              <p className="about-stat-label">Courses Available</p>
            </div>
            <div>
              <div className="about-stat-number blue-500">{aboutData.instructorsCount}</div>
              <p className="about-stat-label">Expert Instructors</p>
            </div>
            <div>
              <div className="about-stat-number blue-800">{aboutData.successRate}</div>
              <p className="about-stat-label">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

    <ForeignAffiliations />
    </div>
  );
};

export default About;