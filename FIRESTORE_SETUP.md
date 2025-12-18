# Firestore Security Rules Setup

## Fix "Missing or insufficient permissions" Error

Follow these steps to update your Firestore security rules:

### Option 1: Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **oncode-d4d30**
3. Click on **Firestore Database** in the left menu
4. Click on the **Rules** tab
5. Replace the existing rules with the content from `firestore.rules` file
6. Click **Publish**

### Option 2: Quick Fix (Development Only)

For development/testing, you can temporarily allow all access:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ WARNING: This allows anyone to read/write your database. Only use for development!**

### Option 3: Production Rules (Secure)

Use the rules from `firestore.rules` file which:
- Allows public read access to news, events, and settings
- Requires authentication for write operations
- Protects other collections with authentication

## Verify Rules Are Working

After updating rules:
1. Refresh your application
2. Navigate to Admin Settings
3. Try adding a news item or event
4. Check the News & Events page to see if data loads

## Troubleshooting

If you still see permission errors:
- Make sure you're logged in as admin
- Check browser console for specific error messages
- Verify Firebase project ID matches in `firebase.js`
- Wait 1-2 minutes after publishing rules for changes to propagate
