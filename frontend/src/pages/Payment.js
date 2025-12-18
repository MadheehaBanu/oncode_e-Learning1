import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { coursesAPI } from '../services/api';
import PaymentForm from '../components/PaymentForm';
import '../styles/PaymentForm.css';

const Payment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchCourse();
  }, [courseId, currentUser, navigate]);

  const fetchCourse = async () => {
    try {
      const adminCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
      const adminCourse = adminCourses.find(course => course.id === courseId);
      
      if (adminCourse) {
        setCourse(adminCourse);
      } else {
        const courseData = await coursesAPI.getCourse(courseId);
        setCourse(courseData);
      }
    } catch (error) {
      setError('Course not found');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      navigate('/my-enrollments');
    }, 2000);
  };

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={() => navigate('/courses')}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
          <p className="text-gray-600">You are now enrolled in {course?.title}</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
          <p className="text-gray-600">Secure payment powered by Stripe</p>
        </div>

        {course && (
          <PaymentForm
            course={course}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;