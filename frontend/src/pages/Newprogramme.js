import React from "react";
import "./NewProgramme.css";
import { useNavigate } from 'react-router-dom';
import { useProgrammes } from '../hooks/useProgrammes';

const NewProgrammes = () => {
  const navigate = useNavigate();
  const { data: programmes, loading } = useProgrammes();

  if (loading) {
    return <div className="programmes-section">Loading...</div>;
  }

  if (!programmes || programmes.length === 0) {
    return null;
  }

  return (
    <div className="programmes-section">
      <h1 className="programmes-title">ONCODE PROGRAMMES</h1>

      <div className="programmes-grid">
        {programmes.map((item) => (
          <div className="programme-card" key={item.id}>
            <div className="programme-icon">{item.category?.charAt(0).toUpperCase() || '📚'}</div>
            <p className="programme-title">{item.title}</p>
            <p style={{fontSize: '0.875rem', color: '#666'}}>{item.duration}</p>
          </div>
        ))}
      </div>

      <button className="apply-btn" onClick={() => navigate("/inquire")}>
        Apply Now
      </button>
    </div>
  );
};

export default NewProgrammes;
