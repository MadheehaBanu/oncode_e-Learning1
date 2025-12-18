const express = require('express');
const { body, validationResult } = require('express-validator');
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

// Validation rules for enrollment
const enrollmentValidation = [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('nicNumber').trim().isLength({ min: 10 }).withMessage('NIC number must be at least 10 characters'),
  body('programme').notEmpty().withMessage('Please select a programme'),
  body('address').trim().isLength({ min: 10 }).withMessage('Address must be at least 10 characters')
];

// Submit enrollment application
router.post('/apply', enrollmentValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      nicNumber,
      programme,
      address,
      dateOfBirth,
      gender
    } = req.body;

    // Create enrollment record
    const enrollmentData = {
      firstName,
      lastName,
      email,
      phone,
      nicNumber,
      programme,
      address,
      dateOfBirth,
      gender,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      id: Date.now().toString()
    };

    // Save to mock database
    const enrollmentsCollection = global.db.collection('enrollments');
    await enrollmentsCollection.add(enrollmentData);

    // Send email notification
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@oncode.com',
        to: process.env.ADMIN_EMAIL || 'admin@gist.edu',
        subject: 'New Enrollment Application - OnCode Campus',
        html: `
          <h2>New Enrollment Application</h2>
          <p>A new student has applied for enrollment:</p>
          
          <h3>Student Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${firstName} ${lastName}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>NIC Number:</strong> ${nicNumber}</li>
            <li><strong>Programme:</strong> ${programme}</li>
            <li><strong>Address:</strong> ${address}</li>
            <li><strong>Date of Birth:</strong> ${dateOfBirth}</li>
            <li><strong>Gender:</strong> ${gender}</li>
          </ul>
          
          <p><strong>Application Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Status:</strong> Pending Review</p>
          
          <p>Please review this application in the admin dashboard.</p>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Enrollment notification email sent successfully');
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the enrollment if email fails
    }

    res.json({
      success: true,
      message: 'Thank you for applying! Your submission was successful. We will contact you soon with further details.',
      data: {
        enrollmentId: enrollmentData.id,
        submittedAt: enrollmentData.submittedAt
      }
    });

  } catch (error) {
    console.error('Enrollment submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit enrollment application',
      error: error.message
    });
  }
});

// Get all enrollments (admin only)
router.get('/applications', async (req, res) => {
  try {
    const enrollmentsCollection = global.db.collection('enrollments');
    const enrollmentsSnapshot = await enrollmentsCollection.get();
    
    const enrollments = [];
    enrollmentsSnapshot.forEach(doc => {
      enrollments.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollment applications',
      error: error.message
    });
  }
});

module.exports = router;