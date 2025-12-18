const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize directly to see errors if any
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase initialized.');
} catch (e) {
    console.error('Init error:', e);
}

const db = admin.firestore();

async function testWrite() {
    const testId = 'test_' + Date.now();
    console.log(`Attempting to write document: ${testId} to 'test_collection'`);

    try {
        await db.collection('test_collection').doc(testId).set({
            message: 'Hello from verification script',
            timestamp: new Date()
        });
        console.log('Write successful!');

        const doc = await db.collection('test_collection').doc(testId).get();
        if (doc.exists) {
            console.log('Read verification successful:', doc.data());
        } else {
            console.log('Read failed: Document not found.');
        }
    } catch (error) {
        console.error('Write failed:', error);
    }
}

testWrite();
