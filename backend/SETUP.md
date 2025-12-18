# OnCode Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and update with your configuration:
```bash
cp .env.example .env
```

### 3. Firebase Setup (Optional)
- Create a Firebase project at https://console.firebase.google.com
- Enable Firestore Database
- Generate service account key
- Save as `serviceAccountKey.json` in backend directory
- **Note**: The system will work with mock data if Firebase is not configured

### 4. Initialize Database and Start Server
```bash
npm run setup
```

Or run individually:
```bash
# Initialize database with sample data
npm run init-db

# Start development server
npm run dev
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run init-db` - Initialize database with sample data
- `npm run seed` - Run legacy seed script
- `npm run setup` - Initialize database and start server

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/validate` - Validate session
- `POST /api/auth/refresh` - Refresh session

### Courses
- `GET /api/courses` - Get all courses (with filters)
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Admin/Instructor)
- `PUT /api/courses/:id` - Update course (Admin/Instructor)
- `DELETE /api/courses/:id` - Delete course (Admin)
- `GET /api/courses/categories/stats` - Get category statistics
- `POST /api/courses/:id/reviews` - Add course review

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password

### Enrollments
- `GET /api/enrollments` - Get all enrollments (Admin)
- `GET /api/enrollments/my` - Get user's enrollments
- `POST /api/enrollments` - Enroll in course
- `DELETE /api/enrollments/:id` - Unenroll from course
- `PUT /api/enrollments/:id/progress` - Update progress

### Certificates
- `GET /api/certificates/verify/:code` - Verify certificate
- `GET /api/certificates/my` - Get user's certificates
- `POST /api/certificates/generate` - Generate certificate

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (Admin)
- `PUT /api/contact/:id/status` - Update contact status
- `PUT /api/contact/:id/respond` - Respond to contact

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm-payment` - Confirm payment
- `GET /api/payments/history` - Get payment history

### Quizzes
- `GET /api/quizzes/course/:courseId` - Get course quizzes
- `GET /api/quizzes/:id` - Get quiz by ID
- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `POST /api/quizzes` - Create quiz (Instructor/Admin)

## Test Credentials

After running `npm run init-db`, you can use these test accounts:

- **Admin**: admin@oncode.com / admin123
- **Student**: student@oncode.com / student123  
- **Instructor**: instructor@oncode.com / instructor123

## Database Structure

### Collections
- `users` - User accounts and profiles
- `courses` - Course information and content
- `enrollments` - Student course enrollments
- `certificates` - Issued certificates
- `quizzes` - Course quizzes and assessments
- `contacts` - Contact form submissions
- `payments` - Payment transactions

### Security Features
- JWT authentication with HTTP-only cookies
- Session management
- Rate limiting on auth endpoints
- Input validation and sanitization
- CORS protection
- Security headers (Helmet.js)
- Password hashing with bcrypt

## Environment Variables

```env
PORT=5000
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRE=7d
SESSION_SECRET=your_secure_session_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Development Notes

- The system uses Firebase Firestore for production but falls back to an in-memory mock database for development
- All routes include proper error handling and validation
- Database helpers provide consistent CRUD operations
- Session-based authentication with JWT tokens
- Comprehensive logging for debugging

## Troubleshooting

### Firebase Connection Issues
If Firebase connection fails, the system automatically falls back to mock database mode. Check:
1. `serviceAccountKey.json` file exists and is valid
2. Firebase project is properly configured
3. Firestore is enabled in Firebase console

### Port Already in Use
If port 5000 is busy, change the PORT in `.env` file or kill the process:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Dependencies Issues
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```