import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usersAPI, apiUtils } from '../../services/api';

const CreateStudent = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    fullName: '',
    studentId: '',
    dateOfBirth: '',
    gender: '',
    nationalId: '',
    profilePhoto: '',

    // Contact Details
    email: '',
    mobile: '',
    address: '',
    city: '',

    // Academic Information
    programme: '',
    faculty: '',
    batch: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    currentYear: 'Year 1',
    status: 'Active',

    // Login Credentials
    username: '',
    temporaryPassword: '',
    role: 'Student',

    // Optional Fields
    guardianName: '',
    guardianContact: '',
    notes: '',
    scholarshipStatus: 'No',
    certificateNumber: '',

    // System Fields
    loginStatus: 'Active'
  });

  const generateStudentId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `STU${year}${random}`;
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const studentId = formData.studentId || generateStudentId();
      const temporaryPassword = formData.temporaryPassword || generatePassword();

      // Map to API structure
      const apiData = {
        name: formData.fullName,
        email: formData.email,
        role: 'student',
        password: temporaryPassword,
        age: calculateAge(formData.dateOfBirth), // Helper 
        phone: formData.mobile,
        address: formData.address,
        city: formData.city,
        country: 'Sri Lanka', // Default
        // Extended fields can be added to the user profile or separate collection if needed. 
        // For now, mapping core fields to User and extended to 'profile' if backend supported it.
        // Since backend users route mainly handles basic info, we'll stick to that.
        // If we need to save extended info (programme, batch etc), we might need to 
        // update backend schema or use 'metadata' field. 
        // Assuming backend user schema is flexible or ignore extra for login critical part.
        // Actually, let's pass a few specific ones if we can. 
        studentId: studentId,
        programme: formData.programme,
        faculty: formData.faculty
      };

      await usersAPI.createUser(apiData);

      alert(`Student created successfully!\nEmail: ${formData.email}\nPassword: ${temporaryPassword}`);
      navigate('/admin/users');
    } catch (error) {
      console.error('Error creating student:', error);
      alert('Failed to create student: ' + apiUtils.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return '';
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'email' && !prev.username && { username: value })
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Student Account</h1>
          <button
            onClick={() => navigate('/admin/users')}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Back to Users
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="Auto-generated if empty"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">National ID / Passport</label>
                <input
                  type="text"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Contact Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <textarea
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City / District</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Academic Information - Reduced for brevity in UI but kept in state */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Academic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Programme Name *</label>
                <select
                  name="programme"
                  required
                  value={formData.programme}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Programme</option>
                  <option value="BSc in Computing">BSc in Computing</option>
                  <option value="Diploma in Business">Diploma in Business</option>
                  <option value="Certificate in Web Development">Certificate in Web Development</option>
                  <option value="MSc in Data Science">MSc in Data Science</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Faculty / Department</label>
                <select
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Faculty</option>
                  <option value="Computing">Computing</option>
                  <option value="Business">Business</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                </select>
              </div>
            </div>
          </div>

          {/* Login Credentials */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Login Credentials</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Username (Email)</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username || formData.email}
                  disabled
                  className="w-full p-3 border rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Temporary Password</label>
                <div className="flex">
                  <input
                    type="text"
                    name="temporaryPassword"
                    value={formData.temporaryPassword}
                    onChange={handleChange}
                    placeholder="Auto-generated if empty"
                    className="flex-1 p-3 border rounded-l-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, temporaryPassword: generatePassword() }))}
                    className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Student Account'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudent;