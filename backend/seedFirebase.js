const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const seedData = async () => {
  try {
    console.log('🌱 Starting to seed Firebase...');

    // Sample Users
    const users = [
      {
        id: 'admin-001',
        name: 'Admin User',
        email: 'admin@oncode.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        createdAt: new Date(),
        isActive: true
      },
      {
        id: 'instructor-001',
        name: 'Dr. Angela Yu',
        email: 'angela@oncode.com',
        password: await bcrypt.hash('instructor123', 10),
        role: 'instructor',
        bio: 'Full-stack developer and instructor with 10+ years experience',
        createdAt: new Date(),
        isActive: true
      },
      {
        id: 'instructor-002',
        name: 'Jose Portilla',
        email: 'jose@oncode.com',
        password: await bcrypt.hash('instructor123', 10),
        role: 'instructor',
        bio: 'Data Science expert and Python specialist',
        createdAt: new Date(),
        isActive: true
      },
      {
        id: 'student-001',
        name: 'John Doe',
        email: 'student@oncode.com',
        password: await bcrypt.hash('student123', 10),
        role: 'student',
        createdAt: new Date(),
        isActive: true
      }
    ];

    // Sample Courses
    const courses = [
      {
        id: 'course-001',
        title: 'Complete Web Development Bootcamp 2024',
        description: 'Master web development with HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real projects and become a full-stack developer.',
        instructor: 'Dr. Angela Yu',
        instructorId: 'instructor-001',
        price: 84.99,
        originalPrice: 199.99,
        level: 'beginner',
        category: 'Web Development',
        rating: 4.7,
        studentsCount: 850234,
        duration: '65 hours',
        thumbnail: '🌐',
        lessons: [
          { title: 'Introduction to Web Development', duration: '15 min', videoUrl: 'https://example.com/video1' },
          { title: 'HTML Fundamentals', duration: '2 hours', videoUrl: 'https://example.com/video2' },
          { title: 'CSS Styling & Flexbox', duration: '3 hours', videoUrl: 'https://example.com/video3' },
          { title: 'JavaScript Basics & DOM', duration: '4 hours', videoUrl: 'https://example.com/video4' },
          { title: 'React.js Framework', duration: '6 hours', videoUrl: 'https://example.com/video5' },
          { title: 'Node.js & Express', duration: '5 hours', videoUrl: 'https://example.com/video6' },
          { title: 'MongoDB Database', duration: '3 hours', videoUrl: 'https://example.com/video7' },
          { title: 'Full-Stack Project', duration: '8 hours', videoUrl: 'https://example.com/video8' }
        ],
        requirements: [
          'No programming experience needed - we start from scratch',
          'A computer with internet access (Windows, Mac, or Linux)',
          'No paid software required - all tools are free',
          'Willingness to learn and practice coding'
        ],
        whatYouWillLearn: [
          'Build 16+ real-world web development projects for your portfolio',
          'Master HTML5, CSS3, JavaScript ES6+, React, Node.js, and MongoDB',
          'Create responsive websites that work on all devices',
          'Deploy your applications to the web using modern hosting platforms',
          'Work as a freelance web developer or get hired at a tech company',
          'Understand modern development workflows and best practices'
        ],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'course-002',
        title: 'Python for Data Science and Machine Learning',
        description: 'Learn NumPy, Pandas, Seaborn, Matplotlib, Plotly, Scikit-Learn, Machine Learning, Tensorflow and more!',
        instructor: 'Jose Portilla',
        instructorId: 'instructor-002',
        price: 94.99,
        originalPrice: 179.99,
        level: 'intermediate',
        category: 'Data Science',
        rating: 4.6,
        studentsCount: 523145,
        duration: '25 hours',
        thumbnail: '🐍',
        lessons: [
          { title: 'Python Crash Course', duration: '2 hours', videoUrl: 'https://example.com/python1' },
          { title: 'NumPy Arrays', duration: '1.5 hours', videoUrl: 'https://example.com/python2' },
          { title: 'Pandas DataFrames', duration: '3 hours', videoUrl: 'https://example.com/python3' },
          { title: 'Data Visualization', duration: '2.5 hours', videoUrl: 'https://example.com/python4' },
          { title: 'Machine Learning Basics', duration: '4 hours', videoUrl: 'https://example.com/python5' },
          { title: 'Deep Learning with TensorFlow', duration: '6 hours', videoUrl: 'https://example.com/python6' }
        ],
        requirements: [
          'Basic Python knowledge helpful but not required',
          'High school level math',
          'Computer with internet connection'
        ],
        whatYouWillLearn: [
          'Use Python for Data Science and Machine Learning',
          'Use Spark for Big Data Analysis',
          'Implement Machine Learning Algorithms',
          'Learn to use NumPy for Numerical Data',
          'Learn to use Pandas for Data Analysis',
          'Use Matplotlib and Seaborn for Data Visualizations'
        ],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'course-003',
        title: 'React - The Complete Guide',
        description: 'Learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!',
        instructor: 'Dr. Angela Yu',
        instructorId: 'instructor-001',
        price: 89.99,
        originalPrice: 149.99,
        level: 'intermediate',
        category: 'Web Development',
        rating: 4.8,
        studentsCount: 612890,
        duration: '49 hours',
        thumbnail: '⚛️',
        lessons: [
          { title: 'Getting Started', duration: '1 hour', videoUrl: 'https://example.com/react1' },
          { title: 'JavaScript Refresher', duration: '2 hours', videoUrl: 'https://example.com/react2' },
          { title: 'React Basics & Working With Components', duration: '4 hours', videoUrl: 'https://example.com/react3' },
          { title: 'React State & Working with Events', duration: '3 hours', videoUrl: 'https://example.com/react4' },
          { title: 'Rendering Lists & Conditional Content', duration: '2 hours', videoUrl: 'https://example.com/react5' },
          { title: 'React Hooks', duration: '5 hours', videoUrl: 'https://example.com/react6' },
          { title: 'Redux', duration: '6 hours', videoUrl: 'https://example.com/react7' },
          { title: 'Next.js', duration: '8 hours', videoUrl: 'https://example.com/react8' }
        ],
        requirements: [
          'JavaScript knowledge is required',
          'ES6+ JavaScript knowledge is recommended',
          'Basic HTML & CSS knowledge'
        ],
        whatYouWillLearn: [
          'Build powerful, fast, user-friendly and reactive web apps',
          'Provide amazing user experiences by leveraging the power of JavaScript',
          'Apply for high-paid jobs or work as a freelancer',
          'Learn all about React Hooks and React Components'
        ],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Add users to Firebase
    console.log('👥 Adding users...');
    for (const user of users) {
      await db.collection('users').doc(user.id).set(user);
      console.log(`✅ Added user: ${user.name}`);
    }

    // Add courses to Firebase
    console.log('📚 Adding courses...');
    for (const course of courses) {
      await db.collection('courses').doc(course.id).set(course);
      console.log(`✅ Added course: ${course.title}`);
    }

    // Add sample enrollments
    const enrollments = [
      {
        id: 'enrollment-001',
        userId: 'student-001',
        courseId: 'course-001',
        enrollmentDate: new Date(),
        progress: 75,
        status: 'active',
        paymentStatus: 'completed',
        paymentId: 'pi_test_123456789'
      },
      {
        id: 'enrollment-002',
        userId: 'student-001',
        courseId: 'course-002',
        enrollmentDate: new Date(),
        progress: 30,
        status: 'active',
        paymentStatus: 'completed',
        paymentId: 'pi_test_987654321'
      }
    ];

    console.log('📝 Adding enrollments...');
    for (const enrollment of enrollments) {
      await db.collection('enrollments').doc(enrollment.id).set(enrollment);
      console.log(`✅ Added enrollment: ${enrollment.id}`);
    }

    console.log('🎉 Firebase seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding Firebase:', error);
    process.exit(1);
  }
};

seedData();