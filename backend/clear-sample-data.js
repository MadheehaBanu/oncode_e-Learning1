const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const clearSampleData = async () => {
  try {
    console.log('Clearing sample data from Firebase...');

    // Clear sample courses (keep structure)
    console.log('Clearing courses...');
    const coursesSnapshot = await db.collection('courses').get();
    const courseBatch = db.batch();
    coursesSnapshot.docs.forEach(doc => {
      courseBatch.delete(doc.ref);
    });
    await courseBatch.commit();
    console.log('✅ Cleared courses collection');

    // Clear sample users (keep admin user)
    console.log('Clearing users (keeping admin)...');
    const usersSnapshot = await db.collection('users').get();
    const userBatch = db.batch();
    usersSnapshot.docs.forEach(doc => {
      const userData = doc.data();
      // Keep admin user, remove others
      if (userData.email !== 'admin@oncode.com') {
        userBatch.delete(doc.ref);
      }
    });
    await userBatch.commit();
    console.log('✅ Cleared users (kept admin)');

    // Clear enrollments
    console.log('Clearing enrollments...');
    const enrollmentsSnapshot = await db.collection('enrollments').get();
    const enrollmentBatch = db.batch();
    enrollmentsSnapshot.docs.forEach(doc => {
      enrollmentBatch.delete(doc.ref);
    });
    await enrollmentBatch.commit();
    console.log('✅ Cleared enrollments');

    // Clear contacts
    console.log('Clearing contacts...');
    const contactsSnapshot = await db.collection('contacts').get();
    const contactBatch = db.batch();
    contactsSnapshot.docs.forEach(doc => {
      contactBatch.delete(doc.ref);
    });
    await contactBatch.commit();
    console.log('✅ Cleared contacts');

    console.log('\n🎉 Sample data cleared successfully!');
    console.log('📋 Collections are now empty and ready for real data');
    console.log('👤 Admin user kept: admin@oncode.com / admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing sample data:', error);
    process.exit(1);
  }
};

clearSampleData();