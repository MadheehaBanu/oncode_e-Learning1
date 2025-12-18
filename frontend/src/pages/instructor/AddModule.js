import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AddModule = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    content: '',
    videoUrl: '',
    duration: ''
  });

  useEffect(() => {
    loadInstructorCourses();
  }, [currentUser]);

  const loadInstructorCourses = () => {
    const allCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
    const instructorCourses = allCourses.filter(c => c.instructor === currentUser?.name);
    setCourses(instructorCourses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Module added successfully!');
        navigate('/instructor/dashboard');
      }
    } catch (error) {
      // Fallback to localStorage
      const modules = JSON.parse(localStorage.getItem('courseModules') || '[]');
      const newModule = {
        id: `mod-${Date.now()}`,
        ...formData,
        instructorId: currentUser.id,
        createdAt: new Date().toISOString()
      };
      
      modules.push(newModule);
      localStorage.setItem('courseModules', JSON.stringify(modules));
      
      alert('Module added successfully!');
      navigate('/instructor/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add Course Module</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select Course *</label>
            <select
              required
              value={formData.courseId}
              onChange={(e) => setFormData({...formData, courseId: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Module Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Introduction to JavaScript"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the module"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Module Content *</label>
            <textarea
              rows="8"
              required
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed content of the module..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Video URL</label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/video.mp4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 45 minutes"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Add Module
            </button>
            <button
              type="button"
              onClick={() => navigate('/instructor/dashboard')}
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

export default AddModule;