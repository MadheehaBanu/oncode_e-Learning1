import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const InstructorDashboard = () => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [earnings, setEarnings] = useState({ total: 0, thisMonth: 0 });
  const [students, setStudents] = useState(0);

  useEffect(() => {
    loadInstructorData();
  }, [currentUser]);

  const loadInstructorData = () => {
    const allCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
    const instructorCourses = allCourses.filter(c => c.instructor === currentUser?.name);
    setCourses(instructorCourses);

    const enrollments = JSON.parse(localStorage.getItem('userEnrollments') || '[]');
    const totalStudents = enrollments.filter(e => 
      instructorCourses.some(c => c.id === e.courseId)
    ).length;
    setStudents(totalStudents);

    const totalEarnings = instructorCourses.reduce((sum, course) => 
      sum + (course.price * course.enrollments || 0), 0
    );
    setEarnings({ total: totalEarnings, thisMonth: totalEarnings * 0.3 });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Welcome back, {currentUser?.name}! 👨🏫
        </h1>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
            <div className="text-gray-600">My Courses</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-2xl font-bold text-green-600">{students}</div>
            <div className="text-gray-600">Total Students</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-2xl font-bold text-purple-600">${earnings.total}</div>
            <div className="text-gray-600">Total Earnings</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-2xl font-bold text-orange-600">${earnings.thisMonth}</div>
            <div className="text-gray-600">This Month</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/instructor/create-course" className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition-colors">
            <div className="text-2xl mb-2">📚</div>
            <div className="font-semibold">Create New Course</div>
          </Link>
          <Link to="/instructor/quizzes" className="bg-green-600 text-white p-6 rounded-xl hover:bg-green-700 transition-colors">
            <div className="text-2xl mb-2">📝</div>
            <div className="font-semibold">Manage Quizzes</div>
          </Link>
          <Link to="/instructor/assignments" className="bg-purple-600 text-white p-6 rounded-xl hover:bg-purple-700 transition-colors">
            <div className="text-2xl mb-2">📋</div>
            <div className="font-semibold">Review Assignments</div>
          </Link>
          <Link to="/instructor/add-module" className="bg-indigo-600 text-white p-6 rounded-xl hover:bg-indigo-700 transition-colors">
            <div className="text-2xl mb-2">📝</div>
            <div className="font-semibold">Add Module</div>
          </Link>
        </div>

        {/* My Courses */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">My Courses</h2>
          {courses.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📚</div>
              <p className="text-gray-600 mb-4">No courses created yet</p>
              <Link to="/instructor/create-course" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Create Your First Course
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <div key={course.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-bold">${course.price}</span>
                    <Link to={`/instructor/course/${course.id}`} className="text-blue-600 hover:text-blue-800">
                      Manage →
                    </Link>
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

export default InstructorDashboard;