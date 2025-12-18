const { getDatabase } = require('../config/database');
const bcrypt = require('bcryptjs');

const initializeDatabase = async () => {
  try {
    console.log('🚀 Starting database initialization...');
    
    const db = getDatabase();
    
    // Sample data
    const sampleData = {
      users: [
        {
          id: 'admin-1',
          email: 'admin@oncode.com',
          password: await bcrypt.hash('admin123', 12),
          name: 'Admin User',
          role: 'admin',
          status: 'active',
          createdAt: new Date(),
          lastActive: new Date()
        },
        {
          id: 'student-1',
          email: 'student@oncode.com',
          password: await bcrypt.hash('student123', 12),
          name: 'John Doe',
          role: 'student',
          status: 'active',
          age: 25,
          phone: '+1-555-0123',
          address: '123 Main St',
          city: 'New York',
          country: 'USA',
          createdAt: new Date(),
          lastActive: new Date()
        },
        {
          id: 'instructor-1',
          email: 'instructor@oncode.com',
          password: await bcrypt.hash('instructor123', 12),
          name: 'Dr. Angela Yu',
          role: 'instructor',
          status: 'active',
          bio: 'Experienced web developer and instructor with 10+ years in the industry.',
          expertise: ['Web Development', 'JavaScript', 'React', 'Node.js'],
          createdAt: new Date(),
          lastActive: new Date()
        }
      ],
      
      courses: [
        {
          id: 'course-1',
          title: 'Complete Web Development Bootcamp',
          description: 'Learn HTML, CSS, JavaScript, Node.js, React, MongoDB and more! This comprehensive course will take you from beginner to advanced web developer.',
          category: 'Web Development',
          price: 84.99,
          instructor: 'Dr. Angela Yu',
          instructorId: 'instructor-1',
          duration: '65 hours',
          level: 'Beginner',
          requirements: [
            'Basic computer skills',
            'No programming experience required',
            'Willingness to learn'
          ],
          whatYouLearn: [
            'Build 16 web development projects',
            'Learn the latest technologies',
            'Build a portfolio of websites',
            'Learn professional developer best practices',
            'Master HTML5, CSS3, JavaScript ES6+',
            'Learn React.js and Node.js'
          ],
          curriculum: [
            {
              section: 'Introduction to Web Development',
              lessons: ['What is Web Development?', 'Setting up Development Environment', 'Your First Website']
            },
            {
              section: 'HTML Fundamentals',
              lessons: ['HTML Structure', 'HTML Elements', 'Forms and Input', 'Semantic HTML']
            },
            {
              section: 'CSS Styling',
              lessons: ['CSS Basics', 'Flexbox', 'Grid Layout', 'Responsive Design']
            }
          ],
          enrollments: 850,
          rating: 4.7,
          reviews: [],
          status: 'active',
          featured: true,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date()
        },
        {
          id: 'course-2',
          title: 'Python for Data Science and Machine Learning',
          description: 'Learn NumPy, Pandas, Seaborn, Matplotlib, Plotly, Scikit-Learn, Machine Learning, Tensorflow and more!',
          category: 'Data Science',
          price: 94.99,
          instructor: 'Dr. Angela Yu',
          instructorId: 'instructor-1',
          duration: '25 hours',
          level: 'Intermediate',
          requirements: [
            'Basic Python knowledge',
            'High school level math',
            'Understanding of basic statistics'
          ],
          whatYouLearn: [
            'Use Python for Data Science and Machine Learning',
            'Use Spark for Big Data Analysis',
            'Implement Machine Learning Algorithms',
            'Learn to use NumPy for Numerical Data',
            'Master Pandas for Data Analysis',
            'Create Data Visualizations'
          ],
          curriculum: [
            {
              section: 'Python Fundamentals Review',
              lessons: ['Python Basics', 'Data Structures', 'Functions and Modules']
            },
            {
              section: 'NumPy and Pandas',
              lessons: ['NumPy Arrays', 'Pandas DataFrames', 'Data Cleaning']
            }
          ],
          enrollments: 523,
          rating: 4.6,
          reviews: [],
          status: 'active',
          featured: true,
          createdAt: new Date('2024-02-20'),
          updatedAt: new Date()
        },
        {
          id: 'course-3',
          title: 'React - The Complete Guide',
          description: 'Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!',
          category: 'Web Development',
          price: 89.99,
          instructor: 'Dr. Angela Yu',
          instructorId: 'instructor-1',
          duration: '48 hours',
          level: 'Intermediate',
          requirements: [
            'JavaScript fundamentals',
            'ES6+ features knowledge',
            'Basic understanding of HTML/CSS'
          ],
          whatYouLearn: [
            'Build powerful, fast, user-friendly and reactive web apps',
            'Provide amazing user experiences by leveraging the power of JavaScript',
            'Apply for high-paid jobs or work as a freelancer',
            'Learn all about React Hooks and React Components',
            'Master Redux for state management',
            'Build and deploy React applications'
          ],
          curriculum: [
            {
              section: 'React Fundamentals',
              lessons: ['What is React?', 'Components', 'JSX', 'Props and State']
            },
            {
              section: 'Advanced React',
              lessons: ['Hooks', 'Context API', 'Redux', 'React Router']
            }
          ],
          enrollments: 1200,
          rating: 4.8,
          reviews: [],
          status: 'active',
          featured: false,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date()
        }
      ],
      
      enrollments: [
        {
          id: 'enrollment-1',
          userId: 'student-1',
          courseId: 'course-1',
          enrolledAt: new Date(),
          progress: 25,
          status: 'active',
          completedLessons: ['lesson1', 'lesson2', 'lesson3'],
          lastAccessedAt: new Date(),
          certificateIssued: false,
          paymentStatus: 'completed',
          paymentAmount: 84.99
        }
      ],
      
      certificates: [
        {
          id: 'cert-1',
          userId: 'student-1',
          courseId: 'course-1',
          code: 'OC-WD-2024-001',
          issuedAt: new Date(),
          studentName: 'John Doe',
          courseName: 'Complete Web Development Bootcamp',
          instructorName: 'Dr. Angela Yu',
          completionDate: new Date(),
          grade: 'A',
          status: 'active'
        }
      ],
      
      quizzes: [
        {
          id: 'quiz-1',
          courseId: 'course-1',
          title: 'HTML Fundamentals Quiz',
          description: 'Test your knowledge of HTML basics',
          questions: [
            {
              id: 'q1',
              question: 'What does HTML stand for?',
              type: 'multiple-choice',
              options: [
                'Hyper Text Markup Language',
                'High Tech Modern Language',
                'Home Tool Markup Language',
                'Hyperlink and Text Markup Language'
              ],
              correctAnswer: 0,
              points: 10
            },
            {
              id: 'q2',
              question: 'Which HTML element is used for the largest heading?',
              type: 'multiple-choice',
              options: ['<h6>', '<h1>', '<heading>', '<header>'],
              correctAnswer: 1,
              points: 10
            }
          ],
          totalPoints: 20,
          passingScore: 70,
          timeLimit: 30,
          attempts: 3,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      
      contacts: [
        {
          id: 'contact-1',
          name: 'Jane Smith',
          email: 'jane@example.com',
          subject: 'course-inquiry',
          message: 'I am interested in learning more about your web development courses. Could you provide more information about the curriculum and prerequisites?',
          status: 'new',
          priority: 'medium',
          submittedAt: new Date(),
          respondedAt: null,
          response: null,
          assignedTo: null
        }
      ],
      
      payments: [
        {
          id: 'payment-1',
          userId: 'student-1',
          courseId: 'course-1',
          amount: 84.99,
          currency: 'USD',
          status: 'completed',
          paymentMethod: 'card',
          transactionId: 'txn_1234567890',
          createdAt: new Date(),
          completedAt: new Date()
        }
      ]
    };
    
    // Initialize collections with sample data
    for (const [collectionName, documents] of Object.entries(sampleData)) {
      console.log(`📝 Initializing ${collectionName} collection...`);
      
      for (const doc of documents) {
        try {
          await db.collection(collectionName).doc(doc.id).set(doc);
          console.log(`  ✅ Created ${collectionName} document: ${doc.id}`);
        } catch (error) {
          console.log(`  ⚠️  Document ${doc.id} might already exist, skipping...`);
        }
      }
    }
    
    console.log('✅ Database initialization completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - Users: ${sampleData.users.length}`);
    console.log(`  - Courses: ${sampleData.courses.length}`);
    console.log(`  - Enrollments: ${sampleData.enrollments.length}`);
    console.log(`  - Certificates: ${sampleData.certificates.length}`);
    console.log(`  - Quizzes: ${sampleData.quizzes.length}`);
    console.log(`  - Contacts: ${sampleData.contacts.length}`);
    console.log(`  - Payments: ${sampleData.payments.length}`);
    
    console.log('\n🔐 Test Credentials:');
    console.log('  Admin: admin@oncode.com / admin123');
    console.log('  Student: student@oncode.com / student123');
    console.log('  Instructor: instructor@oncode.com / instructor123');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Initialization failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };