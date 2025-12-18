const axios = require('axios');

const API_BASE = 'http://localhost:5000';

const testConnection = async () => {
  try {
    console.log('🧪 Testing OnCode Backend Connection...\n');
    
    // Test 1: Health Check
    console.log('1️⃣ Testing health check...');
    const healthResponse = await axios.get(`${API_BASE}/`);
    console.log('✅ Health check passed:', healthResponse.data.message);
    
    // Test 2: Get Courses
    console.log('\n2️⃣ Testing courses endpoint...');
    const coursesResponse = await axios.get(`${API_BASE}/api/courses`);
    console.log(`✅ Courses endpoint working: ${coursesResponse.data.courses?.length || 0} courses found`);
    
    // Test 3: Test Login
    console.log('\n3️⃣ Testing login endpoint...');
    try {
      const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
        email: 'student@oncode.com',
        password: 'student123'
      });
      console.log('✅ Login test passed:', loginResponse.data.user?.name);
    } catch (loginError) {
      if (loginError.response?.status === 401) {
        console.log('⚠️ Login test: Credentials not found (run npm run init-db first)');
      } else {
        console.log('❌ Login test failed:', loginError.message);
      }
    }
    
    // Test 4: Test Registration
    console.log('\n4️⃣ Testing registration endpoint...');
    try {
      const testEmail = `test${Date.now()}@example.com`;
      const registerResponse = await axios.post(`${API_BASE}/api/auth/register`, {
        email: testEmail,
        password: 'test123',
        name: 'Test User',
        role: 'student'
      });
      console.log('✅ Registration test passed:', registerResponse.data.user?.name);
    } catch (regError) {
      console.log('⚠️ Registration test:', regError.response?.data?.error || regError.message);
    }
    
    console.log('\n🎉 Backend connection tests completed!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n💡 Make sure the backend server is running:');
    console.log('   npm run dev');
    process.exit(1);
  }
};

testConnection();