const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const bcrypt = require('bcryptjs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function checkAllUsers() {
    console.log('\n=== Checking All Users in Firestore ===\n');

    try {
        const snapshot = await db.collection('users').get();

        if (snapshot.empty) {
            console.log('❌ No users found in Firestore!');
            return;
        }

        console.log(`Found ${snapshot.size} user(s):\n`);

        for (const doc of snapshot.docs) {
            const data = doc.data();
            console.log(`--- User ID: ${doc.id} ---`);
            console.log(`Email: ${data.email}`);
            console.log(`Name: ${data.name}`);
            console.log(`Role: ${data.role}`);
            console.log(`Status: ${data.status}`);
            console.log(`Password Hash: ${data.password ? data.password.substring(0, 20) + '...' : 'MISSING'}`);
            
            // Test common passwords
            if (data.password) {
                const testPasswords = ['admin123', 'student123', 'instructor123', 'madhee67'];
                for (const pwd of testPasswords) {
                    const match = await bcrypt.compare(pwd, data.password);
                    if (match) {
                        console.log(`✅ Password matches: "${pwd}"`);
                    }
                }
            }
            console.log('');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }

    process.exit(0);
}

checkAllUsers();
