# User Collection Schema

## Firebase Firestore Collection: `users`

### Complete User Document Structure

```javascript
{
  // Basic Information
  id: "auto-generated-firebase-id",
  email: "user@example.com",           // Unique email address
  password: "hashed-password",         // bcrypt hashed password
  name: "Full Name",                   // User's full name
  role: "student|instructor|admin",    // User role
  status: "active|inactive|suspended", // Account status
  
  // Profile Information
  profileImage: "url-to-image",        // Profile picture URL
  phone: "+1-555-0123",               // Phone number
  address: "123 Main Street",         // Street address
  city: "New York",                   // City
  country: "USA",                     // Country
  dateOfBirth: "1990-01-15",          // Date of birth (YYYY-MM-DD)
  gender: "male|female|other",        // Gender
  bio: "User biography text",         // Personal bio/description
  
  // Student Specific Fields
  age: 25,                            // Age (for students)
  education: {
    degree: "Bachelor of Science",
    institution: "University Name",
    graduationYear: 2020
  },
  experience: "Beginner|Intermediate|Advanced|Expert",
  interests: ["Web Development", "Data Science"],
  learningGoals: ["Goal 1", "Goal 2"],
  skillLevel: "Beginner|Intermediate|Advanced",
  
  // Instructor Specific Fields
  specializations: ["JavaScript", "React", "Node.js"],
  teachingExperience: "5 years",
  coursesCreated: 10,
  totalStudents: 5000,
  rating: 4.8,
  bankDetails: {
    accountHolder: "Instructor Name",
    accountNumber: "****1234",
    routingNumber: "****5678",
    paypalEmail: "instructor@paypal.com"
  },
  
  // Social Links
  socialLinks: {
    linkedin: "https://linkedin.com/in/username",
    twitter: "https://twitter.com/username",
    github: "https://github.com/username",
    website: "https://personal-website.com",
    youtube: "https://youtube.com/channel"
  },
  
  // User Preferences
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    language: "en|es|fr|de",
    timezone: "America/New_York"
  },
  
  // Verification Status
  isEmailVerified: true,
  isPhoneVerified: false,
  
  // Timestamps
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-03-15T14:20:00.000Z",
  lastActive: "2024-03-15T14:20:00.000Z"
}
```

## User Roles and Permissions

### 1. **Student Role**
- Can browse and enroll in courses
- Can track learning progress
- Can submit reviews and ratings
- Can update own profile
- Can view certificates

### 2. **Instructor Role**
- All student permissions
- Can create and manage courses
- Can view student enrollments
- Can respond to course reviews
- Can access instructor analytics

### 3. **Admin Role**
- Full system access
- Can manage all users
- Can manage all courses
- Can view system analytics
- Can handle contact inquiries
- Can manage platform settings

## Required Fields by Role

### All Users (Required)
- email
- password
- name
- role
- status
- createdAt

### Students (Additional)
- age (optional)
- education (optional)
- interests (optional)
- learningGoals (optional)

### Instructors (Additional)
- specializations
- teachingExperience
- bio (recommended)

### Admins (Additional)
- No additional required fields

## Validation Rules

### Email
- Must be valid email format
- Must be unique across all users
- Required for all roles

### Password
- Minimum 6 characters
- Must be hashed with bcrypt
- Required for all roles

### Phone
- Optional for students
- Recommended for instructors
- Format: +1-555-0123

### Role
- Must be one of: student, instructor, admin
- Cannot be changed by user (admin only)

### Status
- Must be one of: active, inactive, suspended
- Default: active
- Can be changed by admin only

## Indexes Required

```javascript
// Single field indexes (auto-created)
- email (for login)
- role (for role-based queries)
- status (for active user queries)

// Composite indexes (create manually)
- role + status (for active users by role)
- createdAt (for user registration analytics)
```

## Security Rules

```javascript
// Users can read/write their own data
// Admins can read/write all user data
// Public fields can be read by authenticated users
```