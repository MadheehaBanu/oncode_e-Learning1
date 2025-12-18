# 🚀 Quick Reference Card

## One-Command Actions

```bash
# Verify everything is ready
npm run verify

# Test before deployment
npm run test:deploy

# Install all dependencies
npm run install:all

# Start both servers
npm start

# Build for production
npm run build

# Clean everything
npm run clean
```

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `DEPLOY_NOW.md` | 5-minute deployment guide |
| `FINAL_SUMMARY.md` | What was fixed & why |
| `START_HERE_DEPLOYMENT.md` | Complete overview |
| `DEPLOYMENT_CHECKLIST.md` | Detailed deployment steps |
| `PRE_PUSH_CHECKLIST.md` | Before GitHub push |

---

## 🔑 Test Credentials

```
Admin:      madheehabanum67@gmail.com / madhee67
Student:    student@oncode.com / student123
Instructor: instructor@oncode.com / instructor123
```

---

## 🌐 URLs

```
Local Frontend:  http://localhost:3000
Local Backend:   http://localhost:5000
GitHub Repo:     https://github.com/MadheehaBanu/e-Learning
```

---

## ⚡ Quick Deploy

```bash
# 1. Verify
npm run verify

# 2. Test
npm run test:deploy

# 3. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 4. Deploy
# Follow DEPLOY_NOW.md
```

---

## 🆘 Quick Fixes

### Port in use
```bash
# Change port in backend/.env
PORT=5001
```

### Can't login
```bash
cd backend
npm run init-db
```

### CORS error
```
Update FRONTEND_URL in Vercel backend settings
```

### Build fails
```bash
npm run clean
npm run install:all
npm run build:test
```

---

## ✅ Deployment Checklist

- [ ] `npm run verify` passes
- [ ] `npm run test:deploy` passes
- [ ] Tested locally with `npm start`
- [ ] Sensitive files in .gitignore
- [ ] Pushed to GitHub
- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set
- [ ] CORS configured
- [ ] Tested live site

---

## 📱 After Deployment

1. Test login
2. Test course browsing
3. Test admin dashboard
4. Check console for errors
5. Update README with live URLs

---

**Need help? Open the relevant guide above!**
