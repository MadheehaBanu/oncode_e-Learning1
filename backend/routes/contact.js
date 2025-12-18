const express = require('express');
const router = express.Router();
const { db } = require('../config/database');

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contactMessage = {
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      status: 'unread'
    };

    const docRef = await db.collection('contact_messages').add(contactMessage);

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      id: docRef.id
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form'
    });
  }
});

module.exports = router;
