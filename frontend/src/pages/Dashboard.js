import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [certificates, setCertificates] = useState([]);
  
  const userEnrollments = JSON.parse(localStorage.getItem('userEnrollments') || '[]').filter(e => e.userId === currentUser?.id);
  const adminCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
  
  useEffect(() => {
    // Load user's quiz data
    const userQuizzes = JSON.parse(localStorage.getItem('userQuizzes') || '[]').filter(q => q.userId === currentUser?.id);
    setQuizzes(userQuizzes.slice(0, 3));
    
    // Load user's certificates
    const userCertificates = JSON.parse(localStorage.getItem('userCertificates') || '[]').filter(c => c.userId === currentUser?.id);
    setCertificates(userCertificates.slice(0, 2));
  }, [currentUser]);
  
  const stats = {
    enrolled: userEnrollments.length,
    completed: userEnrollments.filter(e => e.status === 'completed').length,
    inProgress: userEnrollments.filter(e => e.status !== 'completed').length,
    certificates: certificates.length,
    quizzesTaken: quizzes.length,
    avgScore: quizzes.length > 0 ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length) : 0
  };

  const recentCourses = userEnrollments.slice(0, 3).map(enrollment => {
    const course = adminCourses.find(c => c.id === enrollment.courseId);
    return course ? { ...course, progress: enrollment.progress || 0, enrollment } : null;
  }).filter(Boolean);

  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 ? 'Good Morning' : currentTime < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {greeting}, {currentUser?.name?.split(' ')[0] || 'Student'}! 👋
        </h1>
        <p className="text-gray-600 text-lg">Ready to continue your learning journey?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Enrolled</p>
              <p className="text-3xl font-bold text-blue-600">{stats.enrolled}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold text-orange-600">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Certificates</p>
              <p className="text-3xl font-bold text-purple-600">{stats.certificates}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Quizzes</p>
              <p className="text-3xl font-bold text-indigo-600">{stats.quizzesTaken}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Avg Score</p>
              <p className="text-3xl font-bold text-pink-600">{stats.avgScore}%</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Continue Learning</h2>
              <Link to="/student/enrollments" className="text-blue-600 hover:text-blue-800 font-medium">
                View All →
              </Link>
            </div>
            
            {recentCourses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Your Learning Journey</h3>
                <p className="text-gray-500 mb-6">Explore our courses and begin your path to success</p>
                <Link to="/courses" className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
                        {course.thumbnail || '📖'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{course.title}</h3>
                        <p className="text-gray-500 text-sm mb-2">{course.instructor}</p>
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-600">{course.progress}%</span>
                        </div>
                        {course.enrollment?.nextQuiz && (
                          <p className="text-xs text-orange-600 font-medium">📝 Quiz available</p>
                        )}
                      </div>
                      <Link 
                        to={`/course/${course.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Continue
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Recent Quiz Results */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Quiz Results</h2>
              <Link to="/student/results" className="text-blue-600 hover:text-blue-800 font-medium">
                View All →
              </Link>
            </div>
            
            {quizzes.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">📝</span>
                <p className="text-gray-500">No quizzes taken yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {quizzes.map((quiz, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">{quiz.courseName}</h4>
                      <p className="text-sm text-gray-500">{quiz.quizTitle}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        quiz.score >= 80 ? 'text-green-600' : 
                        quiz.score >= 60 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {quiz.score}%
                      </div>
                      <p className="text-xs text-gray-500">{new Date(quiz.completedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Certificates */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">My Certificates</h3>
              <Link to="/student/results" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All →
              </Link>
            </div>
            
            {certificates.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">🏆</span>
                <p className="text-gray-500 text-sm">Complete courses to earn certificates</p>
              </div>
            ) : (
              <div className="space-y-4">
                {certificates.map((cert, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">🏆</span>
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm">{cert.courseName}</h4>
                        <p className="text-xs text-gray-500">{new Date(cert.issuedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Link 
                      to={`/verify-certificate?id=${cert.certificateId}`}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Certificate →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Learning Streak */}
          <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl">🔥</span>
              <div>
                <h3 className="text-xl font-bold">Learning Streak</h3>
                <p className="text-orange-100 text-sm">Keep it up!</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">7</div>
              <p className="text-orange-100 text-sm">Days in a row</p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/courses" className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Browse Courses
              </Link>
              <Link to="/student/enrollments" className="block w-full bg-gray-100 text-gray-700 text-center py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                My Enrollments
              </Link>
              <Link to="/verify-certificate" className="block w-full bg-green-100 text-green-700 text-center py-3 rounded-lg hover:bg-green-200 transition-colors font-medium">
                Verify Certificate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;