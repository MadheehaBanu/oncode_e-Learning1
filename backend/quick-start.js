const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key_here';

const app = express();
app.use(cors());
app.use(express.json());

// Firebase setup
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Test route
app.get('/', (req, res) => {
  res.json({ message: '✅ Backend running!', time: new Date().toISOString() });
});

// Register route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role, age, phone, address, city, country } = req.body;
    console.log('Registration attempt:', email, { name, role });

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user exists
    const existingUser = await db.collection('users').where('email', '==', email).get();
    if (!existingUser.empty) {
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

    // Add student fields if provided
    if (age) userData.age = parseInt(age);
    if (phone) userData.phone = phone;
    if (address) userData.address = address;
    if (city) userData.city = city;
    if (country) userData.country = country;

    console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });
    const userRef = await db.collection('users').add(userData);
    console.log('User created with ID:', userRef.id);

    // Generate JWT
    const token = jwt.sign(
      { userId: userRef.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userRef.id,
        email,
        name,
        role: userData.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);

    // Find user
    const userQuery = await db.collection('users').where('email', '==', email).get();
    if (userQuery.empty) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // Check password
    const isValidPassword = await bcrypt.compare(password, userData.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: userDoc.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update last active
    await db.collection('users').doc(userDoc.id).update({
      lastActive: new Date().toISOString()
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: userDoc.id,
        email: userData.email,
        name: userData.name,
        role: userData.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log('📧 Test accounts:');
  console.log('   student@oncode.com / student123');
  console.log('   admin@oncode.com / admin123');
});

// Auth middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userDoc = await db.collection('users').doc(decoded.userId).get();
    
    if (!userDoc.exists) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = { id: decoded.userId, ...userDoc.data() };
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Add course route
app.post('/api/courses', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, price, instructor } = req.body;
    
    const courseData = {
      title,
      description,
      category,
      price: parseFloat(price),
      instructor,
      level: 'Beginner',
      duration: '10 hours',
      enrollments: 0,
      rating: 0,
      students: '0',
      thumbnail: '📚',
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: req.user.id
    };

    const courseRef = await db.collection('courses').add(courseData);
    console.log('Course created:', courseRef.id);

    res.status(201).json({
      message: 'Course created successfully',
      course: {
        id: courseRef.id,
        ...courseData
      }
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Get courses route
app.get('/api/courses', async (req, res) => {
  try {
    const snapshot = await db.collection('courses').get();
    const courses = [];
    
    snapshot.forEach(doc => {
      courses.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({ courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get users route (Admin only)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const snapshot = await db.collection('users').get();
    const users = [];
    
    snapshot.forEach(doc => {
      const userData = doc.data();
      delete userData.password;
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

// Add user route (Admin only)
app.post('/api/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { email, name, role } = req.body;
    
    // Check if user exists
    const existingUser = await db.collection('users').where('email', '==', email).get();
    if (!existingUser.empty) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const userData = {
      email,
      name,
      role,
      status: 'active',
      password: await bcrypt.hash('defaultPassword123', 12),
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
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