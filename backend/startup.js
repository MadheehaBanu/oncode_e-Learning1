const { initializeDatabase } = require('./scripts/initDatabase');
const { getDatabase } = require('./config/database');

const startup = async () => {
  try {
    console.log('🚀 OnCode E-Learning Platform - Backend Startup');
    console.log('================================================');
    
    // Initialize database connection
    console.log('📡 Connecting to database...');
    const db = getDatabase();
    
    // Check if database has data
    console.log('🔍 Checking database status...');
    const usersSnapshot = await db.collection('users').get();
    
    if (usersSnapshot.empty || usersSnapshot.size === 0) {
      console.log('📝 Database appears empty, initializing with sample data...');
      await initializeDatabase();
    } else {
      console.log(`✅ Database connected successfully (${usersSnapshot.size} users found)`);
    }
    
    // Start the server
    console.log('🌐 Starting server...');
    require('./index.js');
    
  } catch (error) {
    console.error('❌ Startup failed:', error);
    process.exit(1);
  }
};

startup();