const bcrypt = require('bcryptjs');
const { getDatabase } = require('./config/database');
const dbHelpers = require('./utils/dbHelpers');

const db = getDatabase();

const seedData = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    console.log('Clearing existing data...');
    const collections = ['users', 'courses', 'enrollments', 'contacts'];
    
    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log(`Cleared ${collectionName} collection`);
    }

    // Seed Users
    console.log('Seeding users...');
    const users = [
      {
        email: 'admin@oncode.com',
        password: await bcrypt.hash('<demo_password>', 12),
        name: 'Admin User',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      },
      {
        email: 'student@oncode.com',
        password: await bcrypt.hash('<demo_password>', 12),
        name: 'John Doe',
        role: 'student',
        status: 'active',
        age: 25,
        phone: '+1-555-0123',
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      },
      {
        email: 'instructor@oncode.com',
        password: await bcrypt.hash('<demo_password>', 12),
        name: 'Dr. Angela Yu',
        role: 'instructor',
        status: 'active',
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      }
    ];

    const userRefs = [];
    for (const user of users) {
      const userRef = await db.collection('users').add(user);
      userRefs.push(userRef);
      console.log(`Created user: ${user.name}`);
    }

    // Seed Courses
    console.log('Seeding courses...');
    const courses = [
      {
        title: 'Complete Web Development Bootcamp',
        description: 'Learn HTML, CSS, JavaScript, Node.js, React, MongoDB and more! This comprehensive course will take you from beginner to advanced web developer.',
        category: 'Web Development',
        price: 84.99,
        instructor: 'Dr. Angela Yu',
        duration: '65 hours',
        level: 'Beginner',
        requirements: ['Basic computer skills', 'No programming experience required'],
        whatYouLearn: [
          'Build 16 web development projects',
          'Learn the latest technologies',
          'Build a portfolio of websites',
          'Learn professional developer best practices'
        ],
        enrollments: 850,
        rating: 4.7,
        reviews: [
          {
            userId: userRefs[1].id,
            userName: 'John Doe',
            rating: 5,
            comment: 'Excellent course! Very comprehensive and well-structured.',
            createdAt: new Date().toISOString()
          }
        ],
        status: 'active',
        createdAt: '2024-01-15T00:00:00.000Z',
        createdBy: userRefs[2].id
      },
      {
        title: 'Python for Data Science and Machine Learning',
        description: 'Learn NumPy, Pandas, Seaborn, Matplotlib, Plotly, Scikit-Learn, Machine Learning, Tensorflow and more!',
        category: 'Data Science',
        price: 94.99,
        instructor: 'Jose Portilla',
        duration: '25 hours',
        level: 'Intermediate',
        requirements: ['Basic Python knowledge', 'High school level math'],
        whatYouLearn: [
          'Use Python for Data Science and Machine Learning',
          'Use Spark for Big Data Analysis',
          'Implement Machine Learning Algorithms',
          'Learn to use NumPy for Numerical Data'
        ],
        enrollments: 523,
        rating: 4.6,
        reviews: [],
        status: 'active',
        createdAt: '2024-02-20T00:00:00.000Z',
        createdBy: userRefs[2].id
      },
      {
        title: 'React - The Complete Guide',
        description: 'Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!',
        category: 'Web Development',
        price: 89.99,
        instructor: 'Maximilian Schwarzmüller',
        duration: '48 hours',
        level: 'Intermediate',
        requirements: ['JavaScript fundamentals', 'ES6+ features knowledge'],
        whatYouLearn: [
          'Build powerful, fast, user-friendly and reactive web apps',
          'Provide amazing user experiences by leveraging the power of JavaScript',
          'Apply for high-paid jobs or work as a freelancer',
          'Learn all about React Hooks and React Components'
        ],
        enrollments: 1200,
        rating: 4.8,
        reviews: [],
        status: 'active',
        createdAt: '2024-01-10T00:00:00.000Z',
        createdBy: userRefs[2].id
      },
      {
        title: 'Digital Marketing Masterclass',
        description: 'Learn Digital Marketing: SEO, Social Media Marketing, Email Marketing, YouTube Marketing, Analytics & More!',
        category: 'Marketing',
        price: 79.99,
        instructor: 'Phil Ebiner',
        duration: '23 hours',
        level: 'Beginner',
        requirements: ['No prior experience needed', 'Computer with internet access'],
        whatYouLearn: [
          'Create a complete digital marketing strategy',
          'Master SEO and rank higher on Google',
          'Run successful social media campaigns',
          'Build email marketing funnels'
        ],
        enrollments: 340,
        rating: 4.5,
        reviews: [],
        status: 'active',
        createdAt: '2024-03-01T00:00:00.000Z',
        createdBy: userRefs[2].id
      }
    ];

    const courseRefs = [];
    for (const course of courses) {
      const courseRef = await db.collection('courses').add(course);
      courseRefs.push(courseRef);
      console.log(`Created course: ${course.title}`);
    }

    // Seed Sample Enrollment
    console.log('Seeding enrollments...');
    const enrollment = {
      userId: userRefs[1].id,
      courseId: courseRefs[0].id,
      enrolledAt: new Date().toISOString(),
      progress: 25,
      status: 'active',
      completedLessons: ['lesson1', 'lesson2', 'lesson3'],
      certificateIssued: false
    };

    await db.collection('enrollments').add(enrollment);
    console.log('Created sample enrollment');

    // Seed Sample Contact
    console.log('Seeding contacts...');
    const contact = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      subject: 'course-inquiry',
      message: 'I am interested in learning more about your web development courses. Could you provide more information?',
      status: 'new',
      submittedAt: new Date().toISOString(),
      respondedAt: null,
      response: null
    };

    await db.collection('contacts').add(contact);
    console.log('Created sample contact');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();