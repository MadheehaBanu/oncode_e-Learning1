import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PaymentSuccess.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { course, amount } = location.state || {};

  if (!course) {
    navigate('/courses');
    return null;
  }

  return (
    <div className="payment-success-container">
      <div className="success-content">
        <div className="success-icon">
          <div className="checkmark">✓</div>
        </div>
        
        <h1>Payment Successful!</h1>
        <p className="success-message">
          Congratulations! You have successfully enrolled in the course.
        </p>

        <div className="course-details">
          <div className="course-info">
            <div className="course-thumbnail">
              {course.thumbnail || '📚'}
            </div>
            <div>
              <h3>{course.title}</h3>
              <p>by {course.instructor}</p>
              <div className="amount-paid">Amount Paid: ${amount}</div>
            </div>
          </div>
        </div>

        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>📧 Check your email for enrollment confirmation</li>
            <li>📚 Access your course materials immediately</li>
            <li>🎓 Start learning at your own pace</li>
            <li>🏆 Earn your certificate upon completion</li>
          </ul>
        </div>

        <div className="action-buttons">
          <button 
            onClick={() => navigate('/my-enrollments')}
            className="primary-btn"
          >
            Go to My Courses
          </button>
          <button 
            onClick={() => navigate('/courses')}
            className="secondary-btn"
          >
            Browse More Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;