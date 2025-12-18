import React, { useState } from 'react';

const TestCourses = () => {
  const [courses] = useState([
    {
      id: '1',
      title: 'Test Course 1',
      instructor: 'Test Instructor',
      price: 99.99,
      category: 'Web Development',
      level: 'beginner',
      rating: 4.5,
      students: '1000',
      duration: '10 hours',
      thumbnail: '📚'
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Test Courses Page</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white border rounded-lg shadow-md p-4">
            <div className="text-4xl mb-4">{course.thumbnail}</div>
            <h3 className="font-bold text-lg mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-2">{course.instructor}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">${course.price}</span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Enroll
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCourses;