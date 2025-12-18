import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import '../styles/MyEnrollments.css';

const MyEnrollments = () => {
  const { currentUser } = useAuth();
  const { courses, enrollments, fetchCourses, fetchMyEnrollments } = useData();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [enrichedEnrollments, setEnrichedEnrollments] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchCourses(), fetchMyEnrollments()]);
      } catch (error) {
        console.error('Failed to load enrollments:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    // Enrich enrollments with course data
    const enriched = enrollments.map(enrollment => {
      const course = courses.find(c => c.id === enrollment.courseId);
      return {
        id: enrollment.id,
        courseId: enrollment.courseId,
        courseName: course?.title || 'Course Not Found',
        instructor: course?.instructor || 'Unknown',
        enrollmentDate: enrollment.enrolledAt || enrollment.createdAt || new Date().toISOString(),
        status: enrollment.status || 'active',
        progress: enrollment.progress || 0,
        certificateId: enrollment.certificateId,
        thumbnail: course?.thumbnail || '📚'
      };
    });
    setEnrichedEnrollments(enriched);
  }, [enrollments, courses]);

  const filteredEnrollments = enrichedEnrollments.filter(enrollment => {
    if (filter === 'all') return true;
    return enrollment.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading your enrollments...</div>
      </div>
    );
  }

  return (
    <div className="my-enrollments-container">
      <div className="my-enrollments-header">
        <h1 className="my-enrollments-title">My Learning</h1>
        <p className="my-enrollments-subtitle">Track your enrolled courses and certificates</p>
      </div>

      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { key: 'all', label: 'All Courses', count: enrichedEnrollments.length },
              { key: 'active', label: 'In Progress', count: enrichedEnrollments.filter(e => e.status === 'active').length },
              { key: 'completed', label: 'Completed', count: enrollments.filter(e => e.status === 'completed').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${filter === tab.key
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {filteredEnrollments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No enrollments yet</h3>
          <p className="text-gray-600 mb-4">Start learning by enrolling in your first course</p>
          <Link
            to="/courses"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => (
            <div key={enrollment.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
              <div className="h-40 bg-blue-600 flex items-center justify-center">
                <span className="text-4xl">{enrollment.thumbnail}</span>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                    {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 mb-2">
                  {enrollment.courseName}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{enrollment.instructor}</p>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{enrollment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="my-enrollments-progress-fill"
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    to={`/course/${enrollment.courseId}`}
                    className="block w-full bg-purple-600 text-white text-center py-2 rounded font-medium hover:bg-purple-700 transition"
                  >
                    Continue Learning
                  </Link>

                  {enrollment.status === 'completed' && enrollment.certificateId && (
                    <Link
                      to={`/verify-certificate?id=${enrollment.certificateId}`}
                      className="block w-full bg-green-600 text-white text-center py-2 rounded font-medium hover:bg-green-700 transition"
                    >
                      View Certificate
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEnrollments;