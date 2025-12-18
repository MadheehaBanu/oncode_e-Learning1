const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const bcrypt = require('bcryptjs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function checkAdmin() {
    console.log('--- Checking Admin User ---');

    const snapshot = await db.collection('users').where('email', '==', 'admin@oncode.com').get();

    if (snapshot.empty) {
        console.log('❌ ERROR: Admin user "admin@oncode.com" NOT FOUND in Firestore.');
        return;
    }

    snapshot.forEach(async doc => {
        const data = doc.data();
        console.log(`User Found: ${doc.id}`);
        console.log(`Email: ${data.email}`);
        console.log(`Role: ${data.role}`);
        console.log(`Password (First 10 chars): ${data.password ? data.password.substring(0, 10) + '...' : 'UNDEFINED'}`);

        const isHashed = data.password && data.password.startsWith('$2');
        console.log(`Is Password Hashed (looks like bcrypt)? ${isHashed ? 'YES' : 'NO'}`);

        if (data.password) {
            console.log('Attempting verify with "admin123"...');
            const match = await bcrypt.compare('admin123', data.password);
            console.log(`Password "admin123" matches? ${match ? 'YES' : 'NO'}`);
        } else {
            console.log('❌ Password field is missing!');
        }
    });
}

checkAdmin();
