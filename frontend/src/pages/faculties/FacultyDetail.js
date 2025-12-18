import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { facultyService } from '../../services/facultyService';

const FacultyDetail = () => {
  const { slug } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const data = await facultyService.getFacultyBySlug(slug);
        setFaculty(data);
      } catch (err) {
        setError('Faculty not found');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [slug]);

  if (loading) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !faculty) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <p style={{color: 'red', marginBottom: '1rem'}}>{error}</p>
        <Link to="/faculties" style={{color: '#2563eb'}}>Back to Faculties</Link>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', background: '#f8fafc', paddingTop: '80px'}}>
      <div style={{background: `linear-gradient(135deg, ${faculty.color} 0%, ${faculty.color}dd 100%)`, color: 'white', padding: '4rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <Link to="/faculties" style={{color: 'rgba(255,255,255,0.8)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block'}}>
            ← Back to Faculties
          </Link>
          <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
            <div style={{width: '100px', height: '100px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'}}>
              {faculty.icon}
            </div>
            <div>
              <h1 style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem'}}>{faculty.name}</h1>
              <p style={{fontSize: '1.25rem', opacity: '0.9'}}>{faculty.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem'}}>
        <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1e293b'}}>Programs Offered</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
          {faculty.programs.map((program, index) => (
            <div key={index} style={{background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
              <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', color: faculty.color, marginBottom: '1rem'}}>{program}</h3>
              <p style={{color: '#64748b', marginBottom: '1.5rem'}}>
                Comprehensive program designed to provide in-depth knowledge and practical skills in {program.toLowerCase()}.
              </p>
              <button style={{background: faculty.color, color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%'}}>
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultyDetail;
