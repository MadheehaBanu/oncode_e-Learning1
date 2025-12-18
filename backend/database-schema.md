# OnCode E-Learning Database Schema

## Database Details That Appear on Pages

### 1. **Users Collection**
```json
{
  "id": "string",
  "name": "string",
  "email": "string", 
  "role": "student|instructor|admin",
  "status": "active|suspended|pending",
  "studentId": "string",
  "age": "number",
  "phone": "string",
  "address": "string",
  "city": "string",
  "country": "string",
  "programme": "string",
  "faculty": "string",
  "batch": "string",
  "enrollmentDate": "date",
  "currentYear": "string",
  "guardianName": "string",
  "guardianContact": "string",
  "scholarshipStatus": "string",
  "certificateNumber": "string",
  "notes": "string",
  "loginStatus": "active|disabled",
  "createdBy": "string",
  "createdAt": "date",
  "lastUpdated": "date"
}
```

**Appears on:**
- Admin Dashboard (user management)
- Student profiles
- Instructor profiles
- Login/Registration pages

### 2. **Courses Collection**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "instructor": "string",
  "price": "number",
  "category": "string",
  "level": "beginner|intermediate|advanced",
  "duration": "string",
  "enrollments": "number",
  "rating": "number",
  "status": "active|inactive",
  "courseContent": ["array of lessons"],
  "thumbnail": "string",
  "createdAt": "date"
}
```

**Appears on:**
- Course listing pages
- Course detail pages
- Student dashboard
- Instructor dashboard
- Admin course management

### 3. **Modules Collection** (New - Instructor Only)
```json
{
  "id": "string",
  "courseId": "string",
  "title": "string",
  "description": "string",
  "content": "string",
  "videoUrl": "string",
  "duration": "string",
  "order": "number",
  "instructorId": "string",
  "createdAt": "date"
}
```

**Appears on:**
- Course detail pages
- Student learning interface
- Instructor module management

### 4. **Enrollments Collection**
```json
{
  "id": "string",
  "userId": "string",
  "courseId": "string",
  "status": "active|completed|suspended",
  "progress": "number",
  "enrolledAt": "date",
  "completedAt": "date",
  "certificateId": "string",
  "paymentAmount": "number",
  "paymentMethod": "string"
}
```

**Appears on:**
- Student dashboard
- My Enrollments page
- Admin enrollment tracking
- Instructor student lists

### 5. **Quizzes Collection**
```json
{
  "id": "string",
  "courseId": "string",
  "title": "string",
  "description": "string",
  "timeLimit": "number",
  "questions": [
    {
      "question": "string",
      "options": ["array"],
      "correctAnswer": "number",
      "type": "mcq|true_false|fill_blank"
    }
  ],
  "createdAt": "date"
}
```

**Appears on:**
- Course detail pages
- Quiz taking interface
- Instructor quiz management
- Student results page

### 6. **Quiz Results Collection**
```json
{
  "id": "string",
  "userId": "string",
  "courseId": "string",
  "quizId": "string",
  "score": "number",
  "totalQuestions": "number",
  "correctAnswers": "number",
  "timeSpent": "number",
  "completedAt": "date"
}
```

**Appears on:**
- Student results page
- Student dashboard
- Instructor analytics
- Admin reporting

### 7. **Certificates Collection**
```json
{
  "id": "string",
  "studentId": "string",
  "courseId": "string",
  "studentName": "string",
  "courseName": "string",
  "instructor": "string",
  "certificateId": "string",
  "issuedAt": "date",
  "verificationUrl": "string"
}
```

**Appears on:**
- Student certificates page
- Certificate verification page
- Admin certificate management
- Student dashboard

### 8. **News Collection**
```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "category": "academic|partnership|achievement",
  "date": "date",
  "image": "string",
  "author": "string",
  "status": "published|draft"
}
```

**Appears on:**
- News & Events page
- Home page news section
- Admin news management

### 9. **Events Collection**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "date": "date",
  "time": "string",
  "location": "string",
  "type": "career|workshop|networking",
  "status": "upcoming|ongoing|completed",
  "registrationLimit": "number",
  "registeredCount": "number"
}
```

**Appears on:**
- News & Events page
- Home page events section
- Admin event management
- Student event registration

### 10. **Assignments Collection**
```json
{
  "id": "string",
  "courseId": "string",
  "title": "string",
  "description": "string",
  "dueDate": "date",
  "maxScore": "number",
  "instructorId": "string",
  "createdAt": "date"
}
```

**Appears on:**
- Course detail pages
- Student assignment submission
- Instructor assignment management

### 11. **Assignment Submissions Collection**
```json
{
  "id": "string",
  "assignmentId": "string",
  "studentId": "string",
  "studentName": "string",
  "content": "string",
  "fileUrl": "string",
  "submittedAt": "date",
  "grade": "number",
  "feedback": "string",
  "graded": "boolean"
}
```

**Appears on:**
- Instructor assignment review
- Student submission tracking
- Grade reports

## API Endpoints

### Modules (Instructor Only)
- `GET /api/modules/course/:courseId` - Get course modules
- `POST /api/modules` - Add new module (instructor only)
- `PUT /api/modules/:id` - Update module
- `DELETE /api/modules/:id` - Delete module

### Other Endpoints
- `GET /api/courses` - Get all courses
- `GET /api/users` - Get all users (admin)
- `POST /api/auth/login` - User login
- `POST /api/certificates/generate` - Auto-generate certificate
- `GET /api/quizzes/course/:courseId` - Get course quizzes
- `POST /api/quizzes/submit` - Submit quiz results