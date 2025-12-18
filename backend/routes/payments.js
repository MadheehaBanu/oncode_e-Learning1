const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    const { courseId, amount } = req.body;
    
    // Get course details
    const courseDoc = await db.collection('courses').doc(courseId).get();
    if (!courseDoc.exists) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const course = courseDoc.data();
    
    // Create payment intent with 3D Secure
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      confirmation_method: 'manual',
      confirm: true,
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic'
        }
      },
      metadata: {
        courseId: courseId,
        userId: req.user.id,
        courseName: course.title
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Confirm payment and create enrollment
router.post('/confirm-payment', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId, courseId } = req.body;
    
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Check if already enrolled
    const existingEnrollment = await db.collection('enrollments')
      .where('userId', '==', req.user.id)
      .where('courseId', '==', courseId)
      .get();

    if (!existingEnrollment.empty) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollmentData = {
      userId: req.user.id,
      courseId: courseId,
      enrollmentDate: new Date(),
      progress: 0,
      status: 'active',
      paymentStatus: 'completed',
      paymentId: paymentIntentId,
      amount: paymentIntent.amount / 100
    };

    const enrollmentRef = await db.collection('enrollments').add(enrollmentData);
    
    // Update course student count
    const courseRef = db.collection('courses').doc(courseId);
    await courseRef.update({
      studentsCount: admin.firestore.FieldValue.increment(1)
    });

    res.json({
      success: true,
      enrollmentId: enrollmentRef.id,
      message: 'Payment successful and enrollment created'
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Get payment history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const enrollments = await db.collection('enrollments')
      .where('userId', '==', req.user.id)
      .where('paymentStatus', '==', 'completed')
      .get();

    const payments = [];
    for (const doc of enrollments.docs) {
      const enrollment = doc.data();
      const courseDoc = await db.collection('courses').doc(enrollment.courseId).get();
      
      payments.push({
        id: doc.id,
        courseId: enrollment.courseId,
        courseName: courseDoc.exists ? courseDoc.data().title : 'Unknown Course',
        amount: enrollment.amount,
        paymentId: enrollment.paymentId,
        date: enrollment.enrollmentDate,
        status: enrollment.paymentStatus
      });
    }

    res.json(payments);
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ error: 'Failed to get payment history' });
  }
});

module.exports = router;