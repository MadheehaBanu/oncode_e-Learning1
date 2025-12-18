const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { securityHeaders, generalLimiter, validateInput } = require('./middleware/security');
const { getDatabase } = require('./config/database');
require('dotenv').config();

// Initialize Database
const db = getDatabase();
global.db = db;

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(generalLimiter);
app.use(validateInput);

// Cookie and session middleware
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'oncode-session-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  'https://your-frontend-domain.vercel.app' // Update this after deploying frontend
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));



// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const contactRoutes = require('./routes/contact');
const paymentRoutes = require('./routes/payments');
const homeRoutes = require('./routes/home');
const programmesRoutes = require('./routes/programmes');
const enrollmentApplicationRoutes = require('./routes/enrollment');
const certificateRoutes = require('./routes/certificates');
const quizRoutes = require('./routes/quizzes');
const moduleRoutes = require('./routes/modules');
const notificationRoutes = require('./routes/notifications');
const fixAdminRoutes = require('./routes/fixAdmin');
const facultiesRoutes = require('./routes/faculties');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/programmes', programmesRoutes);
app.use('/api/enrollment', enrollmentApplicationRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/fix-admin', fixAdminRoutes);
app.use('/api/faculties', facultiesRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'OnCode E-Learning Backend API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 OnCode E-Learning Backend Server');
  console.log('='.repeat(50));
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Database: ${global.db ? 'Connected' : 'Mock Mode'}`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Using fallback'}`);
  console.log('\n📋 Available Endpoints:');
  console.log('  • GET  /                    - Health check');
  console.log('  • POST /api/auth/login      - User login');
  console.log('  • POST /api/auth/register   - User registration');
  console.log('  • GET  /api/courses         - Get courses');
  console.log('  • GET  /api/users           - Get users (Admin)');
  console.log('  • POST /api/contact         - Submit contact');
  console.log('\n🔐 Test Credentials:');
  console.log('  • Admin: madheehabanum67@gmail.com / madhee67');
  console.log('  • Student: student@oncode.com / student123');
  console.log('  • Instructor: instructor@oncode.com / instructor123');
  console.log('\n✅ Server ready for connections!');
  console.log('='.repeat(50) + '\n');
});