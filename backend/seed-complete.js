const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const seedCompleteData = async () => {
    try {
        console.log('🌱 Starting to seed Firebase with complete data...\n');

        // Sample Users
        const users = [
            {
                id: 'admin-001',
                name: 'Admin User',
                email: 'admin@oncode.com',
                password: await bcrypt.hash('admin123', 10),
                role: 'admin',
                status: 'active',
                loginStatus: 'active',
                createdAt: new Date(),
                lastUpdated: new Date()
            },
            {
                id: 'instructor-001',
                name: 'Dr. Angela Yu',
                email: 'angela@oncode.com',
                password: await bcrypt.hash('instructor123', 10),
                role: 'instructor',
                status: 'active',
                loginStatus: 'active',
                bio: 'Full-stack developer and instructor with 10+ years experience',
                createdAt: new Date(),
                lastUpdated: new Date()
            },
            {
                id: 'instructor-002',
                name: 'Jose Portilla',
                email: 'jose@oncode.com',
                password: await bcrypt.hash('instructor123', 10),
                role: 'instructor',
                status: 'active',
                loginStatus: 'active',
                bio: 'Data Science expert and Python specialist',
                createdAt: new Date(),
                lastUpdated: new Date()
            },
            {
                id: 'student-001',
                name: 'John Doe',
                email: 'student@oncode.com',
                password: await bcrypt.hash('student123', 10),
                role: 'student',
                status: 'active',
                loginStatus: 'active',
                studentId: 'ST2024001',
                age: 22,
                phone: '+1234567890',
                city: 'New York',
                country: 'USA',
                programme: 'Web Development',
                faculty: 'Computer Science',
                batch: '2024',
                enrollmentDate: new Date('2024-01-15'),
                currentYear: '1',
                createdAt: new Date(),
                lastUpdated: new Date()
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
                category: 'Web Development',
                level: 'beginner',
                duration: '65 hours',
                enrollments: 850234,
                rating: 4.7,
                status: 'active',
                thumbnail: 'https://via.placeholder.com/400x250/4CAF50/FFFFFF?text=Web+Development',
                courseContent: ['HTML Fundamentals', 'CSS Styling', 'JavaScript Basics', 'React Framework', 'Node.js Backend'],
                createdAt: new Date()
            },
            {
                id: 'course-002',
                title: 'Python for Data Science and Machine Learning',
                description: 'Learn NumPy, Pandas, Seaborn, Matplotlib, Plotly, Scikit-Learn, Machine Learning, Tensorflow and more!',
                instructor: 'Jose Portilla',
                instructorId: 'instructor-002',
                price: 94.99,
                category: 'Data Science',
                level: 'intermediate',
                duration: '25 hours',
                enrollments: 523145,
                rating: 4.6,
                status: 'active',
                thumbnail: 'https://via.placeholder.com/400x250/2196F3/FFFFFF?text=Data+Science',
                courseContent: ['Python Basics', 'NumPy', 'Pandas', 'Machine Learning', 'Deep Learning'],
                createdAt: new Date()
            },
            {
                id: 'course-003',
                title: 'React - The Complete Guide',
                description: 'Learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!',
                instructor: 'Dr. Angela Yu',
                instructorId: 'instructor-001',
                price: 89.99,
                category: 'Web Development',
                level: 'intermediate',
                duration: '49 hours',
                enrollments: 612890,
                rating: 4.8,
                status: 'active',
                thumbnail: 'https://via.placeholder.com/400x250/FF9800/FFFFFF?text=React',
                courseContent: ['React Basics', 'Components', 'Hooks', 'Redux', 'Next.js'],
                createdAt: new Date()
            },
            {
                id: 'course-004',
                title: 'Node.js Complete Backend Development',
                description: 'Master backend development with Node.js, Express, MongoDB, REST APIs, authentication and more',
                instructor: 'Jose Portilla',
                instructorId: 'instructor-002',
                price: 79.99,
                category: 'Backend Development',
                level: 'intermediate',
                duration: '35 hours',
                enrollments: 345678,
                rating: 4.5,
                status: 'active',
                thumbnail: 'https://via.placeholder.com/400x250/009688/FFFFFF?text=Node.js',
                courseContent: ['Node.js Basics', 'Express Framework', 'MongoDB', 'REST APIs', 'Authentication'],
                createdAt: new Date()
            }
        ];

        // Sample Modules
        const modules = [
            {
                id: 'module-001',
                courseId: 'course-001',
                title: 'Introduction to Web Development',
                description: 'Learn the basics of web development and understand how the web works',
                content: 'In this module, you will learn about HTML, CSS, and JavaScript fundamentals...',
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                duration: '15 minutes',
                order: 1,
                instructorId: 'instructor-001',
                createdAt: new Date()
            },
            {
                id: 'module-002',
                courseId: 'course-001',
                title: 'HTML Fundamentals',
                description: 'Deep dive into HTML5 and semantic markup',
                content: 'HTML is the foundation of web development. You will learn all essential HTML tags...',
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                duration: '2 hours',
                order: 2,
                instructorId: 'instructor-001',
                createdAt: new Date()
            },
            {
                id: 'module-003',
                courseId: 'course-002',
                title: 'Python Crash Course',
                description: 'Quick introduction to Python programming',
                content: 'Learn Python syntax, variables, data types, and control structures...',
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                duration: '2 hours',
                order: 1,
                instructorId: 'instructor-002',
                createdAt: new Date()
            }
        ];

        // Sample Enrollments
        const enrollments = [
            {
                id: 'enrollment-001',
                userId: 'student-001',
                courseId: 'course-001',
                status: 'active',
                progress: 75,
                enrolledAt: new Date('2024-01-20'),
                paymentAmount: 84.99,
                paymentMethod: 'card'
            },
            {
                id: 'enrollment-002',
                userId: 'student-001',
                courseId: 'course-002',
                status: 'active',
                progress: 30,
                enrolledAt: new Date('2024-02-01'),
                paymentAmount: 94.99,
                paymentMethod: 'card'
            }
        ];

        // Sample Quizzes
        const quizzes = [
            {
                id: 'quiz-001',
                courseId: 'course-001',
                title: 'HTML Basics Quiz',
                description: 'Test your HTML knowledge',
                timeLimit: 30,
                questions: [
                    {
                        question: 'What does HTML stand for?',
                        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
                        correctAnswer: 0,
                        type: 'mcq'
                    },
                    {
                        question: 'Which HTML tag is used for the largest heading?',
                        options: ['<h6>', '<heading>', '<h1>', '<head>'],
                        correctAnswer: 2,
                        type: 'mcq'
                    }
                ],
                createdAt: new Date()
            },
            {
                id: 'quiz-002',
                courseId: 'course-002',
                title: 'Python Fundamentals Quiz',
                description: 'Test your Python basics',
                timeLimit: 20,
                questions: [
                    {
                        question: 'Which of the following is used to define a function in Python?',
                        options: ['function', 'def', 'func', 'define'],
                        correctAnswer: 1,
                        type: 'mcq'
                    },
                    {
                        question: 'Python is case-sensitive',
                        options: ['True', 'False'],
                        correctAnswer: 0,
                        type: 'true_false'
                    }
                ],
                createdAt: new Date()
            }
        ];

        // Sample Quiz Results
        const quizResults = [
            {
                id: 'result-001',
                userId: 'student-001',
                courseId: 'course-001',
                quizId: 'quiz-001',
                score: 85,
                totalQuestions: 2,
                correctAnswers: 2,
                timeSpent: 15,
                completedAt: new Date('2024-01-25')
            }
        ];

        // Sample Certificates
        const certificates = [
            {
                id: 'cert-001',
                studentId: 'student-001',
                courseId: 'course-001',
                studentName: 'John Doe',
                courseName: 'Complete Web Development Bootcamp 2024',
                instructor: 'Dr. Angela Yu',
                certificateId: 'CERT-2024-001-WD',
                issuedAt: new Date('2024-03-01'),
                verificationUrl: 'https://oncode.com/verify/CERT-2024-001-WD'
            }
        ];

        // Sample News
        const news = [
            {
                id: 'news-001',
                title: 'OnCode Launches New AI Course',
                content: 'We are excited to announce our new Artificial Intelligence and Machine Learning course, starting next month!',
                category: 'academic',
                date: new Date('2024-11-20'),
                image: 'https://via.placeholder.com/600x400/673AB7/FFFFFF?text=AI+Course',
                author: 'Admin Team',
                status: 'published'
            },
            {
                id: 'news-002',
                title: 'Partnership with Tech Giants',
                content: 'OnCode has partnered with major tech companies to provide internship opportunities for top students.',
                category: 'partnership',
                date: new Date('2024-11-15'),
                image: 'https://via.placeholder.com/600x400/3F51B5/FFFFFF?text=Partnership',
                author: 'Admin Team',
                status: 'published'
            }
        ];

        // Sample Events
        const events = [
            {
                id: 'event-001',
                title: 'Career Fair 2024',
                description: 'Meet top recruiters from leading tech companies. Bring your resume!',
                date: new Date('2024-12-15'),
                time: '10:00 AM - 4:00 PM',
                location: 'Main Auditorium',
                type: 'career',
                status: 'upcoming',
                registrationLimit: 500,
                registeredCount: 234
            },
            {
                id: 'event-002',
                title: 'React Workshop',
                description: 'Hands-on workshop on building modern web applications with React',
                date: new Date('2024-12-01'),
                time: '2:00 PM - 5:00 PM',
                location: 'Computer Lab 3',
                type: 'workshop',
                status: 'upcoming',
                registrationLimit: 50,
                registeredCount: 42
            }
        ];

        // Sample Assignments
        const assignments = [
            {
                id: 'assignment-001',
                courseId: 'course-001',
                title: 'Build a Personal Portfolio Website',
                description: 'Create a responsive portfolio website using HTML, CSS, and JavaScript',
                dueDate: new Date('2024-12-10'),
                maxScore: 100,
                instructorId: 'instructor-001',
                createdAt: new Date()
            }
        ];

        // Sample Assignment Submissions
        const assignmentSubmissions = [
            {
                id: 'submission-001',
                assignmentId: 'assignment-001',
                studentId: 'student-001',
                studentName: 'John Doe',
                content: 'I have completed my portfolio website. The link is: https://johndoe-portfolio.com',
                fileUrl: 'https://storage.example.com/submissions/johndoe-portfolio.zip',
                submittedAt: new Date('2024-12-05'),
                grade: 95,
                feedback: 'Excellent work! Great design and clean code.',
                graded: true
            }
        ];

        // Add all data to Firestore
        console.log('👥 Adding users...');
        for (const user of users) {
            await db.collection('users').doc(user.id).set(user);
            console.log(`✅ Added user: ${user.name} (${user.role})`);
        }

        console.log('\n📚 Adding courses...');
        for (const course of courses) {
            await db.collection('courses').doc(course.id).set(course);
            console.log(`✅ Added course: ${course.title}`);
        }

        console.log('\n📖 Adding modules...');
        for (const module of modules) {
            await db.collection('modules').doc(module.id).set(module);
            console.log(`✅ Added module: ${module.title}`);
        }

        console.log('\n📝 Adding enrollments...');
        for (const enrollment of enrollments) {
            await db.collection('enrollments').doc(enrollment.id).set(enrollment);
            console.log(`✅ Added enrollment: ${enrollment.id}`);
        }

        console.log('\n❓ Adding quizzes...');
        for (const quiz of quizzes) {
            await db.collection('quizzes').doc(quiz.id).set(quiz);
            console.log(`✅ Added quiz: ${quiz.title}`);
        }

        console.log('\n📊 Adding quiz results...');
        for (const result of quizResults) {
            await db.collection('quizResults').doc(result.id).set(result);
            console.log(`✅ Added quiz result: ${result.id}`);
        }

        console.log('\n🎓 Adding certificates...');
        for (const certificate of certificates) {
            await db.collection('certificates').doc(certificate.id).set(certificate);
            console.log(`✅ Added certificate: ${certificate.certificateId}`);
        }

        console.log('\n📰 Adding news...');
        for (const newsItem of news) {
            await db.collection('news').doc(newsItem.id).set(newsItem);
            console.log(`✅ Added news: ${newsItem.title}`);
        }

        console.log('\n🎪 Adding events...');
        for (const event of events) {
            await db.collection('events').doc(event.id).set(event);
            console.log(`✅ Added event: ${event.title}`);
        }

        console.log('\n📋 Adding assignments...');
        for (const assignment of assignments) {
            await db.collection('assignments').doc(assignment.id).set(assignment);
            console.log(`✅ Added assignment: ${assignment.title}`);
        }

        console.log('\n✍️ Adding assignment submissions...');
        for (const submission of assignmentSubmissions) {
            await db.collection('assignmentSubmissions').doc(submission.id).set(submission);
            console.log(`✅ Added submission: ${submission.id}`);
        }

        console.log('\n🎉 \x1b[32mFirebase seeding completed successfully!\x1b[0m\n');
        console.log('📊 Summary:');
        console.log(`   - ${users.length} users`);
        console.log(`   - ${courses.length} courses`);
        console.log(`   - ${modules.length} modules`);
        console.log(`   - ${enrollments.length} enrollments`);
        console.log(`   - ${quizzes.length} quizzes`);
        console.log(`   - ${quizResults.length} quiz results`);
        console.log(`   - ${certificates.length} certificates`);
        console.log(`   - ${news.length} news items`);
        console.log(`   - ${events.length} events`);
        console.log(`   - ${assignments.length} assignments`);
        console.log(`   - ${assignmentSubmissions.length} assignment submissions`);
        console.log('\n✅ You can now view this data in your Firestore console!');
        console.log('🔗 https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore\n');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error seeding Firebase:', error);
        process.exit(1);
    }
};

seedCompleteData();
