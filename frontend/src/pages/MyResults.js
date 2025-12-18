import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { certificatesAPI } from '../services/api';

const MyResults = () => {
  const { currentUser } = useAuth();
  const [certificateNo, setCertificateNo] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [showTranscriptForm, setShowTranscriptForm] = useState(false);
  const [transcriptData, setTranscriptData] = useState({
    fullName: '',
    studentId: '',
    nationalId: '',
    email: '',
    contact: '',
    program: '',
    batch: '',
    completionYear: '',
    purpose: ''
  });
  const [transcriptSubmitted, setTranscriptSubmitted] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certificateNo.trim()) return;

    try {
      // Call backend API to verify certificate
      const response = await certificatesAPI.verifyCertificate(certificateNo.trim());

      if (response.data && response.data.success) {
        setVerificationResult({
          success: true,
          message: response.data.message || 'Verification successful — the entered certificate number is authentic.'
        });
      } else {
        setVerificationResult({
          success: false,
          message: response.data?.message || 'Certificate not found. Please verify the certificate number and try again.'
        });
      }
    } catch (error) {
      console.error('Certificate verification error:', error);
      setVerificationResult({
        success: false,
        message: 'Failed to verify certificate. Please try again later.'
      });
    }
  };

  const handleTranscriptSubmit = (e) => {
    e.preventDefault();
    // Send email (mock implementation)
    console.log('Transcript request submitted:', transcriptData);
    setTranscriptSubmitted(true);
    setShowTranscriptForm(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Certificate Verification</h1>
            <p style={{ color: '#64748b' }}>Enter a certificate number to verify its authenticity</p>
          </div>

          <form onSubmit={handleVerify} style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Certificate No</label>
              <input
                type="text"
                value={certificateNo}
                onChange={(e) => setCertificateNo(e.target.value)}
                placeholder="Enter Certificate No"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: '#2563eb',
                color: 'white',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Verify
            </button>
          </form>

          {verificationResult && (
            <div style={{
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              background: verificationResult.success ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${verificationResult.success ? '#bbf7d0' : '#fecaca'}`,
              color: verificationResult.success ? '#166534' : '#dc2626'
            }}>
              <p style={{ fontWeight: '500' }}>{verificationResult.message}</p>
            </div>
          )}

          <button
            onClick={() => setShowTranscriptForm(true)}
            style={{
              width: '100%',
              background: '#059669',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            Request Transcript
          </button>

          {transcriptSubmitted && (
            <div style={{
              padding: '1rem',
              borderRadius: '8px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#166534',
              textAlign: 'center'
            }}>
              <p style={{ fontWeight: '500' }}>Your request has been submitted successfully. The administration will contact you shortly.</p>
            </div>
          )}
        </div>

        {showTranscriptForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Request Transcript</h2>

              <form onSubmit={handleTranscriptSubmit}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Full Name (as per records)</label>
                    <input type="text" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                      value={transcriptData.fullName} onChange={(e) => setTranscriptData({ ...transcriptData, fullName: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Student ID / Registration Number</label>
                    <input type="text" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                      value={transcriptData.studentId} onChange={(e) => setTranscriptData({ ...transcriptData, studentId: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>National ID / Passport Number</label>
                    <input type="text" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                      value={transcriptData.nationalId} onChange={(e) => setTranscriptData({ ...transcriptData, nationalId: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Email Address</label>
                    <input type="email" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                      value={transcriptData.email} onChange={(e) => setTranscriptData({ ...transcriptData, email: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Contact Number</label>
                    <input type="tel" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                      value={transcriptData.contact} onChange={(e) => setTranscriptData({ ...transcriptData, contact: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Program / Course Name</label>
                    <input type="text" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                      value={transcriptData.program} onChange={(e) => setTranscriptData({ ...transcriptData, program: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Batch / Year of Enrollment</label>
                    <input type="text" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                      value={transcriptData.batch} onChange={(e) => setTranscriptData({ ...transcriptData, batch: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Completion Year / Expected Graduation Year</label>
                    <input type="text" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                      value={transcriptData.completionYear} onChange={(e) => setTranscriptData({ ...transcriptData, completionYear: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Purpose of Request</label>
                    <textarea required style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', minHeight: '80px' }}
                      value={transcriptData.purpose} onChange={(e) => setTranscriptData({ ...transcriptData, purpose: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button type="button" onClick={() => setShowTranscriptForm(false)}
                    style={{ flex: 1, padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit"
                    style={{ flex: 1, padding: '0.75rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyResults;