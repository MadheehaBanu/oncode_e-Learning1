const express = require('express');
const router = express.Router();
const db = global.db; // Access global Firestore instance

// Helper to fetch collection data
const fetchCollection = async (collectionName) => {
  try {
    const snapshot = await db.collection(collectionName).orderBy('order', 'asc').get();
    if (snapshot.empty) return [];
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    // If order field doesn't exist, try valid fetch without sort or just catch
    // For collections like 'news' where we might want date sort
    try {
      const snapshot = await db.collection(collectionName).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error(`Error fetching ${collectionName}:`, e);
      return [];
    }
  }
};

// Get banner slides
router.get('/banner', async (req, res) => {
  try {
    const banners = await fetchCollection('banners');
    res.json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch banners', error: error.message });
  }
});

// Get faculties
router.get('/faculties', async (req, res) => {
  try {
    const faculties = await fetchCollection('faculties');
    res.json({ success: true, data: faculties });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch faculties', error: error.message });
  }
});

// Get foreign affiliations
router.get('/affiliations', async (req, res) => {
  try {
    const affiliations = await fetchCollection('foreign_affiliations');
    res.json({ success: true, data: affiliations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch affiliations', error: error.message });
  }
});

// Get professional affiliations (NEW)
router.get('/professional-affiliations', async (req, res) => {
  try {
    const affiliations = await fetchCollection('professional_affiliations');
    res.json({ success: true, data: affiliations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch professional affiliations', error: error.message });
  }
});

// Get News (NEW)
router.get('/news', async (req, res) => {
  try {
    const news = await fetchCollection('news');
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch news', error: error.message });
  }
});

// Get Events (NEW)
router.get('/events', async (req, res) => {
  try {
    const events = await fetchCollection('events');
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch events', error: error.message });
  }
});

// Get Content (About/Contact) (NEW)
router.get('/content/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const doc = await db.collection('content').doc(type).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }
    res.json({ success: true, data: doc.data() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch content', error: error.message });
  }
});

module.exports = router;