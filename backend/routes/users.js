const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs'); // Added bcrypt import
const { authenticateToken, requireRole } = require('../middleware/auth');
const db = global.db;

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = [];

    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      delete userData.password; // Don't send password
      users.push({
        id: doc.id,
        ...userData
      });
    });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    delete userData.password;

    res.json({
      id: userDoc.id,
      ...userData
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('age').optional().isInt({ min: 1, max: 120 }),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('city').optional().trim(),
  body('country').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, age, phone, address, city, country } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (age) updateData.age = age;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (city) updateData.city = city;
    if (country) updateData.country = country;

    updateData.updatedAt = new Date().toISOString();

    await db.collection('users').doc(req.user.id).update(updateData);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Create user (Admin only)
router.post('/', authenticateToken, requireRole(['admin']), [
  body('email').isEmail().normalizeEmail(),
  body('name').trim().isLength({ min: 2 }),
  body('role').isIn(['student', 'instructor', 'admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, role, password, age, phone, address, city, country } = req.body;

    // Check if user exists
    const existingUser = await db.collection('users').where('email', '==', email).get();
    if (!existingUser.empty) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const plainPassword = password || 'defaultPassword123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const userData = {
      email,
      name,
      role,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      password: hashedPassword,
      // Add profile fields if present
      age: age || '',
      phone: phone || '',
      address: address || '',
      city: city || '',
      country: country || ''
    };

    const userRef = await db.collection('users').add(userData);

    delete userData.password;
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: userRef.id,
        ...userData
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user (Admin only)
router.put('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    updateData.updatedAt = new Date().toISOString();

    await db.collection('users').doc(id).update(updateData);

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (Admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('users').doc(id).delete();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;