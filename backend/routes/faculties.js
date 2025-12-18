const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');

// Get all faculties
router.get('/', async (req, res) => {
  try {
    const snapshot = await global.db.collection('faculties').get();
    const faculties = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(faculties);
  } catch (error) {
    console.error('Error fetching faculties:', error);
    res.status(500).json({ error: 'Failed to fetch faculties' });
  }
});

// Get faculty by slug
router.get('/:slug', async (req, res) => {
  try {
    const snapshot = await global.db.collection('faculties')
      .where('slug', '==', req.params.slug)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    
    const faculty = {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    };
    
    res.json(faculty);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ error: 'Failed to fetch faculty' });
  }
});

// Create faculty (admin only)
router.post('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const facultyData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await global.db.collection('faculties').add(facultyData);
    res.status(201).json({ id: docRef.id, ...facultyData });
  } catch (error) {
    console.error('Error creating faculty:', error);
    res.status(500).json({ error: 'Failed to create faculty' });
  }
});

// Update faculty (admin only)
router.put('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    await global.db.collection('faculties').doc(req.params.id).update({
      ...req.body,
      updatedAt: new Date().toISOString()
    });
    res.json({ message: 'Faculty updated successfully' });
  } catch (error) {
    console.error('Error updating faculty:', error);
    res.status(500).json({ error: 'Failed to update faculty' });
  }
});

// Delete faculty (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    await global.db.collection('faculties').doc(req.params.id).delete();
    res.json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    res.status(500).json({ error: 'Failed to delete faculty' });
  }
});

module.exports = router;
