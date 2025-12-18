import React from 'react';
import { useForeignAffiliations } from '../hooks/useAffiliations';

const ForeignAffiliations = () => {
  const { data: affiliations, loading } = useForeignAffiliations();

  if (loading) {
    return <div style={{padding: '3rem 0', textAlign: 'center'}}>Loading...</div>;
  }

  if (!affiliations || affiliations.length === 0) {
    return null;
  }

  return (
    <div style={{padding: '3rem 0', background: '#f8fafc'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
        <h2 style={{fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem', color: '#1e293b'}}>
          Foreign Affiliations
        </h2>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap'}}>
          {affiliations.map((aff) => (
            <div key={aff.id} style={{textAlign: 'center'}}>
              <img 
                src={aff.logo}
                alt={aff.name}
                style={{height: '60px', objectFit: 'contain', opacity: '0.7', transition: 'opacity 0.3s'}}
                onMouseOver={(e) => e.target.style.opacity = '1'}
                onMouseOut={(e) => e.target.style.opacity = '0.7'}
              />
              <p style={{fontSize: '0.875rem', marginTop: '0.5rem', color: '#666'}}>{aff.name} ({aff.country})</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForeignAffiliations;
