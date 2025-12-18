# Network Error Fix - Student Registration

## Problem
When trying to sign up, users see "Network error - please check your connection"

## Root Cause
The backend server is not running or not accessible at `http://localhost:5000`

## Solution

### Option 1: Start Backend Server (Recommended)
This will save student data to Firestore permanently.

```bash
cd backend
npm install
npm run dev
```

The backend should start on port 5000. You'll see:
```
🚀 OnCode E-Learning Backend Server
📡 Server running on port 5000
```

Then registration will work and save data to Firestore.

### Option 2: Use Fallback Mode (Temporary)
If backend is not available, registration now falls back to local storage automatically.

**How it works:**
- Student signs up → tries backend API
- Backend not available → saves to browser localStorage instead
- Student can login and use the app
- Data persists during the session
- **Note:** Data is lost if browser storage is cleared

**To use this:**
1. Just try to sign up normally
2. If backend is down, it will automatically use local storage
3. You can still login with the registered credentials

## Testing

### Test with Backend Running
1. Start backend: `npm run dev` (in backend folder)
2. Go to `/register`
3. Fill in details and submit
4. Check admin dashboard - student should appear
5. Data persists even after logout

### Test with Fallback Mode
1. Don't start backend
2. Go to `/register`
3. Fill in details and submit
4. Registration succeeds (using local storage)
5. Can login with registered credentials
6. Data is in browser storage only

## Troubleshooting

### Still getting network error?
1. Check if backend is running: `http://localhost:5000` in browser
2. Check backend console for errors
3. Ensure `.env` files are configured correctly
4. Check browser console (F12) for detailed error messages

### Backend won't start?
```bash
cd backend
npm install
npm run dev
```

### Port 5000 already in use?
Change PORT in `backend/.env` and update `frontend/.env` REACT_APP_API_URL

## Data Flow

**With Backend:**
```
Registration Form → Backend API → Firestore → Admin Dashboard
```

**Without Backend (Fallback):**
```
Registration Form → Local Storage → Browser Only
```

## Next Steps

1. **Start the backend** for production-ready setup
2. **Configure Firebase** credentials in `backend/serviceAccountKey.json`
3. **Test registration** and verify data appears in admin dashboard
4. **Deploy** with backend running

