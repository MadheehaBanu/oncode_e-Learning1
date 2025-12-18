import React, { useState } from 'react';
import './StudentEnrollment.css';

const StudentEnrollment = () => {
  const [formData, setFormData] = useState({
    // Basic Information
    fullName: '',
    studentId: '',
    dateOfBirth: '',
    gender: '',
    nationalId: '',
    profilePhoto: null,
    
    // Contact Details
    email: '',
    mobile: '',
    address: '',
    city: '',
    
    // Academic Information
    programme: '',
    faculty: '',
    batch: '',
    enrollmentDate: '',
    currentYear: '',
    status: 'Active',
    
    // Login Credentials
    username: '',
    tempPassword: '',
    role: 'Student',
    
    // Optional Fields
    guardianName: '',
    guardianContact: '',
    notes: '',
    scholarshipStatus: '',
    certificateNumber: '',
    
    // System Fields
    loginStatus: 'Active'
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Student Enrollment Data:', formData);
    // Handle form submission
  };

  return (
    <div className="enrollment-container">
      <div className="enrollment-header">
        <h1>Student Enrollment Form</h1>
        <p>Complete the form below to enroll a new student</p>
      </div>

      <form onSubmit={handleSubmit} className="enrollment-form">
        
        {/* Basic Student Information */}
        <div className="form-section">
          <h2>1. Basic Student Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Student ID / Registration No. *</label>
              <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Date of Birth *</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>National ID / Passport No.</label>
              <input type="text" name="nationalId" value={formData.nationalId} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Profile Photo</label>
              <input type="file" name="profilePhoto" onChange={handleChange} accept="image/*" />
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="form-section">
          <h2>2. Contact Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Mobile Number *</label>
              <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required />
            </div>
            <div className="form-group full-width">
              <label>Address *</label>
              <textarea name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>City / District *</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required />
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="form-section">
          <h2>3. Academic Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Programme Name *</label>
              <select name="programme" value={formData.programme} onChange={handleChange} required>
                <option value="">Select Programme</option>
                <option value="BSc in Computing">BSc in Computing</option>
                <option value="Diploma in Business">Diploma in Business</option>
                <option value="BSc in Engineering">BSc in Engineering</option>
                <option value="Diploma in Design">Diploma in Design</option>
              </select>
            </div>
            <div className="form-group">
              <label>Faculty / Department *</label>
              <select name="faculty" value={formData.faculty} onChange={handleChange} required>
                <option value="">Select Faculty</option>
                <option value="Computing">Computing</option>
                <option value="Business">Business</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
              </select>
            </div>
            <div className="form-group">
              <label>Batch / Intake *</label>
              <input type="text" name="batch" value={formData.batch} onChange={handleChange} placeholder="e.g., 2025 Jan Intake" required />
            </div>
            <div className="form-group">
              <label>Enrollment Date *</label>
              <input type="date" name="enrollmentDate" value={formData.enrollmentDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Current Year / Level *</label>
              <select name="currentYear" value={formData.currentYear} onChange={handleChange} required>
                <option value="">Select Year</option>
                <option value="Year 1">Year 1</option>
                <option value="Year 2">Year 2</option>
                <option value="Year 3">Year 3</option>
                <option value="Year 4">Year 4</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} required>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Graduated">Graduated</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>
        </div>

        {/* Login Credentials */}
        <div className="form-section">
          <h2>4. Login Credentials</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Username *</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Temporary Password *</label>
              <input type="password" name="tempPassword" value={formData.tempPassword} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="Student">Student</option>
                <option value="Class Rep">Class Rep</option>
                <option value="Club Member">Club Member</option>
              </select>
            </div>
          </div>
        </div>

        {/* Optional Fields */}
        <div className="form-section">
          <h2>5. Optional Academic Support Fields</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Guardian / Parent Name</label>
              <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Guardian Contact Number</label>
              <input type="tel" name="guardianContact" value={formData.guardianContact} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Scholarship Status</label>
              <select name="scholarshipStatus" value={formData.scholarshipStatus} onChange={handleChange}>
                <option value="">Select Status</option>
                <option value="Full Scholarship">Full Scholarship</option>
                <option value="Partial Scholarship">Partial Scholarship</option>
                <option value="No Scholarship">No Scholarship</option>
              </select>
            </div>
            <div className="form-group">
              <label>Certificate Number</label>
              <input type="text" name="certificateNumber" value={formData.certificateNumber} onChange={handleChange} />
            </div>
            <div className="form-group full-width">
              <label>Notes / Remarks</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* System Management */}
        <div className="form-section">
          <h2>6. System Management Fields</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Login Status *</label>
              <select name="loginStatus" value={formData.loginStatus} onChange={handleChange} required>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel">Cancel</button>
          <button type="submit" className="btn-submit">Enroll Student</button>
        </div>
      </form>
    </div>
  );
};

export default StudentEnrollment;