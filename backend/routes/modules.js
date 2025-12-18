const express = require('express');
const router = express.Router();

// Mock modules database
let modules = [
  {
    id: 'mod-1',
    courseId: '1',
    title: 'Introduction to HTML',
    description: 'Learn the basics of HTML markup language',
    content: 'HTML (HyperText Markup Language) is the standard markup language...',
    videoUrl: 'https://example.com/video1.mp4',
    duration: '45 minutes',
    order: 1,
    instructorId: 'instructor-1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mod-2',
    courseId: '1',
    title: 'CSS Fundamentals',
    description: 'Styling web pages with CSS',
    content: 'CSS (Cascading Style Sheets) is used to style HTML elements...',
    videoUrl: 'https://example.com/video2.mp4',
    duration: '60 minutes',
    order: 2,
    instructorId: 'instructor-1',
    createdAt: new Date().toISOString()
  }
];

// Get modules for a course
router.get('/course/:courseId', (req, res) => {
  const { courseId } = req.params;
  const courseModules = modules.filter(mod => mod.courseId === courseId);
  res.json({ success: true, data: courseModules });
});

// Add new module (instructor only)
router.post('/', (req, res) => {
  const { courseId, title, description, content, videoUrl, duration, order } = req.body;
  
  const newModule = {
    id: `mod-${Date.now()}`,
    courseId,
    title,
    description,
    content,
    videoUrl,
    duration,
    order: order || modules.filter(m => m.courseId === courseId).length + 1,
    instructorId: req.user?.id || 'instructor-1',
    createdAt: new Date().toISOString()
  };
  
  modules.push(newModule);
  
  res.json({
    success: true,
    message: 'Module added successfully',
    data: newModule
  });
});

// Get all modules (admin)
router.get('/', (req, res) => {
  res.json({ success: true, data: modules });
});

// Update module
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const moduleIndex = modules.findIndex(m => m.id === id);
  
  if (moduleIndex === -1) {
    return res.status(404).json({ success: false, message: 'Module not found' });
  }
  
  modules[moduleIndex] = { ...modules[moduleIndex], ...req.body };
  
  res.json({
    success: true,
    message: 'Module updated successfully',
    data: modules[moduleIndex]
  });
});

// Delete module
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  modules = modules.filter(m => m.id !== id);
  
  res.json({
    success: true,
    message: 'Module deleted successfully'
  });
});

module.exports = router;