const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = global.db;

const router = express.Router();

// Enroll in course
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    // Check if course exists
    const courseDoc = await db.collection('courses').doc(courseId).get();
    if (!courseDoc.exists) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await db.collection('enrollments')
      .where('userId', '==', userId)
      .where('courseId', '==', courseId)
      .get();

    if (!existingEnrollment.empty) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollmentData = {
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      status: 'active',
      completedLessons: [],
      certificateIssued: false
    };

    const enrollmentRef = await db.collection('enrollments').add(enrollmentData);

    // Update course enrollment count
    const courseData = courseDoc.data();
    await db.collection('courses').doc(courseId).update({
      enrollments: (courseData.enrollments || 0) + 1
    });

    res.status(201).json({
      message: 'Enrolled successfully',
      enrollment: {
        id: enrollmentRef.id,
        ...enrollmentData
      }
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

// Get user enrollments
router.get('/my-enrollments', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const enrollmentsSnapshot = await db.collection('enrollments')
      .where('userId', '==', userId)
      .get();

    const enrollments = [];
    
    for (const doc of enrollmentsSnapshot.docs) {
      const enrollmentData = doc.data();
      
      // Get course details
      const courseDoc = await db.collection('courses').doc(enrollmentData.courseId).get();
      const courseData = courseDoc.exists ? courseDoc.data() : null;

      enrollments.push({
        id: doc.id,
        ...enrollmentData,
        course: courseData ? {
          id: courseDoc.id,
          title: courseData.title,
          instructor: courseData.instructor,
          category: courseData.category,
          description: courseData.description
        } : null
      });
    }

    res.json(enrollments);
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

// Update enrollment progress
router.put('/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, completedLessons } = req.body;
    const userId = req.user.id;

    // Verify enrollment belongs to user
    const enrollmentDoc = await db.collection('enrollments').doc(id).get();
    if (!enrollmentDoc.exists) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    const enrollmentData = enrollmentDoc.data();
    if (enrollmentData.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateData = {};
    if (progress !== undefined) updateData.progress = Math.min(100, Math.max(0, progress));
    if (completedLessons) updateData.completedLessons = completedLessons;
    
    // Issue certificate if course is completed
    if (updateData.progress === 100 && !enrollmentData.certificateIssued) {
      updateData.certificateIssued = true;
      updateData.certificateIssuedAt = new Date().toISOString();
      updateData.certificateId = `CERT-${Date.now()}-${userId}`;
    }

    updateData.updatedAt = new Date().toISOString();

    await db.collection('enrollments').doc(id).update(updateData);

    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Verify certificate
router.get('/verify-certificate/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;

    const enrollmentsSnapshot = await db.collection('enrollments')
      .where('certificateId', '==', certificateId)
      .get();

    if (enrollmentsSnapshot.empty) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    const enrollmentDoc = enrollmentsSnapshot.docs[0];
    const enrollmentData = enrollmentDoc.data();

    // Get user and course details
    const userDoc = await db.collection('users').doc(enrollmentData.userId).get();
    const courseDoc = await db.collection('courses').doc(enrollmentData.courseId).get();

    if (!userDoc.exists || !courseDoc.exists) {
      return res.status(404).json({ error: 'Certificate data incomplete' });
    }

    const userData = userDoc.data();
    const courseData = courseDoc.data();

    res.json({
      valid: true,
      certificate: {
        id: certificateId,
        studentName: userData.name,
        courseName: courseData.title,
        instructor: courseData.instructor,
        issuedAt: enrollmentData.certificateIssuedAt,
        completedAt: enrollmentData.updatedAt
      }
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ error: 'Failed to verify certificate' });
  }
});

// Unenroll from course
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify enrollment belongs to user
    const enrollmentDoc = await db.collection('enrollments').doc(id).get();
    if (!enrollmentDoc.exists) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    const enrollmentData = enrollmentDoc.data();
    if (enrollmentData.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete enrollment
    await db.collection('enrollments').doc(id).delete();

    // Update course enrollment count
    const courseDoc = await db.collection('courses').doc(enrollmentData.courseId).get();
    if (courseDoc.exists) {
      const courseData = courseDoc.data();
      await db.collection('courses').doc(enrollmentData.courseId).update({
        enrollments: Math.max(0, (courseData.enrollments || 1) - 1)
      });
    }

    res.json({ message: 'Unenrolled successfully' });
  } catch (error) {
    console.error('Unenroll error:', error);
    res.status(500).json({ error: 'Failed to unenroll from course' });
  }
});

module.exports = router;