const admin = require('firebase-admin');

if (!admin.apps.length) {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const checkCollections = async () => {
    const collections = [
        'users',
        'courses',
        'modules',
        'enrollments',
        'quizzes',
        'quizResults',
        'certificates',
        'news',
        'events',
        'assignments',
        'assignmentSubmissions'
    ];

    console.log('\n📊 Firestore Collections Status:\n');

    for (const collectionName of collections) {
        const snapshot = await db.collection(collectionName).get();
        const count = snapshot.size;
        const emoji = count > 0 ? '✅' : '❌';
        console.log(`${emoji} ${collectionName.padEnd(25)} : ${count} documents`);
    }

    console.log('\n');
    process.exit(0);
};

checkCollections();
