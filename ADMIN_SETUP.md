# Admin Settings Module - Setup Guide

## Overview
The Admin Settings Module allows administrators to manage all dynamic content displayed on the frontend. All data is stored in Firebase Firestore and images in Firebase Storage.

## Features

### 1. Banner Management
- Upload/change banner images
- Edit banner titles, subtitles, and CTA button text
- Manage up to 2 banners for home page
- Images stored in Firebase Storage
- Text data stored in Firestore

**Firestore Collection:** `siteContent/banners`

### 2. Faculty Management
- Add new faculties with name, description, icon, and image
- Edit existing faculty details
- Delete faculties
- Automatic image cleanup on deletion
- Order management for display sequence

**Firestore Collection:** `faculties`

### 3. Professional Affiliations
- Upload logos/images
- Add title and description
- CRUD operations
- Display in "Professional Affiliations" section

**Firestore Collection:** `professionalAffiliations`

### 4. Foreign Affiliations
- Upload logos/images
- Add name, country, and description
- CRUD operations
- Display in "Foreign Affiliations" section

**Firestore Collection:** `foreignAffiliations`

### 5. Programmes Management
- Add programme title, description, category, and duration
- Upload programme images
- CRUD operations
- Display on Programmes UI

**Firestore Collection:** `programmes`

## Firebase Setup

### 1. Enable Firestore Database
1. Go to Firebase Console
2. Select your project
3. Navigate to Firestore Database
4. Create database in production mode
5. Set security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read for all
    match /{document=**} {
      allow read;
    }
    
    // Allow write only for authenticated admins
    match /{document=**} {
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### 2. Enable Firebase Storage
1. Go to Firebase Console
2. Navigate to Storage
3. Create storage bucket
4. Set security rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read for all
    match /{allPaths=**} {
      allow read;
    }
    
    // Allow write only for authenticated admins
    match /{allPaths=**} {
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### 3. Update Firebase Config
Update `frontend/src/firebase.js` with your Firebase credentials:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## Accessing Admin Settings

1. Login as admin user
2. Navigate to `/admin/settings`
3. Use tabs to switch between different content management sections

## Firestore Collections Structure

### siteContent/banners
```json
{
  "banners": [
    {
      "id": 1,
      "title": "Banner Title",
      "subtitle": "Banner Subtitle",
      "buttonText": "Learn More",
      "image": "https://storage.googleapis.com/...",
      "order": 1
    }
  ]
}
```

### faculties
```json
{
  "id": "auto-generated",
  "name": "School of Business",
  "description": "Description here",
  "icon": "💼",
  "image": "https://storage.googleapis.com/...",
  "order": 1
}
```

### professionalAffiliations
```json
{
  "id": "auto-generated",
  "title": "Affiliation Name",
  "description": "Description",
  "logo": "https://storage.googleapis.com/..."
}
```

### foreignAffiliations
```json
{
  "id": "auto-generated",
  "name": "Organization Name",
  "country": "Country Name",
  "description": "Description",
  "logo": "https://storage.googleapis.com/..."
}
```

### programmes
```json
{
  "id": "auto-generated",
  "title": "Programme Title",
  "description": "Description",
  "category": "Category",
  "duration": "6 weeks",
  "image": "https://storage.googleapis.com/..."
}
```

## Frontend Components Updated

The following frontend components now fetch data from Firestore:

1. **Home.js** - Fetches banners and faculties
2. **ProfessionalAffiliations.js** - Fetches professional affiliations
3. **ForeignAffiliations.js** - Fetches foreign affiliations
4. **Newprogramme.js** - Fetches programmes

## Custom Hooks

### useContent()
Fetches banners and faculties with fallback to mock data

```javascript
const { banners, faculties, bannersLoading, facultiesLoading } = useContent();
```

### useProfessionalAffiliations()
Fetches professional affiliations

```javascript
const { data, loading, error } = useProfessionalAffiliations();
```

### useForeignAffiliations()
Fetches foreign affiliations

```javascript
const { data, loading, error } = useForeignAffiliations();
```

### useProgrammes()
Fetches programmes

```javascript
const { data, loading, error } = useProgrammes();
```

## Image Upload

Images are automatically uploaded to Firebase Storage in the following folders:
- `banners/` - Banner images
- `faculties/` - Faculty images
- `professional-affiliations/` - Professional affiliation logos
- `foreign-affiliations/` - Foreign affiliation logos
- `programmes/` - Programme images

## Testing

1. Login as admin
2. Go to `/admin/settings`
3. Add test data in each section
4. Verify data appears on frontend pages
5. Test edit and delete operations
6. Verify images are properly stored and retrieved

## Troubleshooting

### Images not uploading
- Check Firebase Storage rules
- Verify user has admin role
- Check browser console for errors

### Data not appearing on frontend
- Verify Firestore collections exist
- Check Firestore security rules
- Verify data structure matches expected format
- Check browser console for errors

### Slow loading
- Check Firestore indexes
- Optimize image sizes before upload
- Consider implementing pagination for large datasets
