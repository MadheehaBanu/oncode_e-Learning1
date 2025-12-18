# Pre-Push Checklist

## Before Pushing to GitHub

### 1. Remove Sensitive Files
```bash
# Check if these files exist and remove them
git rm --cached backend/serviceAccountKey.json
git rm --cached backend/.env
git rm --cached frontend/.env
```

### 2. Verify .gitignore
```bash
# Make sure these files are in .gitignore
cat .gitignore
```

Should include:
- `serviceAccountKey.json`
- `.env`
- `node_modules/`

### 3. Test Locally
```bash
# Install dependencies
npm run install:all

# Start the project
npm start
```

Test these features:
- [ ] Login works
- [ ] Registration works
- [ ] Courses load
- [ ] Admin dashboard accessible
- [ ] No console errors

### 4. Build Test
```bash
# Test frontend build
cd frontend
npm run build
cd ..
```

Should complete without errors.

### 5. Clean Up
```bash
# Remove node_modules before pushing (optional but recommended)
rm -rf node_modules
rm -rf frontend/node_modules
rm -rf backend/node_modules
```

### 6. Git Commands
```bash
# Add all files
git add .

# Commit
git commit -m "Ready for deployment - all features working"

# Push to GitHub
git push origin main
```

---

## After Pushing

### Verify on GitHub
1. Go to your repository
2. Check that `serviceAccountKey.json` is NOT visible
3. Check that `.env` files are NOT visible
4. Verify README.md is displayed correctly

### Next Steps
Follow `DEPLOYMENT_CHECKLIST.md` to deploy to Vercel

---

## If You Accidentally Pushed Sensitive Files

### Remove from Git History
```bash
# Remove serviceAccountKey.json from history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/serviceAccountKey.json" \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push origin --force --all
```

### Regenerate Credentials
1. Go to Firebase Console
2. Revoke the old service account key
3. Generate a new one
4. Update locally (don't commit!)

---

## Quick Check Command
```bash
# Run this to check for sensitive files
git status --ignored
```

If you see `serviceAccountKey.json` or `.env` files, they should be marked as ignored.
