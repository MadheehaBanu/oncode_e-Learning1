const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const db = admin.firestore();
  
  console.log('✅ Firebase connection successful!');
  console.log('📋 Project ID:', serviceAccount.project_id);
  
  // Test database connection
  const testConnection = async () => {
    try {
      // Try to read from users collection
      const usersRef = db.collection('users');
      const snapshot = await usersRef.limit(1).get();
      
      console.log('✅ Database connection successful!');
      console.log('📊 Users collection exists:', !snapshot.empty);
      
      if (!snapshot.empty) {
        console.log('👤 Sample user found');
      } else {
        console.log('⚠️  No users found - run seedData.js to populate');
      }
      
      process.exit(0);
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      process.exit(1);
    }
  };
  
  testConnection();
  
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  process.exit(1);
}