const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const setupDatabase = async () => {
  try {
    console.log('Setting up database collections and indexes...');

    // Create collections with sample documents to establish structure
    console.log('Creating collection structures...');

    // Users collection structure
    await db.collection('users').doc('_structure').set({
      _note: 'This document defines the users collection structure',
      email: 'string - user email (unique)',
      password: 'string - hashed password',
      name: 'string - full name',
      role: 'string - student|instructor|admin',
      status: 'string - active|inactive',
      age: 'number - student age (optional)',
      phone: 'string - phone number (optional)',
      address: 'string - address (optional)',
      city: 'string - city (optional)',
      country: 'string - country (optional)',
      createdAt: 'timestamp - creation date',
      lastActive: 'timestamp - last login',
      updatedAt: 'timestamp - last update'
    });

    // Courses collection structure
    await db.collection('courses').doc('_structure').set({
      _note: 'This document defines the courses collection structure',
      title: 'string - course title',
      description: 'string - course description',
      category: 'string - course category',
      price: 'number - course price',
      instructor: 'string - instructor name',
      duration: 'string - course duration',
      level: 'string - Beginner|Intermediate|Advanced',
      requirements: 'array - course requirements',
      whatYouLearn: 'array - learning outcomes',
      enrollments: 'number - enrollment count',
      rating: 'number - average rating',
      reviews: 'array - course reviews',
      status: 'string - active|inactive|draft',
      createdAt: 'timestamp - creation date',
      createdBy: 'string - creator user id',
      updatedAt: 'timestamp - last update'
    });

    // Enrollments collection structure
    await db.collection('enrollments').doc('_structure').set({
      _note: 'This document defines the enrollments collection structure',
      userId: 'string - student user id',
      courseId: 'string - course id',
      enrolledAt: 'timestamp - enrollment date',
      progress: 'number - completion percentage (0-100)',
      status: 'string - active|completed|dropped',
      completedLessons: 'array - completed lesson ids',
      certificateIssued: 'boolean - certificate status',
      certificateId: 'string - certificate id (if issued)',
      certificateIssuedAt: 'timestamp - certificate issue date',
      updatedAt: 'timestamp - last update'
    });

    // Contacts collection structure
    await db.collection('contacts').doc('_structure').set({
      _note: 'This document defines the contacts collection structure',
      name: 'string - contact name',
      email: 'string - contact email',
      subject: 'string - inquiry subject',
      message: 'string - inquiry message',
      status: 'string - new|in-progress|resolved',
      submittedAt: 'timestamp - submission date',
      respondedAt: 'timestamp - response date (optional)',
      response: 'string - admin response (optional)',
      updatedAt: 'timestamp - last update'
    });

    // Certificates collection structure (optional)
    await db.collection('certificates').doc('_structure').set({
      _note: 'This document defines the certificates collection structure',
      certificateId: 'string - unique certificate id',
      userId: 'string - student user id',
      courseId: 'string - course id',
      studentName: 'string - student name',
      courseName: 'string - course name',
      instructor: 'string - instructor name',
      issuedAt: 'timestamp - issue date',
      verificationUrl: 'string - verification URL'
    });

    console.log('✅ Database collections created successfully!');

    // Note: Firestore indexes are created automatically for single fields
    // Composite indexes need to be created through Firebase Console or CLI
    console.log('\n📋 Required Composite Indexes (create in Firebase Console):');
    console.log('1. enrollments: userId (ASC) + status (ASC)');
    console.log('2. courses: category (ASC) + status (ASC) + createdAt (DESC)');
    console.log('3. enrollments: certificateId (ASC)');
    console.log('4. contacts: status (ASC) + submittedAt (DESC)');

    console.log('\n🔐 Security Rules:');
    console.log('Remember to set up Firestore security rules in Firebase Console');
    console.log('Refer to database-schema.md for security rules configuration');

    console.log('\n🎯 Next Steps:');
    console.log('1. Run: node seedData.js (to populate with sample data)');
    console.log('2. Set up Firestore security rules in Firebase Console');
    console.log('3. Create composite indexes in Firebase Console');
    console.log('4. Start the backend server: npm run dev');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
};

setupDatabase();