import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { courseId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  const course = JSON.parse(localStorage.getItem('adminCourses') || '[]')
    .find(c => c.id === courseId);

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Create enrollment
      const enrollment = {
        id: Date.now().toString(),
        userId: currentUser.id,
        courseId: courseId,
        status: 'active',
        progress: 0,
        enrolledAt: new Date().toISOString(),
        paymentAmount: course.price,
        paymentMethod: paymentMethod
      };

      const enrollments = JSON.parse(localStorage.getItem('userEnrollments') || '[]');
      enrollments.push(enrollment);
      localStorage.setItem('userEnrollments', JSON.stringify(enrollments));

      // Send email notification to admin
      fetch('http://localhost:5000/api/notifications/enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName: currentUser.name,
          studentEmail: currentUser.email,
          courseName: course.title,
          coursePrice: course.price
        })
      }).catch(error => {
        console.log('Email notification failed:', error);
      });

      // Local notification
      const notification = {
        id: Date.now().toString(),
        userId: currentUser.id,
        type: 'enrollment',
        title: 'Course Enrollment Successful',
        message: `You have successfully enrolled in ${course.title}`,
        read: false,
        createdAt: new Date().toISOString()
      };

      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.push(notification);
      localStorage.setItem('notifications', JSON.stringify(notifications));

      navigate('/payment-success', { state: { course, enrollment } });
    }, 2000);
  };

  if (!course) {
    return <div className="min-h-screen flex items-center justify-center">Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Course Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="border-b pb-4 mb-4">
              <h3 className="font-semibold">{course.title}</h3>
              <p className="text-gray-600 text-sm">{course.instructor}</p>
              <p className="text-gray-600 text-sm">{course.duration}</p>
            </div>
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span>${course.price}</span>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
            
            <form onSubmit={handlePayment}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    Credit/Debit Card
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    PayPal
                  </label>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full p-3 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full p-3 border rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {processing ? 'Processing...' : `Pay $${course.price}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;