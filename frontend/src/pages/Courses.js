import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import '../styles/Courses.css';

const Courses = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  const [filters, setFilters] = useState({
    category: categoryFromUrl || 'all',
    level: 'all',
    price: 'all'
  });

  const { courses, fetchCourses, loading } = useData();

  // Load courses from backend on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Update filter when URL changes
  useEffect(() => {
    if (categoryFromUrl) {
      setFilters(prev => ({ ...prev, category: categoryFromUrl }));
    }
  }, [categoryFromUrl]);

  const filteredCourses = courses.filter(course => {
    if (filters.category !== 'all' && course.category !== filters.category) return false;
    if (filters.level !== 'all' && course.level !== filters.level) return false;
    if (filters.price !== 'all') {
      if (filters.price === 'free' && course.price > 0) return false;
      if (filters.price === 'paid' && course.price === 0) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">All Courses</h1>
        <p className="text-slate-600">Choose from {courses.length} online video courses</p>
      </div>

      <div className="bg-white border-2 border-blue-100 rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Filter by</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Mobile Development">Mobile Development</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">Level</label>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">Price</label>
            <select
              value={filters.price}
              onChange={(e) => setFilters({ ...filters, price: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No courses available</p>
          <p className="text-gray-500">Admin needs to add courses first</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white border border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
              <div className="relative">
                <div className="h-44 bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-600 flex items-center justify-center">
                  <span className="text-4xl">{course.thumbnail}</span>
                </div>
                <div className="absolute top-3 left-3 bg-black/20 backdrop-blur-sm rounded-lg px-2 py-1">
                  <span className="text-white text-xs font-semibold">{course.level}</span>
                </div>
                <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm">
                  <button className="text-slate-400 hover:text-red-500 transition">
                    ♡
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-bold text-slate-800 text-base leading-tight mb-1 group-hover:text-blue-600 transition">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500">{course.instructor}</p>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <span className="text-amber-400 text-sm">★</span>
                    <span className="text-sm font-medium text-slate-700">{course.rating}</span>
                    <span className="text-xs text-slate-400">({course.students})</span>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{course.duration}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-slate-800">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </div>
                  <Link
                    to={`/course/${course.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                  >
                    Enroll Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;