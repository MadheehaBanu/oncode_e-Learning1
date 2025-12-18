# Faculty Section Migration - Hardcoded to Backend/Firestore

## Changes Made

### Backend
1. **Created API Route**: `backend/routes/faculties.js`
   - GET `/api/faculties` - Fetch all faculties
   - GET `/api/faculties/:slug` - Fetch faculty by slug
   - POST `/api/faculties` - Create faculty (admin only)
   - PUT `/api/faculties/:id` - Update faculty (admin only)
   - DELETE `/api/faculties/:id` - Delete faculty (admin only)

2. **Registered Route**: Updated `backend/index.js` to include faculties route

3. **Seed Script**: Created `backend/seedFaculties.js` to populate Firestore with faculty data

### Frontend
1. **Service Layer**: Created `frontend/src/services/facultyService.js` for API calls

2. **Updated Components**:
   - `frontend/src/pages/Faculties.js` - Now fetches from API with loading/error states
   - Created `frontend/src/pages/faculties/FacultyDetail.js` - Dynamic detail page

3. **Updated Routes**: Modified `frontend/src/App.js` to use dynamic routing

### Database
- **Collection**: `faculties` in Firestore
- **Fields**: slug, name, icon, description, programs, color, createdAt

## How to Use

### Seed the Database
```bash
cd backend
node seedFaculties.js
```

### Start the Application
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm start
```

## Old vs New

### Before (Hardcoded)
```javascript
const faculties = [
  { id: 1, name: 'School of Business', ... }
];
```

### After (Backend + Firestore)
```javascript
const [faculties, setFaculties] = useState([]);
useEffect(() => {
  facultyService.getAllFaculties().then(setFaculties);
}, []);
```

## Benefits
✅ Real-world production-ready architecture
✅ Data managed in Firestore database
✅ Admin can add/edit/delete faculties via API
✅ Scalable and maintainable
✅ Proper error handling and loading states
