// Quick test to start server
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Firebase setup
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

global.db = admin.firestore();

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ OnCode Backend is working!',
    firebase: '✅ Connected',
    project: serviceAccount.project_id
  });
});

// Test auth route
app.post('/test-login', async (req, res) => {
  try {
    const users = await global.db.collection('users').limit(1).get();
    res.json({ 
      message: '✅ Database connection working!',
      hasUsers: !users.empty
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log(`📊 Firebase project: ${serviceAccount.project_id}`);
  console.log(`🔗 Test URL: http://localhost:${PORT}`);
});