# Hardcoded Data & Backend Integration Analysis

## 📋 Overview
This document identifies all hardcoded data in the frontend and specifies where backend/Firestore integration is needed.

---

## 🔴 CRITICAL: Pages with Hardcoded Data

### 1. **CourseDetail.js** (`frontend/src/pages/CourseDetail.js`)

#### Hardcoded Data:
```javascript
const sampleCourse = {
  id: '1',
  title: 'Complete Web Development Bootcamp 2024',
  description: 'Master web development with HTML, CSS, JavaScript...',
  instructor: 'Dr. Angela Yu',
  price: 84.99,
  level: 'beginner',
  category: 'Web Development',
  rating: 4.7,
  duration: '65 hours',
  students: '850,234',
  lessons: [...], // 8 hardcoded lessons
  requirements: [...], // 4 hardcoded requirements
  whatYouWillLearn: [...] // 6 hardcoded learning outcomes
}
```

#### Backend Integration Needed:
- ✅ **PARTIALLY INTEGRATED** - Fetches from Firestore via `coursesAPI.getCourse(id)`
- ❌ **FALLBACK TO HARDCODED** - Uses `sampleCourse` if API fails
- ✅ Uses localStorage for admin courses
- ✅ Enrollment check via localStorage
- ✅ Quiz loading via localStorage

#### Required Actions:
1. Remove `sampleCourse` fallback
2. Ensure all course data comes from Firestore `courses` collection
3. Move enrollment data to Firestore `enrollments` collection
4. Move quiz data to Firestore `quizzes` collection

---

### 2. **About.js** (`frontend/src/pages/About.js`)

#### Hardcoded Data:
```javascript
const [aboutData, setAboutData] = useState({
  mission: 'At OnCode, we believe that quality programming education...',
  studentsCount: '50K+',
  coursesCount: '500+',
  instructorsCount: '100+',
  successRate: '95%'
});
```

#### Backend Integration Needed:
- ✅ **PARTIALLY INTEGRATED** - Attempts to load from Firestore
- ❌ **FALLBACK TO HARDCODED** - Uses default values if Firestore fails

#### Firestore Collection:
```
settings/about
{
  mission: string,
  studentsCount: string,
  coursesCount: string,
  instructorsCount: string,
  successRate: string
}
```

#### Required Actions:
1. Ensure Firestore `settings/about` document exists
2. Admin panel to edit these statistics
3. Remove hardcoded fallback values

---

### 3. **Contact.js** (`frontend/src/pages/Contact.js`)

#### Hardcoded Data:
```javascript
const [contactInfo, setContactInfo] = useState({
  email: 'support@oncode.com',
  phone: '+1 (555) 123-4567',
  address: '123 Tech Street\nSan Francisco, CA 94105'
});
```

#### Backend Integration Needed:
- ✅ **PARTIALLY INTEGRATED** - Attempts to load from Firestore
- ❌ **FALLBACK TO HARDCODED** - Uses default values if Firestore fails
- ❌ **FORM SUBMISSION** - Only logs to console, doesn't save to backend

#### Firestore Collection:
```
settings/contact
{
  email: string,
  phone: string,
  address: string
}
```

#### Required Actions:
1. Ensure Firestore `settings/contact` document exists
2. Implement backend API to handle contact form submissions
3. Save submissions to Firestore `contact_messages` collection
4. Admin panel to view contact messages

---

### 4. **StatisticsSection.js** (`frontend/src/components/StatisticsSection.js`)

#### Hardcoded Data:
```javascript
const leftStats = [
  { icon: '🕒', title: '57 Years', description: 'Of excellence...' },
  { icon: '🤝', title: '100 Professional Partnerships', description: '...' },
  { icon: '🎓', title: '300 Qualified', description: 'Lecture Panel.' }
];

const rightStats = [
  { icon: '🌍', title: '5 Foreign Partnerships', description: '...' },
  { icon: '🏢', title: '8 Campuses', description: '...' },
  { icon: '👨🎓', title: '25,000 Student', description: 'Population.' }
];
```

#### Backend Integration Needed:
- ❌ **FULLY HARDCODED** - No backend integration

#### Firestore Collection Needed:
```
settings/statistics
{
  leftStats: [
    { icon: string, title: string, description: string }
  ],
  rightStats: [
    { icon: string, title: string, description: string }
  ]
}
```

#### Required Actions:
1. Create Firestore `settings/statistics` document
2. Load statistics from Firestore
3. Admin panel to edit statistics

---

### 5. **ProfessionalAffiliations.js** (`frontend/src/components/ProfessionalAffiliations.js`)

#### Hardcoded Data:
```javascript
const mockAffiliations = [
  { id: '1', title: 'ISO Certified', logo: '/prof/1.png' },
  { id: '2', title: 'Partner Org', logo: '/prof/2.png' },
  { id: '3', title: 'Accredited', logo: '/prof/3.png' }
];
```

#### Backend Integration Needed:
- ✅ **PARTIALLY INTEGRATED** - Uses `useProfessionalAffiliations()` hook
- ❌ **FALLBACK TO HARDCODED** - Uses mock data if Firestore is empty

#### Firestore Collection:
```
professionalAffiliations
{
  id: string,
  title: string,
  logo: string,
  order: number
}
```

#### Required Actions:
1. Seed Firestore with professional affiliations
2. Admin panel to manage affiliations
3. Remove mock fallback

---

### 6. **ForeignAffiliations.js** (`frontend/src/components/ForeignAffiliations.js`)

#### Hardcoded Data:
```javascript
const mockAffiliations = [
  { id: '1', name: 'Oxford University', country: 'UK', logo: '/images/2.jpeg' },
  { id: '2', name: 'Harvard University', country: 'USA', logo: '/images/12.png' },
  { id: '3', name: 'MIT', country: 'USA', logo: '/images/23.png' }
];
```

#### Backend Integration Needed:
- ✅ **PARTIALLY INTEGRATED** - Uses `useForeignAffiliations()` hook
- ❌ **FALLBACK TO HARDCODED** - Uses mock data if Firestore is empty

#### Firestore Collection:
```
foreignAffiliations
{
  id: string,
  name: string,
  country: string,
  logo: string,
  order: number
}
```

#### Required Actions:
1. Seed Firestore with foreign affiliations
2. Admin panel to manage affiliations
3. Remove mock fallback

---

### 7. **Newprogramme.js** (`frontend/src/pages/Newprogramme.js`)

#### Hardcoded Data:
```javascript
const mockProgrammes = [
  { id: '1', title: "Masters", category: "Masters", duration: "2 years" },
  { id: '2', title: "Degree", category: "Degree", duration: "4 years" },
  { id: '3', title: "HND", category: "HND", duration: "3 years" },
  { id: '4', title: "Diploma", category: "Diploma", duration: "2 years" },
  { id: '5', title: "Advanced Certificate", category: "Certificate", duration: "1 year" },
  { id: '6', title: "Certificate", category: "Certificate", duration: "6 months" },
  { id: '7', title: "Foundation", category: "Foundation", duration: "1 year" },
  { id: '8', title: "Workshops", category: "Workshop", duration: "Varies" }
];
```

#### Backend Integration Needed:
- ✅ **PARTIALLY INTEGRATED** - Uses `useProgrammes()` hook
- ❌ **FALLBACK TO HARDCODED** - Uses mock data if Firestore is empty

#### Firestore Collection:
```
programmes
{
  id: string,
  title: string,
  category: string,
  duration: string,
  order: number
}
```

#### Required Actions:
1. Seed Firestore with programmes
2. Admin panel to manage programmes
3. Remove mock fallback

---

### 8. **Home.js** (`frontend/src/pages/Home.js`)

#### Backend Integration:
- ✅ **FULLY INTEGRATED** - Uses `useContent()` hook
- ✅ Loads banners from Firestore `banners` collection
- ✅ Loads faculties from Firestore `faculties` collection
- ⚠️ **HARDCODED NAVIGATION** - Faculty "Learn More" button always navigates to `/faculties/SchoolOfBusiness`

#### Required Actions:
1. Fix hardcoded navigation to use dynamic faculty slug:
```javascript
// Current (WRONG):
onClick={() => navigate("/faculties/SchoolOfBusiness")}

// Should be:
onClick={() => navigate(`/faculties/${faculty.slug}`)}
```

---

### 9. **Courses.js** (`frontend/src/pages/Courses.js`)

#### Backend Integration:
- ✅ **FULLY INTEGRATED** - Uses `useData()` context
- ✅ Fetches courses from backend via `fetchCourses()`
- ✅ No hardcoded data

---

### 10. **Faculties.js** (`frontend/src/pages/Faculties.js`)

#### Backend Integration:
- ✅ **FULLY INTEGRATED** - Uses `facultyService.getAllFaculties()`
- ✅ Fetches from backend API
- ✅ No hardcoded data

---

### 11. **MyEnrollments.js** (`frontend/src/pages/MyEnrollments.js`)

#### Backend Integration:
- ✅ **FULLY INTEGRATED** - Uses `useData()` context
- ✅ Fetches enrollments via `fetchMyEnrollments()`
- ✅ Fetches courses via `fetchCourses()`
- ✅ No hardcoded data

---

### 12. **VerifyCertificate.js** (`frontend/src/pages/VerifyCertificate.js`)

#### Backend Integration:
- ✅ **FULLY INTEGRATED** - Calls backend API
- ✅ Uses `axios.post('${API_BASE_URL}/certificates/verify')`
- ✅ No hardcoded data

---

## 🔵 Authentication & User Management

### **AuthContext.js** (`frontend/src/context/AuthContext.js`)

#### Backend Integration:
- ✅ **FULLY INTEGRATED** with Firebase Authentication
- ✅ Fetches user profile from backend API
- ✅ Stores user data in Firestore `users` collection
- ✅ No hardcoded data

### **Login.js** & **Register.js**

#### Backend Integration:
- ✅ **FULLY INTEGRATED** with Firebase Auth
- ✅ Uses `login()` and `register()` from AuthContext
- ✅ No hardcoded data

---

## 📊 Summary Table

| Component | Status | Hardcoded Data | Backend Integration | Priority |
|-----------|--------|----------------|---------------------|----------|
| CourseDetail.js | ⚠️ Partial | Sample course fallback | Firestore + localStorage | HIGH |
| About.js | ⚠️ Partial | Statistics | Firestore settings/about | MEDIUM |
| Contact.js | ⚠️ Partial | Contact info + form | Firestore settings/contact | MEDIUM |
| StatisticsSection.js | ❌ None | All statistics | Need Firestore integration | HIGH |
| ProfessionalAffiliations.js | ⚠️ Partial | Mock affiliations | Firestore collection | LOW |
| ForeignAffiliations.js | ⚠️ Partial | Mock affiliations | Firestore collection | LOW |
| Newprogramme.js | ⚠️ Partial | Mock programmes | Firestore collection | MEDIUM |
| Home.js | ⚠️ Partial | Hardcoded navigation | Fix navigation logic | HIGH |
| Courses.js | ✅ Full | None | Backend API | - |
| Faculties.js | ✅ Full | None | Backend API | - |
| MyEnrollments.js | ✅ Full | None | Backend API | - |
| VerifyCertificate.js | ✅ Full | None | Backend API | - |
| AuthContext.js | ✅ Full | None | Firebase + Backend | - |

---

## 🎯 Action Plan

### Phase 1: Remove Critical Hardcoded Data (HIGH Priority)
1. **CourseDetail.js**
   - Remove `sampleCourse` fallback
   - Ensure proper error handling when course not found
   - Move enrollments from localStorage to Firestore

2. **StatisticsSection.js**
   - Create Firestore `settings/statistics` document
   - Implement loading from Firestore
   - Add admin panel to edit statistics

3. **Home.js**
   - Fix hardcoded faculty navigation URL

### Phase 2: Settings & Configuration (MEDIUM Priority)
4. **About.js**
   - Seed Firestore `settings/about` document
   - Remove hardcoded fallback values

5. **Contact.js**
   - Seed Firestore `settings/contact` document
   - Implement contact form submission API
   - Create `contact_messages` collection

6. **Newprogramme.js**
   - Seed Firestore `programmes` collection
   - Remove mock fallback

### Phase 3: Content Management (LOW Priority)
7. **ProfessionalAffiliations.js**
   - Seed Firestore `professionalAffiliations` collection
   - Remove mock fallback

8. **ForeignAffiliations.js**
   - Seed Firestore `foreignAffiliations` collection
   - Remove mock fallback

---

## 🔧 Required Firestore Collections

### Existing Collections (Already Implemented)
- ✅ `users` - User profiles
- ✅ `courses` - Course data
- ✅ `enrollments` - Student enrollments
- ✅ `certificates` - Course certificates
- ✅ `banners` - Homepage banners
- ✅ `faculties` - Faculty information
- ✅ `quizzes` - Course quizzes

### Missing Collections (Need Implementation)
- ❌ `settings/statistics` - Homepage statistics
- ❌ `settings/about` - About page data
- ❌ `settings/contact` - Contact page info
- ❌ `contact_messages` - Contact form submissions
- ❌ `programmes` - Programme types
- ❌ `professionalAffiliations` - Professional partnerships
- ❌ `foreignAffiliations` - Foreign university partnerships

---

## 📝 Backend API Endpoints Needed

### Existing Endpoints
- ✅ `/api/auth/*` - Authentication
- ✅ `/api/courses/*` - Course management
- ✅ `/api/enrollments/*` - Enrollment management
- ✅ `/api/certificates/*` - Certificate verification
- ✅ `/api/users/*` - User management
- ✅ `/api/faculties/*` - Faculty data

### Missing Endpoints
- ❌ `/api/settings/statistics` - GET/PUT statistics
- ❌ `/api/settings/about` - GET/PUT about page data
- ❌ `/api/settings/contact` - GET/PUT contact info
- ❌ `/api/contact/submit` - POST contact form
- ❌ `/api/programmes` - GET/POST/PUT/DELETE programmes
- ❌ `/api/affiliations/professional` - GET/POST/PUT/DELETE
- ❌ `/api/affiliations/foreign` - GET/POST/PUT/DELETE

---

## 🚀 Quick Wins

1. **Fix Home.js navigation** (5 minutes)
2. **Remove CourseDetail.js fallback** (10 minutes)
3. **Seed missing Firestore collections** (30 minutes)
4. **Create settings API endpoints** (1 hour)

---

## ⚠️ Important Notes

1. **localStorage Usage**: Several components use localStorage for temporary data storage. This should be migrated to Firestore for persistence.

2. **Mock Data Fallbacks**: Many components have mock data fallbacks. These should be removed once Firestore is properly seeded.

3. **Admin Panel**: An admin interface is needed to manage:
   - Statistics
   - About page content
   - Contact information
   - Programmes
   - Affiliations

4. **Error Handling**: Improve error handling when Firestore data is missing instead of falling back to hardcoded values.

---

## 📚 Related Files

- Backend: `backend/routes/*.js`
- Frontend Services: `frontend/src/services/api.js`
- Hooks: `frontend/src/hooks/*.js`
- Context: `frontend/src/context/*.js`
