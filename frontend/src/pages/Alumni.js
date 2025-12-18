import React, { useState } from 'react';

const Alumni = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const alumniData = [
    {
      id: 1,
      name: 'Sarah Johnson',
      program: 'Software Engineering',
      graduationYear: '2023',
      currentPosition: 'Senior Developer at Google',
      company: 'Google',
      image: '/images/alumni1.jpg',
      category: 'tech',
      testimonial: 'OnCode gave me the skills and confidence to land my dream job at Google.'
    },
    {
      id: 2,
      name: 'Michael Chen',
      program: 'Business Administration',
      graduationYear: '2022',
      currentPosition: 'Product Manager at Microsoft',
      company: 'Microsoft',
      image: '/images/alumni2.jpg',
      category: 'business',
      testimonial: 'The business program at OnCode prepared me for real-world challenges.'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      program: 'Digital Marketing',
      graduationYear: '2023',
      currentPosition: 'Marketing Director at Spotify',
      company: 'Spotify',
      image: '/images/alumni3.jpg',
      category: 'marketing',
      testimonial: 'OnCode\'s practical approach to learning made all the difference in my career.'
    },
    {
      id: 4,
      name: 'David Kim',
      program: 'Data Science',
      graduationYear: '2022',
      currentPosition: 'Data Scientist at Netflix',
      company: 'Netflix',
      image: '/images/alumni4.jpg',
      category: 'tech',
      testimonial: 'The data science program equipped me with cutting-edge skills.'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      program: 'UX Design',
      graduationYear: '2023',
      currentPosition: 'Lead Designer at Adobe',
      company: 'Adobe',
      image: '/images/alumni5.jpg',
      category: 'design',
      testimonial: 'OnCode\'s design program helped me build an impressive portfolio.'
    },
    {
      id: 6,
      name: 'James Wilson',
      program: 'Cybersecurity',
      graduationYear: '2022',
      currentPosition: 'Security Engineer at Amazon',
      company: 'Amazon',
      image: '/images/alumni6.jpg',
      category: 'tech',
      testimonial: 'The hands-on cybersecurity training was invaluable for my career.'
    }
  ];

  const categories = [
    { key: 'all', label: 'All Alumni' },
    { key: 'tech', label: 'Technology' },
    { key: 'business', label: 'Business' },
    { key: 'design', label: 'Design' },
    { key: 'marketing', label: 'Marketing' }
  ];

  const filteredAlumni = selectedCategory === 'all' 
    ? alumniData 
    : alumniData.filter(alumni => alumni.category === selectedCategory);

  const stats = [
    { number: '5,000+', label: 'Graduates' },
    { number: '95%', label: 'Employment Rate' },
    { number: '150+', label: 'Partner Companies' },
    { number: '$75K', label: 'Average Salary' }
  ];

  return (
    <div style={{minHeight: '100vh', background: '#f8fafc', paddingTop: '80px'}}>
      {/* Hero Section */}
      <div style={{background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: 'white', padding: '4rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center'}}>
          <h1 style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem'}}>Our Alumni</h1>
          <p style={{fontSize: '1.25rem', opacity: '0.9'}}>Celebrating the success stories of OnCode graduates worldwide</p>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{background: 'white', padding: '3rem 0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem'}}>
            {stats.map((stat, index) => (
              <div key={index} style={{textAlign: 'center'}}>
                <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem'}}>
                  {stat.number}
                </div>
                <div style={{color: '#64748b', fontSize: '1rem'}}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem'}}>
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem'}}>
          {categories.map(category => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                border: 'none',
                background: selectedCategory === category.key ? '#2563eb' : 'white',
                color: selectedCategory === category.key ? 'white' : '#64748b',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Alumni Grid */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem'}}>
          {filteredAlumni.map(alumni => (
            <div key={alumni.id} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '1.5rem'}}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginRight: '1rem'
                }}>
                  {alumni.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.25rem'}}>
                    {alumni.name}
                  </h3>
                  <p style={{color: '#64748b', fontSize: '0.9rem'}}>Class of {alumni.graduationYear}</p>
                </div>
              </div>
              
              <div style={{marginBottom: '1rem'}}>
                <p style={{fontWeight: '600', color: '#2563eb', marginBottom: '0.25rem'}}>
                  {alumni.currentPosition}
                </p>
                <p style={{color: '#64748b', fontSize: '0.9rem'}}>
                  {alumni.program} • {alumni.company}
                </p>
              </div>
              
              <blockquote style={{
                fontStyle: 'italic',
                color: '#475569',
                borderLeft: '3px solid #2563eb',
                paddingLeft: '1rem',
                margin: 0
              }}>
                "{alumni.testimonial}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{background: '#f1f5f9', padding: '4rem 0', marginTop: '4rem'}}>
        <div style={{maxWidth: '800px', margin: '0 auto', padding: '0 2rem', textAlign: 'center'}}>
          <h2 style={{fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem'}}>
            Join Our Alumni Network
          </h2>
          <p style={{color: '#64748b', marginBottom: '2rem', fontSize: '1.1rem'}}>
            Connect with fellow graduates, access exclusive opportunities, and continue your professional growth.
          </p>
          <button style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '25px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
          }}>
            Register as Alumni
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alumni;