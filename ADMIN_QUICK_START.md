# Admin Settings Module - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Update Firebase Config
Edit `frontend/src/firebase.js` and add your Firebase credentials:

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

### Step 2: Access Admin Panel
1. Login as admin user (admin@oncode.com / admin123)
2. Navigate to `/admin/settings`

### Step 3: Start Managing Content

#### Add Banners
1. Click "Banners" tab
2. Fill in title, subtitle, button text
3. Upload banner image
4. Click "Save All Banners"

#### Add Faculties
1. Click "Faculties" tab
2. Enter faculty name, description, icon
3. Upload faculty image
4. Click "Add Faculty"

#### Add Professional Affiliations
1. Click "Professional Affiliations" tab
2. Enter title and description
3. Upload logo
4. Click "Add Affiliation"

#### Add Foreign Affiliations
1. Click "Foreign Affiliations" tab
2. Enter name, country, description
3. Upload logo
4. Click "Add Affiliation"

#### Add Programmes
1. Click "Programmes" tab
2. Enter title, category, duration, description
3. Upload programme image
4. Click "Add Programme"

## 📋 Firestore Collections to Create

Create these collections in Firestore:

1. **faculties** - Faculty documents
2. **professionalAffiliations** - Professional affiliation documents
3. **foreignAffiliations** - Foreign affiliation documents
4. **programmes** - Programme documents
5. **siteContent** - Create document "banners" inside

## 🔒 Firebase Security Rules

### Firestore Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### Storage Rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## 🎯 What Gets Updated on Frontend

| Admin Section | Frontend Display |
|---|---|
| Banners | Home page hero section |
| Faculties | Home page faculties grid |
| Professional Affiliations | Professional Affiliations section |
| Foreign Affiliations | Foreign Affiliations section |
| Programmes | ONCODE Programmes section |

## ✨ Features

✅ Real-time updates - Changes appear instantly on frontend
✅ Image optimization - Automatic image upload to Firebase Storage
✅ Easy management - Simple CRUD interface
✅ Responsive design - Works on desktop and mobile
✅ Error handling - Clear error messages
✅ Loading states - Visual feedback during operations

## 🐛 Troubleshooting

**Images not uploading?**
- Check Firebase Storage is enabled
- Verify security rules allow admin writes
- Check browser console for errors

**Data not appearing on frontend?**
- Verify Firestore collections exist
- Check data structure matches expected format
- Clear browser cache and refresh

**Admin panel not accessible?**
- Verify user has admin role
- Check authentication is working
- Verify route `/admin/settings` is accessible

## 📚 File Locations

- Admin Settings Page: `frontend/src/pages/admin/AdminSettings.js`
- Management Components: `frontend/src/components/admin/`
- Custom Hooks: `frontend/src/hooks/`
- Firebase Config: `frontend/src/firebase.js`
- Storage Utils: `frontend/src/utils/firebaseStorage.js`

## 🔗 Related Documentation

- Full Setup Guide: `ADMIN_SETUP.md`
- Implementation Summary: `ADMIN_MODULE_SUMMARY.md`
- Main README: `README.md`

## 💡 Tips

1. **Organize content** - Use order field for faculties to control display sequence
2. **Image sizes** - Keep images under 5MB for faster uploads
3. **Descriptions** - Keep descriptions concise for better UI
4. **Testing** - Test changes on frontend immediately after saving
5. **Backup** - Export Firestore data regularly for backup

## 🎓 Example Data

### Faculty Example
```
Name: School of Business
Description: Master business fundamentals and leadership
Icon: 💼
Order: 1
```

### Programme Example
```
Title: Masters in Business Administration
Category: Masters
Duration: 2 years
Description: Advanced business management program
```

### Affiliation Example
```
Title: ISO Certified
Description: International Standards Organization
```

---

**Need help?** Check the full documentation in `ADMIN_SETUP.md`
