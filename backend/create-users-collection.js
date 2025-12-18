const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const createUsersCollection = async () => {
  try {
    console.log('Creating users collection with sample data...');

    // Clear existing users
    const existingUsers = await db.collection('users').get();
    const batch = db.batch();
    existingUsers.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log('✅ Cleared existing users');

    // Create sample users
    const users = [
      {
        email: 'admin@oncode.com',
        password: await bcrypt.hash('admin123', 12),
        name: 'Admin User',
        role: 'admin',
        status: 'active',
        profileImage: null,
        phone: '+1-555-0100',
        address: '123 Admin Street',
        city: 'San Francisco',
        country: 'USA',
        dateOfBirth: '1985-01-15',
        gender: 'male',
        bio: 'System Administrator for OnCode E-Learning Platform',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/admin',
          twitter: 'https://twitter.com/admin',
          website: 'https://oncode.com'
        },
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          language: 'en',
          timezone: 'America/Los_Angeles'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        isEmailVerified: true,
        isPhoneVerified: false
      },
      {
        email: 'student@oncode.com',
        password: await bcrypt.hash('student123', 12),
        name: 'John Doe',
        role: 'student',
        status: 'active',
        profileImage: null,
        age: 25,
        phone: '+1-555-0123',
        address: '456 Student Avenue',
        city: 'New York',
        country: 'USA',
        dateOfBirth: '1999-03-20',
        gender: 'male',
        bio: 'Passionate learner interested in web development and data science',
        education: {
          degree: 'Bachelor of Computer Science',
          institution: 'New York University',
          graduationYear: 2021
        },
        experience: 'Entry Level',
        interests: ['Web Development', 'Data Science', 'Machine Learning'],
        socialLinks: {
          linkedin: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe'
        },
        preferences: {
          emailNotifications: true,
          smsNotifications: true,
          language: 'en',
          timezone: 'America/New_York'
        },
        learningGoals: ['Become a Full Stack Developer', 'Learn Python for Data Science'],
        skillLevel: 'Beginner',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        isEmailVerified: true,
        isPhoneVerified: true
      },
      {
        email: 'instructor@oncode.com',
        password: await bcrypt.hash('instructor123', 12),
        name: 'Dr. Angela Yu',
        role: 'instructor',
        status: 'active',
        profileImage: null,
        phone: '+1-555-0456',
        address: '789 Instructor Boulevard',
        city: 'Los Angeles',
        country: 'USA',
        dateOfBirth: '1980-07-10',
        gender: 'female',
        bio: 'Experienced software developer and educator with 10+ years in the industry. Passionate about teaching web development and making programming accessible to everyone.',
        education: {
          degree: 'PhD in Computer Science',
          institution: 'Stanford University',
          graduationYear: 2008
        },
        experience: 'Expert',
        specializations: ['Web Development', 'JavaScript', 'React', 'Node.js', 'Python'],
        teachingExperience: '8 years',
        coursesCreated: 15,
        totalStudents: 50000,
        rating: 4.8,
        socialLinks: {
          linkedin: 'https://linkedin.com/in/angelayu',
          twitter: 'https://twitter.com/angelayu',
          website: 'https://angelayu.com',
          youtube: 'https://youtube.com/angelayu'
        },
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          language: 'en',
          timezone: 'America/Los_Angeles'
        },
        bankDetails: {
          accountHolder: 'Dr. Angela Yu',
          accountNumber: '****1234',
          routingNumber: '****5678',
          paypalEmail: 'angela@paypal.com'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        isEmailVerified: true,
        isPhoneVerified: true
      },
      {
        email: 'jane.smith@example.com',
        password: await bcrypt.hash('password123', 12),
        name: 'Jane Smith',
        role: 'student',
        status: 'active',
        profileImage: null,
        age: 28,
        phone: '+1-555-0789',
        address: '321 Learning Lane',
        city: 'Chicago',
        country: 'USA',
        dateOfBirth: '1996-11-05',
        gender: 'female',
        bio: 'Marketing professional looking to transition into tech',
        education: {
          degree: 'Bachelor of Marketing',
          institution: 'University of Chicago',
          graduationYear: 2018
        },
        experience: 'Intermediate',
        interests: ['Digital Marketing', 'Web Development', 'UX Design'],
        socialLinks: {
          linkedin: 'https://linkedin.com/in/janesmith'
        },
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          language: 'en',
          timezone: 'America/Chicago'
        },
        learningGoals: ['Learn Frontend Development', 'Build Portfolio Website'],
        skillLevel: 'Intermediate',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        isEmailVerified: true,
        isPhoneVerified: false
      }
    ];

    // Add users to Firestore
    for (const user of users) {
      const userRef = await db.collection('users').add(user);
      console.log(`✅ Created user: ${user.name} (${user.role}) - ID: ${userRef.id}`);
    }

    console.log('\n🎉 Users collection created successfully!');
    console.log('\n👥 Test Accounts:');
    console.log('Admin: admin@oncode.com / admin123');
    console.log('Student: student@oncode.com / student123');
    console.log('Instructor: instructor@oncode.com / instructor123');
    console.log('Student 2: jane.smith@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating users collection:', error);
    process.exit(1);
  }
};

createUsersCollection();