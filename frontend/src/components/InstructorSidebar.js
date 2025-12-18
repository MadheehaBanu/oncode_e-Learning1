import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const InstructorSidebar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const menuItems = [
    { path: '/instructor/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/instructor/create-course', label: 'Create Course', icon: '📚' },
    { path: '/instructor/quizzes', label: 'Manage Quizzes', icon: '📝' },
    { path: '/instructor/assignments', label: 'Assignments', icon: '📋' },
    { path: '/instructor/students', label: 'My Students', icon: '👥' },
     ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40 pt-16">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {currentUser?.name?.charAt(0).toUpperCase() || 'I'}
          </div>
          <div>
            <h3 className="font-semibold">{currentUser?.name || 'Instructor'}</h3>
            <p className="text-sm text-gray-600">{currentUser?.role || 'Instructor'}</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default InstructorSidebar;