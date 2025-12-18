# Banner Setup Guide

## What's Connected to Firestore

### Home Page Displays:
1. **Banners** - Auto-rotating hero banners at the top
2. **Faculties** - Flip cards showing different schools/faculties

### Admin Settings Page Manages:
1. **Banners Section** - Add/edit/remove banners with images
2. **Faculties Section** - Manage faculty cards (already exists)
3. **News Section** - Manage news articles
4. **Events Section** - Manage upcoming events
5. **About Page** - Update mission and statistics
6. **Contact Info** - Update contact details

## Firestore Collections Used:

- `siteContent/banners` - Stores all banner data
- `faculties` - Stores faculty information
- `news` - Stores news articles
- `events` - Stores event information
- `settings/about` - Stores about page content
- `settings/contact` - Stores contact information

## How Banners Work:

1. Admin goes to **Settings → Banners**
2. Add/edit banner with:
   - Title
   - Subtitle
   - Button Text
   - Image (uploaded to Firebase Storage)
3. Click "Save All Banners"
4. Home page automatically displays updated banners
5. Banners auto-rotate every 5 seconds

## Fixed Issues:

✅ Removed duplicate return statement in Home.js
✅ Fixed banner slider CSS for dynamic number of banners
✅ Fixed transform calculation for proper sliding
✅ Updated Firestore rules to include siteContent and faculties collections

## Next Steps:

1. Update Firestore rules in Firebase Console (use firestore.rules file)
2. Go to Admin Settings → Banners
3. Add your banners with images
4. Check Home page to see them working!
