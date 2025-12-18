import React from 'react';
import { Link } from 'react-router-dom';

const SchoolOfComputing = () => {
  return (
    <div style={{minHeight: '100vh', background: '#f8fafc', paddingTop: '80px'}}>
      <div style={{background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: 'white', padding: '4rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <Link to="/faculties" style={{color: 'rgba(255,255,255,0.8)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block'}}>
            ← Back to Faculties
          </Link>
          <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
            <div style={{width: '100px', height: '100px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'}}>
              💻
            </div>
            <div>
              <h1 style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem'}}>School of Computing</h1>
              <p style={{fontSize: '1.25rem', opacity: '0.9'}}>Leading innovation in technology and software development</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem'}}>
        <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1e293b'}}>Programs Offered</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
          {['Computer Science', 'Software Engineering', 'Data Science', 'Cybersecurity', 'AI & ML'].map((program, index) => (
            <div key={index} style={{background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
              <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#059669', marginBottom: '1rem'}}>{program}</h3>
              <p style={{color: '#64748b', marginBottom: '1.5rem'}}>
                Cutting-edge program in {program.toLowerCase()} with hands-on experience and industry partnerships.
              </p>
              <button style={{background: '#059669', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%'}}>
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolOfComputing;