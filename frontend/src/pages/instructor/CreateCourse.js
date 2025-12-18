import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CreateCourse = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    level: 'Beginner',
    duration: '',
    courseContent: ['']
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newCourse = {
      id: Date.now().toString(),
      ...formData,
      instructor: currentUser.name,
      enrollments: 0,
      rating: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const courses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
    courses.push(newCourse);
    localStorage.setItem('adminCourses', JSON.stringify(courses));

    navigate('/instructor/dashboard');
  };

  const addContentItem = () => {
    setFormData({
      ...formData,
      courseContent: [...formData.courseContent, '']
    });
  };

  const updateContentItem = (index, value) => {
    const updated = [...formData.courseContent];
    updated[index] = value;
    setFormData({ ...formData, courseContent: updated });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Course</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Course Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Price ($)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              required
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Duration</label>
            <input
              type="text"
              placeholder="e.g., 25 hours"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Course Content</label>
            {formData.courseContent.map((item, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Lesson ${index + 1}`}
                value={item}
                onChange={(e) => updateContentItem(index, e.target.value)}
                className="w-full p-3 border rounded-lg mb-2 focus:ring-2 focus:ring-blue-500"
              />
            ))}
            <button
              type="button"
              onClick={addContentItem}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add Lesson
            </button>
          </div>
          
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Create Course
            </button>
            <button
              type="button"
              onClick={() => navigate('/instructor/dashboard')}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;