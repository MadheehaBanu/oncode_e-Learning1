const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Send enrollment notification
router.post('/enrollment', async (req, res) => {
  const { studentName, studentEmail, courseName, coursePrice } = req.body;
  
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@oncode.com',
      to: 'madheehabanum67@gmail.com',
      subject: 'New Course Enrollment - OnCode',
      html: `
        <h2>New Student Enrollment</h2>
        <p>A new student has enrolled in a course:</p>
        
        <h3>Student Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${studentName}</li>
          <li><strong>Email:</strong> ${studentEmail}</li>
        </ul>
        
        <h3>Course Details:</h3>
        <ul>
          <li><strong>Course:</strong> ${courseName}</li>
          <li><strong>Price:</strong> $${coursePrice}</li>
        </ul>
        
        <p><strong>Enrollment Date:</strong> ${new Date().toLocaleDateString()}</p>
        
        <p>Please check the admin dashboard for more details.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Enrollment notification email sent successfully');
    
    res.json({
      success: true,
      message: 'Notification sent successfully'
    });
  } catch (error) {
    console.error('Failed to send email notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
});

module.exports = router;