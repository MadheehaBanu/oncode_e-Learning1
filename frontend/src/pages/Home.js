import React, { useState, useEffect } from 'react';
import StatisticsSection from '../components/StatisticsSection';
import ProfessionalAffiliations from '../components/ProfessionalAffiliations';
import ForeignAffiliations from '../components/ForeignAffiliations';
import './Home.css';
import NewProgrammes from './Newprogramme';
import { useNavigate, Link } from 'react-router-dom';

import { useContent } from '../hooks/useContent';

const Home = () => {
  const { banners, faculties, bannersLoading, facultiesLoading } = useContent();
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Sort banners and faculties by order
  const sortedBanners = banners?.sort((a, b) => a.order - b.order) || [];
  const sortedFaculties = faculties?.sort((a, b) => a.order - b.order) || [];

  useEffect(() => {
    if (sortedBanners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % sortedBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sortedBanners.length]);

  if (bannersLoading || facultiesLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="home-container">
      {/* Banner */}
      <div className="banner">
        <div
          className="banner-slider"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {sortedBanners.map((slide) => (
            <div
              key={slide.id}
              className="banner-slide"
              style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url(${slide.image})` }}
            >
              <div className="banner-content">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <button>{slide.buttonText}</button>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="banner-dots">
          {sortedBanners.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>
      </div>

      {/* Faculties */}
      <div className="faculties-section">
        <h2>Our Faculties</h2>
        <div className="faculties-grid">
          {sortedFaculties.map((faculty) => (
            <div key={faculty.id} className="faculty-card flip-card">
              <div className="flip-card-inner">
                <div
                  className="flip-card-front"
                  style={{ backgroundImage: `url(${faculty.image})` }}
                >
                  <div className="faculty-icon">{faculty.icon}</div>
                </div>
                <div className="flip-card-back">
                  <h3>{faculty.name}</h3>
                  <p>{faculty.description}</p>

                  <button className="learn-more-btn" onClick={() => navigate(`/faculties/${faculty.slug}`)} >
                    Learn More</button>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProfessionalAffiliations />
      <ForeignAffiliations />
      <StatisticsSection />
      <NewProgrammes />
      {/* Added Gallery Slider at the bottom */}
    </div>
  );
};

export default Home;
