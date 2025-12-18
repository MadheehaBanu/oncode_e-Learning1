const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const seedContent = async () => {
    try {
        console.log('🌱 Starting to seed Site Content...');

        // 1. Banners
        const banners = [
            { id: '1', title: 'Shape Your Future with OnCode', subtitle: 'Discover world-class education and innovative programs', buttonText: 'Explore Programmes', image: '/download.jpeg', order: 1 },
            { id: '2', title: 'Excellence in Education', subtitle: 'Join thousands of successful graduates worldwide', buttonText: 'Explore Programmes', image: '/download (1).jpeg', order: 2 },
            { id: '3', title: 'Innovation & Technology', subtitle: 'Leading the way in modern education solutions', buttonText: 'Explore Programmes', image: '/download.jpeg', order: 3 }
        ];

        // 2. Faculties
        const faculties = [
            { id: '1', name: 'Business', description: 'Comprehensive business programs for future leaders', icon: '💼', image: '/course/bus.jpeg', order: 1 },
            { id: '2', name: 'Computing', description: 'Cutting-edge technology and software development', icon: '💻', image: '/course/com.jpeg', order: 2 },
            { id: '3', name: 'Engineering', description: "Engineering excellence for tomorrow's innovators", icon: '⚙️', image: '/course/eng.jpeg', order: 3 },
            { id: '4', name: 'Design', description: 'Creative design solutions and artistic expression', icon: '🎨', image: '/course/desin.jpeg', order: 4 },
            { id: '5', name: 'Language', description: 'Master global languages and communication', icon: '🗣️', image: '/course/lan.jpeg', order: 5 },
            { id: '6', name: 'Humanities', description: 'Explore human culture and social sciences', icon: '📚', image: '/course/hum.jpeg', order: 6 }
        ];

        // 3. News
        const news = [
            { id: '1', title: 'New Partnership Announced', content: 'We are thrilled to announce a new strategic partnership with leading tech giants.', category: 'partnership', date: new Date().toISOString(), image: '/news/partnership.jpg', status: 'published' },
            { id: '2', title: 'Student Achievements 2024', content: 'Our students have once again topped the national rankings.', category: 'achievement', date: new Date().toISOString(), image: '/news/awards.jpg', status: 'published' }
        ];

        // 4. Events
        const events = [
            { id: '1', title: 'Open Day 2025', description: 'Visit our campus and meet the faculty.', date: '2025-01-15', time: '09:00 AM', location: 'Main Campus', type: 'marketing', status: 'upcoming' },
            { id: '2', title: 'Tech Symposium', description: 'Annual technology meet for enthusiasts.', date: '2025-02-20', time: '10:00 AM', location: 'Auditorium', type: 'workshop', status: 'upcoming' }
        ];

        // 5. Foreign Affiliations
        const foreignAffiliations = [
            { id: '1', name: 'University of Cambridge', country: 'United Kingdom', logo: '/logo192.png', website: 'https://cam.ac.uk' },
            { id: '2', name: 'MIT', country: 'United States', logo: '/logo192.png', website: 'https://mit.edu' },
            { id: '3', name: 'University of Melbourne', country: 'Australia', logo: '/logo192.png', website: 'https://unimelb.edu.au' },
            { id: '4', name: 'NUS Singapore', country: 'Singapore', logo: '/logo192.png', website: 'https://nus.edu.sg' }
        ];

        // 6. Professional Affiliations
        const professionalAffiliations = [
            { id: '1', name: 'CIMA', description: 'Chartered Institute of Management Accountants', logo: '/logo192.png' },
            { id: '2', name: 'BCS', description: 'The Chartered Institute for IT', logo: '/logo192.png' }
        ];

        // 7. About Page
        const aboutPage = {
            title: 'About OnCode Institute',
            description: 'OnCode Institute is a premier higher education provider dedicated to excellence.',
            mission: 'To empower students with knowledge and skills for the future.',
            vision: 'To be the global leader in innovative education.',
            history: 'Founded in 2020, we have grown to serve students globally.'
        };

        // 8. Contact Info
        const contactInfo = {
            address: '123 Education Lane, Tech City, TC 45678',
            phone: '+94 11 234 5678',
            email: 'info@oncode.edu.lk',
            mapUrl: 'https://maps.google.com/?q=6.9271,79.8612'
        };

        // 9. Statistics
        const statistics = {
            leftStats: [
                { title: '50+', description: 'Active Courses', icon: '📚' },
                { title: '1000+', description: 'Students Enrolled', icon: '👥' }
            ],
            rightStats: [
                { title: '20+', description: 'Expert Instructors', icon: '👨‍🏫' },
                { title: '100%', description: 'Satisfaction Rate', icon: '⭐' }
            ]
        };

        // --- Execution ---

        // Banners
        console.log('🖼️ 1. Seeding Banners...');
        for (const item of banners) await db.collection('banners').doc(item.id).set(item);

        // Faculties
        console.log('🏫 2. Seeding Faculties...');
        for (const item of faculties) await db.collection('faculties').doc(item.id).set(item);

        // News
        console.log('📰 3. Seeding News...');
        for (const item of news) await db.collection('news').doc(item.id).set(item);

        // Events
        console.log('📅 4. Seeding Events...');
        for (const item of events) await db.collection('events').doc(item.id).set(item);

        // Foreign Affiliations
        console.log('🌍 5. Seeding Foreign Affiliations...');
        for (const item of foreignAffiliations) await db.collection('foreign_affiliations').doc(item.id).set(item);

        // Professional Affiliations
        console.log('🤝 6. Seeding Professional Affiliations...');
        for (const item of professionalAffiliations) await db.collection('professional_affiliations').doc(item.id).set(item);

        // About Page (Single Document in 'content' collection)
        console.log('ℹ️ 7. Seeding About Page...');
        await db.collection('content').doc('about').set(aboutPage);

        // Contact Info (Single Document in 'content' collection)
        console.log('📞 8. Seeding Contact Info...');
        await db.collection('content').doc('contact').set(contactInfo);

        // Statistics (Single Document in 'settings' collection)
        console.log('📊 9. Seeding Statistics...');
        await db.collection('settings').doc('statistics').set(statistics);

        console.log('🎉 All content seeded successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding content:', error);
        process.exit(1);
    }
};

seedContent();
