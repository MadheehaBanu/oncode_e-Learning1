import React from 'react';
import { Link } from 'react-router-dom';

const SchoolOfBusiness = () => {
  return (
    <div style={{minHeight: '100vh', background: '#f8fafc', paddingTop: '80px'}}>
      <div style={{background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: 'white', padding: '4rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <Link to="/faculties" style={{color: 'rgba(255,255,255,0.8)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block'}}>
            ← Back to Faculties
          </Link>
          <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
            <div style={{width: '100px', height: '100px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'}}>
              💼
            </div>
            <div>
              <h1 style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem'}}>School of Business</h1>
              <p style={{fontSize: '1.25rem', opacity: '0.9'}}>Shaping tomorrow's business leaders and entrepreneurs</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem'}}>
        <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1e293b'}}>Programs Offered</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
          {['MBA', 'Business Administration', 'Marketing', 'Finance', 'Management'].map((program, index) => (
            <div key={index} style={{background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
              <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '1rem'}}>{program}</h3>
              <p style={{color: '#64748b', marginBottom: '1.5rem'}}>
                Comprehensive program designed to provide in-depth knowledge and practical skills in {program.toLowerCase()}.
              </p>
              <button style={{background: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%'}}>
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolOfBusiness;