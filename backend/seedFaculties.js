const { getDatabase } = require('./config/database');

const db = getDatabase();

const seedFaculties = async () => {
  try {
    console.log('Seeding faculties...');

    const faculties = [
      {
        slug: 'business',
        name: 'School of Business',
        icon: '💼',
        description: 'Comprehensive business programs preparing future leaders and entrepreneurs.',
        programs: ['MBA', 'Business Administration', 'Marketing', 'Finance', 'Management'],
        color: '#2563eb',
        createdAt: new Date().toISOString()
      },
      {
        slug: 'computing',
        name: 'School of Computing',
        icon: '💻',
        description: 'Cutting-edge technology and software development programs.',
        programs: ['Computer Science', 'Software Engineering', 'Data Science', 'Cybersecurity', 'AI & ML'],
        color: '#059669',
        createdAt: new Date().toISOString()
      },
      {
        slug: 'engineering',
        name: 'School of Engineering',
        icon: '⚙️',
        description: "Engineering excellence for tomorrow's innovators and problem solvers.",
        programs: ['Civil Engineering', 'Mechanical Engineering', 'Chemical Engineering'],
        color: '#dc2626',
        createdAt: new Date().toISOString()
      },
      {
        slug: 'language',
        name: 'School of Language',
        icon: '🗣️',
        description: 'Master global languages and enhance communication skills.',
        programs: ['English Literature', 'Linguistics', 'Translation Studies', 'Foreign Languages', 'Communication'],
        color: '#7c3aed',
        createdAt: new Date().toISOString()
      },
      {
        slug: 'design',
        name: 'School of Design',
        icon: '🎨',
        description: 'Creative design solutions and artistic expression programs.',
        programs: ['Graphic Design', 'UX/UI Design', 'Interior Design', 'Fashion Design', 'Digital Arts'],
        color: '#ea580c',
        createdAt: new Date().toISOString()
      },
      {
        slug: 'humanities',
        name: 'School of Humanities',
        icon: '📚',
        description: 'Explore human culture, society, and social sciences.',
        programs: ['Psychology', 'Sociology', 'History', 'Philosophy', 'Political Science'],
        color: '#0891b2',
        createdAt: new Date().toISOString()
      },
      {
        slug: 'analytics',
        name: 'Business Analytics Center',
        icon: '📊',
        description: 'Advanced analytics and data-driven business intelligence programs.',
        programs: ['Business Intelligence', 'Data Analytics', 'Market Research', 'Statistical Analysis'],
        color: '#be185d',
        createdAt: new Date().toISOString()
      },
      {
        slug: 'productivity',
        name: 'Productivity & Quality Center',
        icon: '🎯',
        description: 'Excellence in productivity management and quality assurance.',
        programs: ['Quality Management', 'Process Improvement', 'Lean Six Sigma'],
        color: '#16a34a',
        createdAt: new Date().toISOString()
      }
    ];

    // Clear existing faculties
    const snapshot = await db.collection('faculties').get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log('Cleared existing faculties');

    // Add new faculties
    for (const faculty of faculties) {
      await db.collection('faculties').add(faculty);
      console.log(`Created faculty: ${faculty.name}`);
    }

    console.log('Faculties seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding faculties:', error);
    process.exit(1);
  }
};

seedFaculties();
