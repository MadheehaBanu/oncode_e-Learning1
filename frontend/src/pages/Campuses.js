import React from 'react';
import './Campuses.css';

const Campuses = () => {
  const campuses = [
    {
      id: 1,
      name: 'Main Campus',
      location: 'London, United Kingdom',
      description: 'Our flagship campus featuring state-of-the-art facilities and modern learning environments.',
      image: '/images/campus1.jpg',
      facilities: ['Library', 'Labs', 'Sports Complex', 'Cafeteria']
    }
  ];

  return (
    <div className="campuses-container">
      <div className="campuses-content">
        <h1 className="campuses-title">Our Campuses</h1>
        <p className="campuses-subtitle">
          Discover our world-class campuses designed to provide exceptional learning experiences
        </p>
        
        <div className="campuses-grid">
          {campuses.map((campus) => (
            <div key={campus.id} className="campus-card">
              <div className="campus-image">
                <img src={campus.image} alt={campus.name} />
              </div>
              <div className="campus-info">
                <h3 className="campus-name">{campus.name}</h3>
                <p className="campus-location">📍 {campus.location}</p>
                <p className="campus-description">{campus.description}</p>
                <div className="campus-facilities">
                  <h4>Facilities:</h4>
                  <ul>
                    {campus.facilities.map((facility, index) => (
                      <li key={index}>{facility}</li>
                    ))}
                  </ul>
                </div>
                <button className="campus-btn">Learn More</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Campuses;