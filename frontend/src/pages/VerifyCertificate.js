import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    setLoading(true);
    setError('');
    setCertificate(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/certificates/verify`, {
        certificateId: certificateId.toUpperCase()
      });

      if (response.data.success && response.data.certificate) {
        setCertificate(response.data.certificate);
      } else {
        setError(response.data.message || 'Certificate not found. Please check the certificate ID and try again.');
      }
    } catch (err) {
      console.error('Certificate verification error:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to verify certificate. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTranscriptSubmit = (e) => {
    e.preventDefault();
    console.log('Transcript request submitted:', transcriptData);
    setTranscriptSubmitted(true);
    setShowTranscriptForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6"><br>
          </br>
         <p> Certificate Verification
          </p>
         </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Verify the authenticity of OnCode certificates using the certificate ID
          </p>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Enter Certificate ID
            </h2>

            <form onSubmit={handleVerify} className="max-w-md mx-auto">
              <div className="mb-6">
                <label htmlFor="certificateId" className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate ID
                </label>
                <input
                  type="text"
                  id="certificateId"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder="e.g., OC-2024-001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-lg"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-md font-medium hover:bg-purple-700 transition disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Certificate'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Enter the certificate ID provided upon course completion</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
              <div className="flex items-center">
                <span className="text-2xl mr-3">❌</span>
                <div>
                  <h3 className="font-bold">Certificate Not Found</h3>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {certificate && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-green-600 text-white p-6 text-center">
                <div className="text-4xl mb-2">✅</div>
                <h2 className="text-2xl font-bold">Certificate Verified</h2>
                <p>This certificate is authentic and valid</p>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Certificate ID:</span>
                        <p className="font-medium">{certificate.certificateId}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Student Name:</span>
                        <p className="font-medium">{certificate.studentName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Course Name:</span>
                        <p className="font-medium">{certificate.courseName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Instructor:</span>
                        <p className="font-medium">{certificate.instructor}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Issue Date:</span>
                        <p className="font-medium">{new Date(certificate.issuedAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Course Completed:</span>
                        <p className="font-medium">Yes</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Status:</span>
                        <p className="font-medium text-green-600">Valid & Authentic</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Request Transcript</h2>
            <p className="text-gray-600 text-center mb-6">Need an official transcript? Submit your request below</p>
            
            <button
              onClick={() => setShowTranscriptForm(true)}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-md font-medium hover:bg-green-700 transition"
            >
              Request Transcript
            </button>

            {transcriptSubmitted && (
              <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center">
                <p className="font-medium">Your request has been submitted successfully. The administration will contact you shortly.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showTranscriptForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Request Transcript</h2>
            <form onSubmit={handleTranscriptSubmit}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Full Name (as per records)</label>
                  <input type="text" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }} value={transcriptData.fullName} onChange={(e) => setTranscriptData({ ...transcriptData, fullName: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Student ID / Registration Number</label>
                  <input type="text" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }} value={transcriptData.studentId} onChange={(e) => setTranscriptData({ ...transcriptData, studentId: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>National ID / Passport Number</label>
                  <input type="text" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }} value={transcriptData.nationalId} onChange={(e) => setTranscriptData({ ...transcriptData, nationalId: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Email Address</label>
                  <input type="email" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }} value={transcriptData.email} onChange={(e) => setTranscriptData({ ...transcriptData, email: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Contact Number</label>
                  <input type="tel" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }} value={transcriptData.contact} onChange={(e) => setTranscriptData({ ...transcriptData, contact: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Program / Course Name</label>
                  <input type="text" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }} value={transcriptData.program} onChange={(e) => setTranscriptData({ ...transcriptData, program: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Batch / Year of Enrollment</label>
                  <input type="text" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }} value={transcriptData.batch} onChange={(e) => setTranscriptData({ ...transcriptData, batch: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Completion Year / Expected Graduation Year</label>
                  <input type="text" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }} value={transcriptData.completionYear} onChange={(e) => setTranscriptData({ ...transcriptData, completionYear: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Purpose of Request</label>
                  <textarea required style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', minHeight: '80px' }} value={transcriptData.purpose} onChange={(e) => setTranscriptData({ ...transcriptData, purpose: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => setShowTranscriptForm(false)} style={{ flex: 1, padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ flex: 1, padding: '0.75rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCertificate;