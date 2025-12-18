import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';

const ManageCourses = () => {
  const { courses, fetchCourses, addCourse, updateCourse, deleteCourse, loading: dataLoading } = useData();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewCourse, setPreviewCourse] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    category: '',
    price: '',
    description: '',
    duration: '',
    level: 'Beginner',
    requirements: '',
    whatYouLearn: '',
    courseContent: '',
    status: 'draft'
  });

  useEffect(() => {
    // Load courses from backend on component mount
    fetchCourses();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      instructor: '',
      category: '',
      price: '',
      description: '',
      duration: '',
      level: 'Beginner',
      requirements: '',
      whatYouLearn: '',
      courseContent: '',
      status: 'draft'
    });
    setEditingCourse(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const courseData = {
        title: formData.title,
        instructor: formData.instructor,
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        description: formData.description,
        duration: formData.duration,
        level: formData.level,
        requirements: formData.requirements.split('\n').filter(req => req.trim()),
        whatYouLearn: formData.whatYouLearn.split('\n').filter(item => item.trim()),
        courseContent: formData.courseContent.split('\n').filter(content => content.trim()),
        status: formData.status
      };

      if (editingCourse) {
        await updateCourse(editingCourse.id, courseData);
      } else {
        await addCourse(courseData);
      }

      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save course:', error);
      alert('Failed to save course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      instructor: course.instructor,
      category: course.category,
      price: course.price.toString(),
      description: course.description || '',
      duration: course.duration || '',
      level: course.level || 'Beginner',
      requirements: Array.isArray(course.requirements) ? course.requirements.join('\n') : '',
      whatYouLearn: Array.isArray(course.whatYouLearn) ? course.whatYouLearn.join('\n') : '',
      courseContent: Array.isArray(course.courseContent) ? course.courseContent.join('\n') : '',
      status: course.status
    });
    setShowAddModal(true);
  };

  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === 'all' || course.status === filter;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (courseId, newStatus) => {
    try {
      await updateCourse(courseId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update course status:', error);
      alert('Failed to update course status.');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(courseId);
      } catch (error) {
        console.error('Failed to delete course:', error);
        alert('Failed to delete course. Please try again.');
      }
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-slate-600">Loading courses...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Manage Courses</h1>
          <p className="text-slate-600">Add, edit, and manage all courses</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition transform hover:-translate-y-1"
        >
          Add New Course
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg border-2 border-blue-100 p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">Search Courses</label>
            <input
              type="text"
              placeholder="Search by title or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Courses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Enrollments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-blue-900">{course.title}</div>
                      <div className="text-sm text-slate-500">
                        ⭐ {course.rating > 0 ? course.rating : 'No ratings'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                    {course.instructor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                    ${course.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                    {course.enrollments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={course.status}
                      onChange={(e) => handleStatusChange(course.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(course.status)}`}
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setPreviewCourse(course);
                        setShowPreviewModal(true);
                      }}
                      className="text-green-600 hover:text-green-900"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Course Title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="text"
                name="instructor"
                placeholder="Instructor Name"
                value={formData.instructor}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Programming Languages">Programming Languages</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                </select>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="price"
                  placeholder="Price ($)"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  step="0.01"
                  min="0"
                  required
                />
                <input
                  type="text"
                  name="duration"
                  placeholder="Duration (e.g., 25 hours)"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <textarea
                name="description"
                placeholder="Course Description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <textarea
                name="requirements"
                placeholder="Course Requirements (one per line)\ne.g.:\nBasic computer skills\nNo programming experience required"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <textarea
                name="whatYouLearn"
                placeholder="What You'll Learn (one per line)\ne.g.:\nBuild web applications\nLearn JavaScript fundamentals\nCreate responsive designs"
                value={formData.whatYouLearn}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <textarea
                name="courseContent"
                placeholder="Course Content/Curriculum (one per line)\ne.g.:\nIntroduction to Web Development\nHTML & CSS Basics\nJavaScript Fundamentals\nBuilding Projects"
                value={formData.courseContent}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-slate-300 text-slate-700 py-2 px-4 rounded hover:bg-slate-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded hover:from-blue-700 hover:to-blue-800 transition"
                >
                  {editingCourse ? 'Update Course' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Preview Modal */}
      {showPreviewModal && previewCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center text-3xl">
                    {previewCourse.thumbnail || '📚'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{previewCourse.title}</h2>
                    <p className="text-blue-100">by {previewCourse.instructor}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{previewCourse.category}</span>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{previewCourse.level}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">${previewCourse.price}</div>
                  <div className="text-sm text-gray-600">Price</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{previewCourse.enrollments}</div>
                  <div className="text-sm text-gray-600">Enrollments</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{previewCourse.duration}</div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600">{previewCourse.description || 'No description available'}</p>
                </div>

                {previewCourse.requirements && previewCourse.requirements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Requirements</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {previewCourse.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {previewCourse.whatYouLearn && previewCourse.whatYouLearn.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">What You'll Learn</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {previewCourse.whatYouLearn.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {previewCourse.courseContent && previewCourse.courseContent.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Course Content</h3>
                    <div className="space-y-2">
                      {previewCourse.courseContent.map((content, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{content}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${previewCourse.status === 'active' ? 'bg-green-100 text-green-800' :
                        previewCourse.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {previewCourse.status.charAt(0).toUpperCase() + previewCourse.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Created: {new Date(previewCourse.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setShowPreviewModal(false);
                        handleEdit(previewCourse);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Edit Course
                    </button>
                    <button
                      onClick={() => setShowPreviewModal(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;