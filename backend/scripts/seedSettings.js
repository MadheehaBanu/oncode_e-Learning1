const { db } = require('../config/database');

async function seedSettings() {
  try {
    console.log('Seeding settings data...');

    // About page settings
    await db.collection('settings').doc('about').set({
      mission: 'At OnCode, we believe that quality programming education should be accessible to everyone. Our platform connects learners with expert instructors to provide comprehensive courses that prepare students for real-world challenges in the tech industry.',
      studentsCount: '50K+',
      coursesCount: '500+',
      instructorsCount: '100+',
      successRate: '95%'
    });
    console.log('✓ About settings created');

    // Contact page settings
    await db.collection('settings').doc('contact').set({
      email: 'support@oncode.com',
      phone: '+1 (555) 123-4567',
      address: '123 Tech Street\nSan Francisco, CA 94105'
    });
    console.log('✓ Contact settings created');

    // Statistics settings
    await db.collection('settings').doc('statistics').set({
      leftStats: [
        {
          icon: '🕒',
          title: '57 Years',
          description: 'Of excellence in the Higher Education Industry.'
        },
        {
          icon: '🤝',
          title: '100 Professional Partnerships',
          description: 'With the highly competitive industries across the globe.'
        },
        {
          icon: '🎓',
          title: '300 Qualified',
          description: 'Lecture Panel.'
        }
      ],
      rightStats: [
        {
          icon: '🌍',
          title: '5 Foreign Partnerships',
          description: 'With top ranked universities in the world.'
        },
        {
          icon: '🏢',
          title: '8 Campuses',
          description: 'Located across the country for easy access to quality education.'
        },
        {
          icon: '👨🎓',
          title: '25,000 Student',
          description: 'Population.'
        }
      ]
    });
    console.log('✓ Statistics settings created');

    // Professional Affiliations
    const professionalAffiliations = [
      { id: '1', title: 'ISO Certified', logo: '/prof/1.png', order: 1 },
      { id: '2', title: 'Partner Org', logo: '/prof/2.png', order: 2 },
      { id: '3', title: 'Accredited', logo: '/prof/3.png', order: 3 }
    ];

    for (const aff of professionalAffiliations) {
      await db.collection('professionalAffiliations').doc(aff.id).set(aff);
    }
    console.log('✓ Professional affiliations created');

    // Foreign Affiliations
    const foreignAffiliations = [
      { id: '1', name: 'Oxford University', country: 'UK', logo: '/images/2.jpeg', order: 1 },
      { id: '2', name: 'Harvard University', country: 'USA', logo: '/images/12.png', order: 2 },
      { id: '3', name: 'MIT', country: 'USA', logo: '/images/23.png', order: 3 }
    ];

    for (const aff of foreignAffiliations) {
      await db.collection('foreignAffiliations').doc(aff.id).set(aff);
    }
    console.log('✓ Foreign affiliations created');

    // Programmes
    const programmes = [
      { id: '1', title: "Masters", category: "Masters", duration: "2 years", order: 1 },
      { id: '2', title: "Degree", category: "Degree", duration: "4 years", order: 2 },
      { id: '3', title: "HND", category: "HND", duration: "3 years", order: 3 },
      { id: '4', title: "Diploma", category: "Diploma", duration: "2 years", order: 4 },
      { id: '5', title: "Advanced Certificate", category: "Certificate", duration: "1 year", order: 5 },
      { id: '6', title: "Certificate", category: "Certificate", duration: "6 months", order: 6 },
      { id: '7', title: "Foundation", category: "Foundation", duration: "1 year", order: 7 },
      { id: '8', title: "Workshops", category: "Workshop", duration: "Varies", order: 8 }
    ];

    for (const prog of programmes) {
      await db.collection('programmes').doc(prog.id).set(prog);
    }
    console.log('✓ Programmes created');

    console.log('\n✅ All settings seeded successfully!');
  } catch (error) {
    console.error('Error seeding settings:', error);
  }
}

if (require.main === module) {
  seedSettings().then(() => process.exit(0));
}

module.exports = seedSettings;
