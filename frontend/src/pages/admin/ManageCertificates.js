import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const ManageCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [completionPeriod, setCompletionPeriod] = useState({ start: '', end: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCertificate, setNewCertificate] = useState({
    id: '',
    studentName: '',
    courseName: '',
    instructor: ''
  });

  useEffect(() => {
    const storedCertificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    setCertificates(storedCertificates);
  }, []);

  const issueCertificate = (enrollmentId, studentName, courseName, instructor) => {
    const certificateId = `OC-${new Date().getFullYear()}-${String(certificates.length + 1).padStart(3, '0')}`;
    
    const newCertificate = {
      certificateId,
      certificateNo: certificateId,
      enrollmentId,
      studentName,
      courseName,
      instructor,
      issuedAt: new Date().toISOString(),
      status: 'active'
    };

    const updatedCertificates = [...certificates, newCertificate];
    setCertificates(updatedCertificates);
    localStorage.setItem('certificates', JSON.stringify(updatedCertificates));
    
    // Also store in adminCertificates for verification
    const adminCertificates = JSON.parse(localStorage.getItem('adminCertificates') || '[]');
    adminCertificates.push(newCertificate);
    localStorage.setItem('adminCertificates', JSON.stringify(adminCertificates));

    // Update enrollment record
    const enrollments = JSON.parse(localStorage.getItem('userEnrollments') || '[]');
    const updatedEnrollments = enrollments.map(e => 
      e.id === enrollmentId ? { ...e, certificateIssued: true, certificateId } : e
    );
    localStorage.setItem('userEnrollments', JSON.stringify(updatedEnrollments));
  };

  const revokeCertificate = (certificateId) => {
    if (window.confirm('Are you sure you want to revoke this certificate?')) {
      const updatedCertificates = certificates.map(cert => 
        cert.certificateId === certificateId ? { ...cert, status: 'revoked' } : cert
      );
      setCertificates(updatedCertificates);
      localStorage.setItem('certificates', JSON.stringify(updatedCertificates));
    }
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const generateStudentId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `STU${year}${random}`;
  };

  const addCertificate = () => {
    if (!newCertificate.id || !newCertificate.studentName || !newCertificate.courseName || !newCertificate.instructor) {
      alert('Please fill all fields');
      return;
    }

    const certificate = {
      certificateId: newCertificate.id,
      certificateNo: newCertificate.id,
      studentName: newCertificate.studentName,
      courseName: newCertificate.courseName,
      instructor: newCertificate.instructor,
      issuedAt: new Date().toISOString(),
      status: 'active'
    };

    const updatedCertificates = [...certificates, certificate];
    setCertificates(updatedCertificates);
    localStorage.setItem('certificates', JSON.stringify(updatedCertificates));
    
    // Also store in adminCertificates for verification
    const adminCertificates = JSON.parse(localStorage.getItem('adminCertificates') || '[]');
    adminCertificates.push(certificate);
    localStorage.setItem('adminCertificates', JSON.stringify(adminCertificates));
    
    setShowAddModal(false);
    setNewCertificate({ id: '', studentName: '', courseName: '', instructor: '' });
    alert('Certificate added successfully!');
  };

  const bulkIssueCertificates = () => {
    if (!selectedCourse || !completionPeriod.start || !completionPeriod.end || excelData.length === 0) {
      alert('Please fill all fields and upload Excel file');
      return;
    }

    const courses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
    const course = courses.find(c => c.id === selectedCourse);
    
    if (!course) {
      alert('Selected course not found');
      return;
    }

    const newCertificates = excelData.map((student, index) => {
      const studentId = student.studentId || generateStudentId();
      const certificateId = `OC-${new Date().getFullYear()}-${String(certificates.length + index + 1).padStart(3, '0')}`;
      
      return {
        certificateId,
        studentId,
        studentName: student.studentName || student.name,
        courseName: course.title,
        instructor: course.instructor,
        completionDate: student.completionDate,
        issuedAt: new Date().toISOString(),
        status: 'active',
        bulkIssued: true
      };
    });

    const updatedCertificates = [...certificates, ...newCertificates];
    setCertificates(updatedCertificates);
    localStorage.setItem('certificates', JSON.stringify(updatedCertificates));
    
    setShowBulkModal(false);
    setExcelData([]);
    setSelectedCourse('');
    setCompletionPeriod({ start: '', end: '' });
    
    alert(`${newCertificates.length} certificates issued successfully!`);
  };

  const getCompletedEnrollments = () => {
    const enrollments = JSON.parse(localStorage.getItem('userEnrollments') || '[]');
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const courses = JSON.parse(localStorage.getItem('adminCourses') || '[]');

    return enrollments
      .filter(e => e.status === 'completed' && !e.certificateIssued)
      .map(enrollment => {
        const user = users.find(u => u.id === enrollment.userId);
        const course = courses.find(c => c.id === enrollment.courseId);
        return {
          ...enrollment,
          studentName: user?.name || 'Unknown',
          courseName: course?.title || 'Unknown',
          instructor: course?.instructor || 'Unknown'
        };
      });
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesFilter = filter === 'all' || cert.status === filter;
    const matchesSearch = cert.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.certificateId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const completedEnrollments = getCompletedEnrollments();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Manage Certificates</h1>
          <p className="text-slate-600">Issue and manage course completion certificates</p>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition transform hover:-translate-y-1"
          >
            Add Certificate
          </button>
          <button
            onClick={() => setShowBulkModal(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition transform hover:-translate-y-1"
          >
            Bulk Issue Certificates
          </button>
        </div>
      </div>

      {completedEnrollments.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg border-2 border-green-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Pending Certificates</h2>
          <div className="space-y-3">
            {completedEnrollments.map(enrollment => (
              <div key={enrollment.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">{enrollment.studentName}</p>
                  <p className="text-sm text-green-700">{enrollment.courseName} - {enrollment.instructor}</p>
                </div>
                <button
                  onClick={() => issueCertificate(enrollment.id, enrollment.studentName, enrollment.courseName, enrollment.instructor)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Issue Certificate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg border-2 border-blue-100 p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Certificates</option>
              <option value="active">Active</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Certificate ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Issue Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCertificates.map(cert => (
              <tr key={cert.certificateId} className="hover:bg-blue-50">
                <td className="px-6 py-4 text-sm font-medium text-blue-900">{cert.certificateId}</td>
                <td className="px-6 py-4 text-sm text-blue-800">{cert.studentName}</td>
                <td className="px-6 py-4 text-sm text-blue-800">{cert.courseName}</td>
                <td className="px-6 py-4 text-sm text-blue-800">{new Date(cert.issuedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    cert.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {cert.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">View</button>
                  {cert.status === 'active' && (
                    <button 
                      onClick={() => revokeCertificate(cert.certificateId)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Add Certificate</h2>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Certificate ID (e.g., OC-2024-001)"
                value={newCertificate.id}
                onChange={(e) => setNewCertificate({...newCertificate, id: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Student Name"
                value={newCertificate.studentName}
                onChange={(e) => setNewCertificate({...newCertificate, studentName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Course Name"
                value={newCertificate.courseName}
                onChange={(e) => setNewCertificate({...newCertificate, courseName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Instructor Name"
                value={newCertificate.instructor}
                onChange={(e) => setNewCertificate({...newCertificate, instructor: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCertificate({ id: '', studentName: '', courseName: '', instructor: '' });
                }}
                className="flex-1 bg-slate-300 text-slate-700 py-2 px-4 rounded hover:bg-slate-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={addCertificate}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded hover:from-blue-700 hover:to-blue-800 transition"
              >
                Add Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Bulk Issue Certificates</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose a course</option>
                  {JSON.parse(localStorage.getItem('adminCourses') || '[]').map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Completion Period Start</label>
                  <input
                    type="date"
                    value={completionPeriod.start}
                    onChange={(e) => setCompletionPeriod(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Completion Period End</label>
                  <input
                    type="date"
                    value={completionPeriod.end}
                    onChange={(e) => setCompletionPeriod(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Excel File</label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Excel should contain columns: studentName, studentId (optional), completionDate
                </p>
              </div>

              {excelData.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Preview ({excelData.length} students)</h3>
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left">Student Name</th>
                          <th className="px-3 py-2 text-left">Student ID</th>
                          <th className="px-3 py-2 text-left">Completion Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {excelData.slice(0, 5).map((student, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-3 py-2">{student.studentName || student.name}</td>
                            <td className="px-3 py-2">{student.studentId || 'Auto-generated'}</td>
                            <td className="px-3 py-2">{student.completionDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {excelData.length > 5 && (
                      <p className="text-center py-2 text-gray-500">...and {excelData.length - 5} more</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowBulkModal(false);
                  setExcelData([]);
                  setSelectedCourse('');
                  setCompletionPeriod({ start: '', end: '' });
                }}
                className="flex-1 bg-slate-300 text-slate-700 py-2 px-4 rounded hover:bg-slate-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={bulkIssueCertificates}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded hover:from-green-700 hover:to-green-800 transition"
              >
                Issue Certificates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCertificates;