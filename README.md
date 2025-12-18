# OnCode - E-Learning Platform 🎓

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MadheehaBanu/e-Learning)

A modern full-stack e-learning platform built with React.js frontend and Node.js backend with Firebase.

## 🌐 Live Demo
- **Frontend**: [Coming Soon]
- **Backend API**: [Coming Soon]

## 📸 Screenshots
[Add screenshots of your application here]

## Features

- User Authentication (Students, Instructors & Admins)
- Course Browsing and Enrollment
- Certificate Verification
- Admin Dashboard
- Responsive Design
- Real-time Data with Firebase
- JWT Authentication
- Role-based Access Control

## Tech Stack

- **Frontend**: React.js, JavaScript, CSS
- **Backend**: Node.js, Express.js
- **Database**: Firebase Firestore
- **Authentication**: JWT with bcrypt
- **Validation**: express-validator

## Getting Started

### Quick Start (Recommended)

1. **Install all dependencies:**
```bash
npm run install:all
```

2. **Setup and start the entire project:**
```bash
npm run setup
npm start
```

This will:
- Install all dependencies for frontend and backend
- Initialize the database with sample data
- Start both backend (port 5000) and frontend (port 3000) servers

### Manual Setup

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Initialize database with sample data:
```bash
npm run init-db
```

4. Start backend server:
```bash
npm run dev
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

### Firebase Setup (Optional)

The system works with mock data by default. For production Firebase:

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Generate service account key
4. Save as `serviceAccountKey.json` in backend directory
5. Update environment variables in `backend/.env`

### Environment Configuration

Backend environment variables (`backend/.env`):
```env
PORT=5000
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRE=7d
SESSION_SECRET=your_secure_session_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Test Credentials

After running the setup, use these test accounts:
- **Admin**: admin@oncode.com / admin123
- **Student**: student@oncode.com / student123
- **Instructor**: instructor@oncode.com / instructor123

**Note**: Change these credentials in production environments.

## Project Structure

```
├── backend/           # Node.js API server
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication middleware
│   ├── utils/           # Utility functions
│   ├── index.js         # Main server file
│   ├── seedData.js      # Database seeding script
│   └── serviceAccountKey.json  # Firebase credentials
├── frontend/          # React.js application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── services/      # API service layer
│   │   ├── styles/        # CSS files
│   │   └── App.js         # Main app component
└── README.md
```

## Features Available

- ✅ Home page with course categories
- ✅ Course browsing and filtering
- ✅ User authentication with JWT
- ✅ Admin dashboard
- ✅ Course management
- ✅ User management
- ✅ Certificate verification
- ✅ About & Contact pages
- ✅ Student enrollment system
- ✅ Instructor dashboard
- ✅ Quiz and assessment system
- ✅ Payment integration (Stripe ready)
- ✅ Responsive design
- ✅ Role-based access control

## 🚀 Deployment

### Quick Deploy to Vercel
Follow the step-by-step guide in `DEPLOY_NOW.md` for a 5-minute deployment.

### Detailed Deployment
See `DEPLOYMENT_CHECKLIST.md` for comprehensive deployment instructions.

### Before Pushing to GitHub
Run the pre-deployment test:
```bash
npm run test:deploy
```

Then follow `PRE_PUSH_CHECKLIST.md` to ensure no sensitive data is committed.

## 🛠️ Available Scripts

```bash
npm start              # Start both frontend and backend
npm run install:all    # Install all dependencies
npm run setup          # Full setup with database initialization
npm run build          # Build frontend for production
npm run test:deploy    # Test if project is ready for deployment
npm run clean          # Remove all node_modules
```