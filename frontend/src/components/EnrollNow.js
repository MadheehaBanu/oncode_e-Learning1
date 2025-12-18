import React from 'react';

const EnrollNow = () => {
  return (
    <div style={{padding: '4rem 0', background: '#2563eb'}}>
      <div style={{maxWidth: '800px', margin: '0 auto', padding: '0 2rem', textAlign: 'center'}}>
        <h2 style={{fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem'}}>
          Ready to Start Your Journey?
        </h2>
        <p style={{fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', marginBottom: '2rem'}}>
          Join thousands of students who have transformed their careers with OnCode
        </p>
        <button style={{
          background: 'white',
          color: '#2563eb',
          padding: '1rem 2.5rem',
          border: 'none',
          borderRadius: '50px',
          fontSize: '1.1rem',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          transition: 'transform 0.3s ease'
        }}
        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
};

export default EnrollNow;