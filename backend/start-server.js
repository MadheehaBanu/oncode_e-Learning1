const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Firebase setup
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

global.db = admin.firestore();

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ OnCode Backend API is running!',
    firebase: '✅ Connected',
    project: serviceAccount.project_id,
    timestamp: new Date().toISOString()
  });
});

// Import and use routes
try {
  const authRoutes = require('./routes/auth');
  const userRoutes = require('./routes/users');
  const courseRoutes = require('./routes/courses');
  const enrollmentRoutes = require('./routes/enrollments');
  const contactRoutes = require('./routes/contact');

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/enrollments', enrollmentRoutes);
  app.use('/api/contact', contactRoutes);
  
  console.log('✅ All routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
}

// Error handling
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Firebase project: ${serviceAccount.project_id}`);
  console.log(`🔗 API endpoints available at: http://localhost:${PORT}/api`);
  console.log(`✅ CORS enabled for frontend`);
});