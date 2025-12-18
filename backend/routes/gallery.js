const express = require('express');
const router = express.Router();

// Firestore collection for gallery images
const galleryCollection = global.db.collection('gallery');

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const snapshot = await galleryCollection.get();
    const galleryImages = [];
    snapshot.forEach(doc => {
      galleryImages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    res.json({
      success: true,
      data: galleryImages
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images',
      error: error.message
    });
  }
});

// Add new gallery image
router.post('/', async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    const docRef = await galleryCollection.add({
      imageUrl,
      caption: caption || ''
    });

    res.json({
      success: true,
      message: 'Gallery image added',
      id: docRef.id
    });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add gallery image',
      error: error.message
    });
  }
});

// Delete gallery image by ID
router.delete('/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    await galleryCollection.doc(docId).delete();

    res.json({
      success: true,
      message: 'Gallery image deleted'
    });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery image',
      error: error.message
    });
  }
});

module.exports = router;
