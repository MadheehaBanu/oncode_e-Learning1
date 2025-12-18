const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const dbHelpers = require('../utils/dbHelpers');

const router = express.Router();

// Get category statistics
router.get('/categories/stats', async (req, res) => {
  try {
    const courses = await dbHelpers.findAll('courses', { status: 'active' });
    const categoryStats = {};

    courses.forEach(course => {
      const category = course.category;
      
      if (!categoryStats[category]) {
        categoryStats[category] = {
          count: 0,
          courses: []
        };
      }
      
      categoryStats[category].count++;
      categoryStats[category].courses.push({
        id: course.id,
        title: course.title,
        instructor: course.instructor,
        price: course.price
      });
    });

    res.json(categoryStats);
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({ error: 'Failed to fetch category statistics' });
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 10, page = 1 } = req.query;
    
    let courses;
    if (category && category !== 'all') {
      courses = await dbHelpers.findCoursesByCategory(category);
    } else {
      courses = await dbHelpers.findAll('courses', { status: 'active' });
    }

    // Client-side search filtering
    if (search) {
      const searchLower = search.toLowerCase();
      courses = courses.filter(course => 
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.instructor.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedCourses = courses.slice(startIndex, endIndex);

    res.json({
      courses: paginatedCourses,
      total: courses.length,
      page: parseInt(page),
      totalPages: Math.ceil(courses.length / limit)
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const course = await dbHelpers.findCourseById(id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Create course (Admin/Instructor only)
router.post('/', authenticateToken, requireRole(['admin', 'instructor']), [
  body('title').trim().isLength({ min: 3 }),
  body('description').trim().isLength({ min: 10 }),
  body('category').trim().isLength({ min: 2 }),
  body('price').isFloat({ min: 0 }),
  body('instructor').trim().isLength({ min: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, price, instructor, duration, level, requirements, whatYouLearn } = req.body;

    const courseData = {
      title,
      description,
      category,
      price: parseFloat(price),
      instructor,
      duration: duration || '',
      level: level || 'Beginner',
      requirements: requirements || [],
      whatYouLearn: whatYouLearn || [],
      enrollments: 0,
      rating: 0,
      reviews: [],
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: req.user.id
    };

    const newCourse = await dbHelpers.createCourse(courseData);

    res.status(201).json({
      message: 'Course created successfully',
      course: newCourse
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update course (Admin/Instructor only)
router.put('/:id', authenticateToken, requireRole(['admin', 'instructor']), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, price, instructor, duration, level, requirements, whatYouLearn, status } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (instructor) updateData.instructor = instructor;
    if (duration) updateData.duration = duration;
    if (level) updateData.level = level;
    if (requirements) updateData.requirements = requirements;
    if (whatYouLearn) updateData.whatYouLearn = whatYouLearn;
    if (status) updateData.status = status;
    
    updateData.updatedAt = new Date().toISOString();

    await db.collection('courses').doc(id).update(updateData);

    res.json({ message: 'Course updated successfully' });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete course (Admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Also delete related enrollments
    const enrollmentsSnapshot = await db.collection('enrollments').where('courseId', '==', id).get();
    const batch = db.batch();
    
    enrollmentsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    batch.delete(db.collection('courses').doc(id));
    await batch.commit();

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Add course review
router.post('/:id/reviews', authenticateToken, [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').trim().isLength({ min: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { rating, comment } = req.body;

    const courseDoc = await db.collection('courses').doc(id).get();
    if (!courseDoc.exists) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const courseData = courseDoc.data();
    const reviews = courseData.reviews || [];

    // Check if user already reviewed
    const existingReview = reviews.find(review => review.userId === req.user.id);
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this course' });
    }

    const newReview = {
      userId: req.user.id,
      userName: req.user.name,
      rating: parseInt(rating),
      comment,
      createdAt: new Date().toISOString()
    };

    reviews.push(newReview);

    // Calculate new average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await db.collection('courses').doc(id).update({
      reviews,
      rating: Math.round(averageRating * 10) / 10 // Round to 1 decimal place
    });

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

module.exports = router;