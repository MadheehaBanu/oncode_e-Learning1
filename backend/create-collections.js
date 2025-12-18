const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const createCollections = async () => {
  try {
    console.log('Creating Firebase collections...');

    // Create users collection with only admin user
    console.log('Creating users collection...');
    const adminUser = {
      email: 'admin@oncode.com',
      password: await bcrypt.hash('admin123', 12),
      name: 'Admin User',
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    
    await db.collection('users').add(adminUser);
    console.log('✅ Created users collection with admin user');

    // Create empty courses collection (just structure document)
    console.log('Creating courses collection...');
    await db.collection('courses').doc('_structure').set({
      _note: 'Collection structure for courses',
      title: 'string - course title',
      instructor: 'string - instructor name',
      category: 'string - course category',
      price: 'number - course price',
      description: 'string - course description',
      duration: 'string - course duration',
      level: 'string - Beginner|Intermediate|Advanced',
      requirements: 'array - course requirements',
      whatYouLearn: 'array - learning outcomes',
      courseContent: 'array - course curriculum',
      enrollments: 'number - enrollment count',
      rating: 'number - average rating',
      students: 'string - student count display',
      thumbnail: 'string - course icon/image',
      status: 'string - draft|active|archived',
      createdAt: 'timestamp - creation date',
      createdBy: 'string - creator user id'
    });
    console.log('✅ Created courses collection');

    // Create empty enrollments collection
    console.log('Creating enrollments collection...');
    await db.collection('enrollments').doc('_structure').set({
      _note: 'Collection structure for enrollments',
      userId: 'string - student user id',
      courseId: 'string - course id',
      enrolledAt: 'timestamp - enrollment date',
      progress: 'number - completion percentage (0-100)',
      status: 'string - active|completed|dropped',
      completedLessons: 'array - completed lesson ids',
      certificateIssued: 'boolean - certificate status',
      certificateId: 'string - certificate id (if issued)',
      certificateIssuedAt: 'timestamp - certificate issue date'
    });
    console.log('✅ Created enrollments collection');

    // Create empty contacts collection
    console.log('Creating contacts collection...');
    await db.collection('contacts').doc('_structure').set({
      _note: 'Collection structure for contacts',
      name: 'string - contact name',
      email: 'string - contact email',
      subject: 'string - inquiry subject',
      message: 'string - inquiry message',
      status: 'string - new|in-progress|resolved',
      submittedAt: 'timestamp - submission date',
      respondedAt: 'timestamp - response date (optional)',
      response: 'string - admin response (optional)'
    });
    console.log('✅ Created contacts collection');

    // Create empty certificates collection
    console.log('Creating certificates collection...');
    await db.collection('certificates').doc('_structure').set({
      _note: 'Collection structure for certificates',
      certificateId: 'string - unique certificate id',
      userId: 'string - student user id',
      courseId: 'string - course id',
      studentName: 'string - student name',
      courseName: 'string - course name',
      instructor: 'string - instructor name',
      issuedAt: 'timestamp - issue date'
    });
    console.log('✅ Created certificates collection');

    console.log('\n🎉 All collections created successfully!');
    console.log('📊 Collections ready:');
    console.log('  - users (with admin user)');
    console.log('  - courses (empty, ready for admin input)');
    console.log('  - enrollments (empty)');
    console.log('  - contacts (empty)');
    console.log('  - certificates (empty)');
    console.log('\n👤 Admin login: admin@oncode.com / admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating collections:', error);
    process.exit(1);
  }
};

createCollections();