const { initializeDatabase } = require('./config/database');

async function checkFirebase() {
  try {
    console.log('🔍 Checking Firebase connection...');
    
    const db = initializeDatabase();
    
    // Test connection by trying to read from a collection
    const testCollection = await db.collection('users').limit(1).get();
    
    if (testCollection.empty) {
      console.log('✅ Firebase connected successfully (no data found)');
    } else {
      console.log('✅ Firebase connected successfully with data');
      console.log(`📊 Found ${testCollection.size} document(s) in users collection`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error.message);
    return false;
  }
}

checkFirebase();