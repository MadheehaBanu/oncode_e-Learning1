const express = require('express');
const router = express.Router();

// Get all programmes from Firestore collection
router.get('/', async (req, res) => {
  try {
    const programmesCollection = global.db.collection('programmes');
    const snapshot = await programmesCollection.get();

    const programmes = [];
    snapshot.forEach(doc => {
      const programme = doc.data();
      programmes.push({
        id: doc.id,
        title: programme.title || '',
        faculty: programme.faculty || '',
        duration: programme.duration || '',
        level: programme.level || '',
        description: programme.description || '',
        image: programme.image || ''
      });
    });

    res.json({
      success: true,
      data: programmes
    });
  } catch (error) {
    console.error('Error fetching programmes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch programmes',
      error: error.message
    });
  }
});

// Get courses for enrollment dropdown
router.get('/courses', async (req, res) => {
  try {
    // Get courses from mock database
    const coursesCollection = global.db.collection('courses');
    const coursesSnapshot = await coursesCollection.get();
    
    const courses = [];
    coursesSnapshot.forEach(doc => {
      const courseData = doc.data();
      if (courseData.status === 'active') {
        courses.push({
          id: doc.id,
          title: courseData.title,
          category: courseData.category,
          price: courseData.price
        });
      }
    });

    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message
    });
  }
});

module.exports = router;