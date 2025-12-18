const admin = require('firebase-admin');

let db;

const initializeDatabase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      const serviceAccount = require('../serviceAccountKey.json');
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
      });
      
      console.log('✅ Firebase Admin initialized successfully');
    }
    
    db = admin.firestore();
    
    // Configure Firestore settings
    db.settings({
      ignoreUndefinedProperties: true
    });
    
    return db;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    console.log('🔄 Falling back to mock database for development');
    
    // Return mock database for development
    return createMockDatabase();
  }
};

const createMockDatabase = () => {
  const mockData = {
    users: [
      {
        id: 'admin-1',
        email: 'admin@oncode.com',
        password: '$2a$12$yyUAzDkaMa7YZwVCwb/sMeaCZQhvb1yclju4YNeDIfDrJ3z/F9Zq6',
        name: 'Admin User',
        role: 'admin',
        status: 'active',
        createdAt: new Date('2024-01-01'),
        lastActive: new Date()
      },
      {
        id: 'student-1',
        email: 'student@oncode.com',
        password: '$2a$12$0P7CiZbHelA6EyqlbRCZauQdi4yt54H/bBkLxzpLe1h6wdD5dYMR.',
        name: 'John Doe',
        role: 'student',
        status: 'active',
        age: 25,
        phone: '+1-555-0123',
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        createdAt: new Date('2024-01-01'),
        lastActive: new Date()
      },
      {
        id: 'instructor-1',
        email: 'instructor@oncode.com',
        password: '$2a$12$xb6K3FRplO4pgE634jge/e./qbihBtxasB5rnCCL92zKQ/sy1jHNe',
        name: 'Dr. Angela Yu',
        role: 'instructor',
        status: 'active',
        createdAt: new Date('2024-01-01'),
        lastActive: new Date()
      }
    ],
    courses: [
      {
        id: '1',
        title: 'Complete Web Development Bootcamp',
        description: 'Learn HTML, CSS, JavaScript, Node.js, React, MongoDB and more!',
        category: 'Web Development',
        price: 84.99,
        instructor: 'Dr. Angela Yu',
        instructorId: 'instructor-1',
        duration: '65 hours',
        level: 'Beginner',
        enrollments: 850,
        rating: 4.7,
        status: 'active',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'Python for Data Science and Machine Learning',
        description: 'Learn NumPy, Pandas, Seaborn, Matplotlib, Plotly, Scikit-Learn, Machine Learning, Tensorflow and more!',
        category: 'Data Science',
        price: 94.99,
        instructor: 'Jose Portilla',
        instructorId: 'instructor-1',
        duration: '25 hours',
        level: 'Intermediate',
        enrollments: 523,
        rating: 4.6,
        status: 'active',
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date()
      }
    ],
    enrollments: [],
    contacts: [],
    certificates: [],
    quizzes: [],
    payments: []
  };

  return {
    collection: (name) => ({
      get: () => Promise.resolve({
        forEach: (callback) => {
          (mockData[name] || []).forEach((doc) => {
            callback({
              id: doc.id,
              data: () => doc,
              exists: true
            });
          });
        },
        docs: (mockData[name] || []).map(doc => ({
          id: doc.id,
          data: () => doc,
          exists: true
        }))
      }),
      
      where: (field, operator, value) => ({
        get: () => Promise.resolve({
          forEach: (callback) => {
            const filtered = (mockData[name] || []).filter(doc => {
              switch (operator) {
                case '==': return doc[field] === value;
                case '!=': return doc[field] !== value;
                case '>': return doc[field] > value;
                case '>=': return doc[field] >= value;
                case '<': return doc[field] < value;
                case '<=': return doc[field] <= value;
                case 'array-contains': return Array.isArray(doc[field]) && doc[field].includes(value);
                default: return false;
              }
            });
            filtered.forEach(doc => {
              callback({
                id: doc.id,
                data: () => doc,
                exists: true
              });
            });
          },
          docs: (mockData[name] || []).filter(doc => {
            switch (operator) {
              case '==': return doc[field] === value;
              case '!=': return doc[field] !== value;
              case '>': return doc[field] > value;
              case '>=': return doc[field] >= value;
              case '<': return doc[field] < value;
              case '<=': return doc[field] <= value;
              case 'array-contains': return Array.isArray(doc[field]) && doc[field].includes(value);
              default: return false;
            }
          }).map(doc => ({
            id: doc.id,
            data: () => doc,
            exists: true
          }))
        })
      }),
      
      doc: (id) => ({
        get: () => {
          const doc = (mockData[name] || []).find(d => d.id === id);
          return Promise.resolve({
            exists: !!doc,
            id: id,
            data: () => doc || {}
          });
        },
        
        set: (data) => {
          if (!mockData[name]) mockData[name] = [];
          const existingIndex = mockData[name].findIndex(d => d.id === id);
          const newDoc = { ...data, id, updatedAt: new Date() };
          
          if (existingIndex !== -1) {
            mockData[name][existingIndex] = newDoc;
          } else {
            mockData[name].push(newDoc);
          }
          return Promise.resolve();
        },
        
        update: (data) => {
          if (!mockData[name]) mockData[name] = [];
          const docIndex = mockData[name].findIndex(d => d.id === id);
          if (docIndex !== -1) {
            mockData[name][docIndex] = { 
              ...mockData[name][docIndex], 
              ...data, 
              updatedAt: new Date() 
            };
          }
          return Promise.resolve();
        },
        
        delete: () => {
          if (!mockData[name]) return Promise.resolve();
          const docIndex = mockData[name].findIndex(d => d.id === id);
          if (docIndex !== -1) {
            mockData[name].splice(docIndex, 1);
          }
          return Promise.resolve();
        }
      }),
      
      add: (data) => {
        if (!mockData[name]) mockData[name] = [];
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newDoc = { 
          ...data, 
          id, 
          createdAt: new Date(), 
          updatedAt: new Date() 
        };
        mockData[name].push(newDoc);
        return Promise.resolve({ id });
      },
      
      orderBy: (field, direction = 'asc') => ({
        get: () => Promise.resolve({
          forEach: (callback) => {
            const sorted = [...(mockData[name] || [])].sort((a, b) => {
              if (direction === 'desc') {
                return b[field] > a[field] ? 1 : -1;
              }
              return a[field] > b[field] ? 1 : -1;
            });
            sorted.forEach(doc => {
              callback({
                id: doc.id,
                data: () => doc,
                exists: true
              });
            });
          }
        })
      }),
      
      limit: (count) => ({
        get: () => Promise.resolve({
          forEach: (callback) => {
            (mockData[name] || []).slice(0, count).forEach(doc => {
              callback({
                id: doc.id,
                data: () => doc,
                exists: true
              });
            });
          }
        })
      })
    })
  };
};

const getDatabase = () => {
  if (!db) {
    db = initializeDatabase();
  }
  return db;
};

module.exports = {
  initializeDatabase,
  getDatabase,
  admin
};