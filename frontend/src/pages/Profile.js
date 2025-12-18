import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    age: currentUser?.age || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    country: currentUser?.country || '',
    bio: 'Passionate learner exploring the world of programming and technology.',
    joinDate: currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
    skills: ['JavaScript', 'React', 'Node.js', 'Python']
  });
  
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        age: currentUser.age || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        country: currentUser.country || '',
        bio: 'Passionate learner exploring the world of programming and technology.',
        joinDate: currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        skills: ['JavaScript', 'React', 'Node.js', 'Python']
      });
    }
  }, [currentUser]);

  const userEnrollments = JSON.parse(localStorage.getItem('userEnrollments') || '[]').filter(e => e.userId === currentUser?.id);
  const adminCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
  
  const stats = {
    coursesEnrolled: userEnrollments.length,
    coursesCompleted: userEnrollments.filter(e => e.status === 'completed').length,
    certificatesEarned: userEnrollments.filter(e => e.certificateIssued).length,
    learningHours: userEnrollments.length * 10
  };

  const enrolledCourses = userEnrollments.map(enrollment => {
    const course = adminCourses.find(c => c.id === enrollment.courseId);
    return {
      id: enrollment.courseId,
      title: course?.title || 'Course Not Found',
      progress: enrollment.progress || 0,
      status: enrollment.status === 'completed' ? 'Completed' : 'In Progress',
      thumbnail: course?.thumbnail || '📚'
    };
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">✓</span>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{formData.name || 'User'}</h1>
            <p className="text-gray-600 text-lg capitalize mb-2">{currentUser?.role} • Member since {formData.joinDate}</p>
            <p className="text-gray-500">{formData.email || 'No email provided'}</p>
            
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              {formData.skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Enrolled Courses</p>
              <p className="text-3xl font-bold text-blue-600">{stats.coursesEnrolled}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.coursesCompleted}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Certificates</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.certificatesEarned}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Learning Hours</p>
              <p className="text-3xl font-bold text-purple-600">{stats.learningHours}h</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-xl">📧</span>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full font-medium text-gray-800 bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{formData.email || 'Not provided'}</p>
                )}
              </div>
            </div>
            
            {currentUser?.studentId && (
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                <span className="text-xl">🆔</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Student ID</p>
                  <p className="font-mono font-bold text-blue-700">{currentUser.studentId}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-xl">🎂</span>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Age</p>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full font-medium text-gray-800 bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{formData.age || 'Not provided'}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-xl">📱</span>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Phone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full font-medium text-gray-800 bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{formData.phone || 'Not provided'}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-xl">🌍</span>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Location</p>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="flex-1 font-medium text-gray-800 bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="flex-1 font-medium text-gray-800 bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  </div>
                ) : (
                  <p className="font-medium text-gray-800">
                    {formData.city && formData.country ? `${formData.city}, ${formData.country}` : 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2">About Me</h3>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                className="w-full text-gray-600 text-sm bg-white border border-gray-300 rounded px-3 py-2 resize-none"
              />
            ) : (
              <p className="text-gray-600 text-sm">{formData.bio}</p>
            )}
          </div>
        </div>

        {/* My Courses */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Learning Journey</h2>
            <Link to="/my-enrollments" className="text-blue-600 hover:text-blue-800 font-medium">
              View All →
            </Link>
          </div>
          
          {enrolledCourses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Courses Yet</h3>
              <p className="text-gray-500 mb-6">Start your learning journey by enrolling in a course</p>
              <Link to="/courses" className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {enrolledCourses.slice(0, 4).map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl">
                      {course.thumbnail}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm">{course.title}</h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        course.status === 'Completed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;