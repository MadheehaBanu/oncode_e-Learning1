# OnCode E-Learning Platform - Complete Setup & Deployment Guide

## 🚀 Quick Start

### 1. Complete Project Setup
```bash
# Install all dependencies
npm run install:all

# Initialize database and start servers
npm run setup
npm start
```

### 2. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Test Credentials**:
  - Admin: admin@oncode.com / admin123
  - Student: student@oncode.com / student123
  - Instructor: instructor@oncode.com / instructor123

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start both frontend and backend servers |
| `npm run dev` | Same as start (development mode) |
| `npm run setup` | Install dependencies and initialize database |
| `npm run install:all` | Install all project dependencies |
| `npm run dev:backend` | Start only backend server |
| `npm run dev:frontend` | Start only frontend server |
| `npm run test:backend` | Test backend connectivity |

## 🔧 Manual Setup

### Backend Setup
```bash
cd backend
npm install
npm run init-db
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🔐 Security Features

- JWT authentication with HTTP-only cookies
- Session management
- Rate limiting on authentication endpoints
- Input validation and sanitization
- CORS protection
- Security headers (Helmet.js)
- Password hashing with bcrypt
- Role-based access control

## 📊 Database Collections

- **users** - User accounts and profiles
- **courses** - Course information and content
- **enrollments** - Student course enrollments
- **certificates** - Issued certificates
- **quizzes** - Course assessments
- **contacts** - Contact form submissions
- **payments** - Payment transactions

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/validate` - Validate session

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get specific course
- `POST /api/courses` - Create course (Admin/Instructor)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course (Admin)

### Users
- `GET /api/users` - Get all users (Admin)
- `POST /api/users` - Create user (Admin)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)

### Enrollments
- `GET /api/enrollments/my` - Get user enrollments
- `POST /api/enrollments` - Enroll in course
- `PUT /api/enrollments/:id/progress` - Update progress

## 🔥 Firebase Setup (Optional)

The system works with mock data by default. For production Firebase:

1. Create Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Generate service account key
4. Save as `serviceAccountKey.json` in backend directory
5. Update environment variables in `backend/.env`

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Clear Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database Issues
```bash
cd backend
npm run init-db
```

### Test Backend Connection
```bash
npm run test:backend
```

## 🚀 Production Deployment

1. Set up Firebase project for production
2. Update environment variables
3. Build frontend: `cd frontend && npm run build`
4. Deploy backend to your preferred hosting service
5. Update CORS settings for production domain

## 📝 Development Notes

- Backend runs on port 5000
- Frontend runs on port 3000
- Database automatically initializes with sample data
- System works offline with mock database
- All routes include proper error handling
- Comprehensive logging for debugging

## ✨ Features

- Complete user authentication system
- Role-based access control (Admin, Instructor, Student)
- Course management and enrollment
- Payment processing integration
- Certificate generation and verification
- Quiz and assessment system
- Admin dashboard with analytics
- Responsive design for all devices
- Real-time data with Firebase/Mock DB
- Session management and security
- Contact form and communication
- Search and filtering capabilities