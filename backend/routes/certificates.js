const express = require('express');
const router = express.Router();

// Verify certificate endpoint - using Firestore
router.post('/verify', async (req, res) => {
  try {
    const { certificateNo, certificateId } = req.body;
    const certId = (certificateNo || certificateId || '').toUpperCase();

    if (!certId) {
      return res.status(400).json({
        success: false,
        error: 'Certificate number is required'
      });
    }

    // Query Firestore for the certificate
    const certificatesRef = global.db.collection('certificates');
    const snapshot = await certificatesRef.where('certificateId', '==', certId).get();

    if (snapshot.empty) {
      return res.json({
        success: false,
        message: 'Certificate not found. Please check the certificate number and try again.'
      });
    }

    const certificateDoc = snapshot.docs[0];
    const certificate = {
      id: certificateDoc.id,
      certificateId: certId,
      ...certificateDoc.data()
    };

    res.json({
      success: true,
      message: 'Verification successful — the entered certificate number is authentic and valid.',
      certificate
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify certificate'
    });
  }
});

// Generate certificate for completed course
router.post('/generate', async (req, res) => {
  try {
    const { studentId, courseId, studentName, courseName, instructor, enrollmentId } = req.body;

    if (!studentId || !courseId || !studentName || !courseName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Check if certificate already exists
    const certificatesRef = global.db.collection('certificates');
    const existingSnapshot = await certificatesRef
      .where('studentId', '==', studentId)
      .where('courseId', '==', courseId)
      .get();

    if (!existingSnapshot.empty) {
      const existing = existingSnapshot.docs[0];
      return res.json({
        success: true,
        certificate: { id: existing.id, ...existing.data() }
      });
    }

    // Generate new certificate ID
    const allCertsSnapshot = await certificatesRef.get();
    const certificateId = `OC-${new Date().getFullYear()}-${String(allCertsSnapshot.size + 1).padStart(3, '0')}`;

    const certificateData = {
      certificateId,
      studentId,
      courseId,
      studentName,
      courseName,
      instructor: instructor || 'OnCode Instructor',
      issuedAt: new Date().toISOString(),
      verificationUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-certificate?id=${certificateId}`,
      createdAt: new Date().toISOString()
    };

    if (enrollmentId) {
      certificateData.enrollmentId = enrollmentId;
    }

    const docRef = await certificatesRef.add(certificateData);

    res.json({
      success: true,
      message: 'Certificate generated successfully',
      certificate: { id: docRef.id, ...certificateData }
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate certificate'
    });
  }
});

// Admin: Get all certificates
router.get('/', async (req, res) => {
  try {
    const certificatesRef = global.db.collection('certificates');
    const snapshot = await certificatesRef.orderBy('issuedAt', 'desc').get();

    const certificates = [];
    snapshot.forEach(doc => {
      certificates.push({ id: doc.id, ...doc.data() });
    });

    res.json(certificates);
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// Get user's certificates
router.get('/my', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const certificatesRef = global.db.collection('certificates');
    const snapshot = await certificatesRef
      .where('studentId', '==', userId)
      .orderBy('issuedAt', 'desc')
      .get();

    const certificates = [];
    snapshot.forEach(doc => {
      certificates.push({ id: doc.id, ...doc.data() });
    });

    res.json(certificates);
  } catch (error) {
    console.error('Get user certificates error:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// Admin: Add certificate manually
router.post('/', async (req, res) => {
  try {
    const { id, certificateId, studentName, courseName, instructor, studentId, courseId } = req.body;

    const certId = (certificateId || id || '').toUpperCase();

    if (!certId || !studentName || !courseName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const certificateData = {
      certificateId: certId,
      studentName,
      courseName,
      instructor: instructor || 'OnCode Instructor',
      issuedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    if (studentId) certificateData.studentId = studentId;
    if (courseId) certificateData.courseId = courseId;

    const certificatesRef = global.db.collection('certificates');
    const docRef = await certificatesRef.add(certificateData);

    res.json({
      success: true,
      certificate: { id: docRef.id, ...certificateData }
    });
  } catch (error) {
    console.error('Add certificate error:', error);
    res.status(500).json({ error: 'Failed to add certificate' });
  }
});

module.exports = router;