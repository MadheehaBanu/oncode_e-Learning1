const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Init Firebase Admin for Verification
try {
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
} catch (e) { }
const db = admin.firestore();

const API_URL = 'http://localhost:5000/api';

async function testFullStack() {
    try {
        console.log('1. Logging in as Admin...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@oncode.com',
                password: 'admin123'
            })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful.');

        console.log('2. Creating Course via API...');
        const createRes = await fetch(`${API_URL}/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: `API Test Course ${Date.now()}`,
                description: 'Test description for debugging',
                category: 'Web Development',
                price: 10,
                instructor: 'Test Admin',
                duration: '1h'
            })
        });

        if (!createRes.ok) {
            const errText = await createRes.text();
            throw new Error(`Create failed: ${errText}`);
        }

        const createData = await createRes.json();
        const apiCourseId = createData.course.id;
        console.log('Created Course ID (via API):', apiCourseId);

        console.log('3. Verifying in Firestore directly...');
        const doc = await db.collection('courses').doc(apiCourseId).get();

        if (doc.exists) {
            console.log('✅ SUCCESS: Course found in Firestore!');
        } else {
            console.log('❌ FAILURE: Course NOT found in Firestore.');
            console.log(' DIAGNOSIS: The running backend server is likely in MOCK MODE.');
        }

    } catch (error) {
        console.error('Test Error:', error.message);
    }
}

testFullStack();
