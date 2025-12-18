const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const bcrypt = require('bcryptjs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function fixUserPassword(email, newPassword) {
    console.log(`\n=== Fixing Password for ${email} ===\n`);

    try {
        const snapshot = await db.collection('users').where('email', '==', email).get();

        if (snapshot.empty) {
            console.log(`❌ User ${email} not found!`);
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        for (const doc of snapshot.docs) {
            await db.collection('users').doc(doc.id).update({
                password: hashedPassword,
                updatedAt: new Date().toISOString()
            });
            console.log(`✅ Updated password for user ID: ${doc.id}`);
        }

        console.log(`\n✅ Password updated successfully!`);
        console.log(`You can now login with:`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${newPassword}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    process.exit(0);
}

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
    console.log('Usage: node fix-user-password.js <email> <password>');
    console.log('Example: node fix-user-password.js madheehabanum67@gmail.com madhee67');
    process.exit(1);
}

fixUserPassword(email, password);
