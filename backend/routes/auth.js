const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { authLimiter } = require('../middleware/security');
const { validateSession } = require('../middleware/auth');
const dbHelpers = require('../utils/dbHelpers');

const router = express.Router();

// Apply rate limiting to auth routes
router.use(authLimiter);

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 }),
  body('role').isIn(['student', 'instructor'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, role, age, phone, address, city, country } = req.body;

    // Check if user exists
    const existingUser = await dbHelpers.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userData = {
      email,
      password: hashedPassword,
      name,
      role: role || 'student',
      status: 'active',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    // Add additional fields for students
    if (role === 'student') {
      userData.age = age;
      userData.phone = phone;
      userData.address = address;
      userData.city = city;
      userData.country = country;
    }

    const newUser = await dbHelpers.createUser(userData);
    const userId = newUser.id;
    
    // Ensure user is stored in Firestore with proper ID
    if (userId) {
      await global.db.collection('users').doc(userId).set({
        ...userData,
        id: userId
      }, { merge: true });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    const user = {
      id: userId,
      email,
      name,
      role: userData.role,
      status: 'active'
    };

    // Store in session
    req.session.user = user;
    req.session.isAuthenticated = true;

    // Set HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict'
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user from Firestore
    const userData = await dbHelpers.findUserByEmail(email);
    if (!userData) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, userData.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last active in Firestore
    const userId = userData.id;
    await global.db.collection('users').doc(userId).update({
      lastActive: new Date().toISOString()
    }).catch(() => {
      return global.db.collection('users').doc(userId).set(userData, { merge: true });
    });

    // Generate JWT
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    const user = {
      id: userId,
      email: userData.email,
      name: userData.name,
      role: userData.role
    };

    // Store in session
    if (req.session) {
      req.session.user = user;
      req.session.isAuthenticated = true;
    }

    // Set HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict'
    });

    res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  try {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
        }
      });
    }
    
    // Clear cookie
    res.clearCookie('authToken');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Validate session
router.get('/validate', async (req, res) => {
  try {
    if (req.session && req.session.isAuthenticated && req.session.user) {
      return res.json({
        isValid: true,
        user: req.session.user
      });
    }
    
    // Check JWT token if no session
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      const user = await dbHelpers.findUserById(decoded.userId);
      if (user) {
        return res.json({
          isValid: true,
          user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
      }
    }
    
    res.status(401).json({
      isValid: false,
      message: 'No valid session'
    });
  } catch (error) {
    res.status(401).json({
      isValid: false,
      message: 'Invalid token'
    });
  }
});

// Refresh session
router.post('/refresh', validateSession, (req, res) => {
  if (req.session && req.session.user) {
    // Extend session
    req.session.touch();
    
    res.json({
      message: 'Session refreshed',
      user: req.session.user
    });
  } else {
    res.status(401).json({ error: 'No valid session to refresh' });
  }
});

module.exports = router;
