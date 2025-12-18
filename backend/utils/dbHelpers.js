const { getDatabase } = require('../config/database');

class DatabaseHelpers {
  constructor() {
    this.db = getDatabase();
  }

  // Generic CRUD operations
  async create(collection, data) {
    try {
      const docRef = await this.db.collection(collection).add({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...data, createdAt: new Date().toISOString() };
    } catch (error) {
      throw new Error(`Error creating document in ${collection}: ${error.message}`);
    }
  }

  async findById(collection, id) {
    try {
      const doc = await this.db.collection(collection).doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Error finding document in ${collection}: ${error.message}`);
    }
  }

  async findOne(collection, field, value) {
    try {
      const snapshot = await this.db.collection(collection).where(field, '==', value).get();
      if (snapshot.empty) {
        return null;
      }
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Error finding document in ${collection}: ${error.message}`);
    }
  }

  async findAll(collection, filters = {}) {
    try {
      let query = this.db.collection(collection);
      
      // Apply filters
      Object.entries(filters).forEach(([field, value]) => {
        if (value !== undefined && value !== null) {
          query = query.where(field, '==', value);
        }
      });

      const snapshot = await query.get();
      const results = [];
      
      snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });
      
      return results;
    } catch (error) {
      throw new Error(`Error finding documents in ${collection}: ${error.message}`);
    }
  }

  async update(collection, id, data) {
    try {
      await this.db.collection(collection).doc(id).update({
        ...data,
        updatedAt: new Date()
      });
      return await this.findById(collection, id);
    } catch (error) {
      throw new Error(`Error updating document in ${collection}: ${error.message}`);
    }
  }

  async delete(collection, id) {
    try {
      await this.db.collection(collection).doc(id).delete();
      return true;
    } catch (error) {
      throw new Error(`Error deleting document in ${collection}: ${error.message}`);
    }
  }

  async search(collection, searchField, searchTerm) {
    try {
      const snapshot = await this.db.collection(collection).get();
      const results = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data[searchField] && data[searchField].toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({ id: doc.id, ...data });
        }
      });
      
      return results;
    } catch (error) {
      throw new Error(`Error searching documents in ${collection}: ${error.message}`);
    }
  }

  async paginate(collection, page = 1, limit = 10, orderBy = 'createdAt', orderDirection = 'desc') {
    try {
      const offset = (page - 1) * limit;
      
      const snapshot = await this.db.collection(collection)
        .orderBy(orderBy, orderDirection)
        .limit(limit)
        .offset(offset)
        .get();
      
      const results = [];
      snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });
      
      // Get total count
      const totalSnapshot = await this.db.collection(collection).get();
      const total = totalSnapshot.size;
      
      return {
        data: results,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Error paginating documents in ${collection}: ${error.message}`);
    }
  }

  // User-specific operations
  async createUser(userData) {
    try {
      const docRef = await this.db.collection('users').add({
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...userData };
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async findUserByEmail(email) {
    return await this.findOne('users', 'email', email);
  }

  async findUserById(id) {
    return await this.findById('users', id);
  }

  async updateUser(id, userData) {
    return await this.update('users', id, userData);
  }

  // Course-specific operations
  async createCourse(courseData) {
    return await this.create('courses', courseData);
  }

  async findCourseById(id) {
    return await this.findById('courses', id);
  }

  async findCoursesByCategory(category) {
    return await this.findAll('courses', { category, status: 'active' });
  }

  async searchCourses(searchTerm) {
    return await this.search('courses', 'title', searchTerm);
  }

  // Enrollment-specific operations
  async createEnrollment(enrollmentData) {
    return await this.create('enrollments', enrollmentData);
  }

  async findEnrollmentsByUser(userId) {
    return await this.findAll('enrollments', { userId });
  }

  async findEnrollmentsByCourse(courseId) {
    return await this.findAll('enrollments', { courseId });
  }

  async findEnrollment(userId, courseId) {
    try {
      const snapshot = await this.db.collection('enrollments')
        .where('userId', '==', userId)
        .where('courseId', '==', courseId)
        .get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Error finding enrollment: ${error.message}`);
    }
  }

  // Contact-specific operations
  async createContact(contactData) {
    return await this.create('contacts', contactData);
  }

  async findAllContacts() {
    return await this.findAll('contacts');
  }

  // Certificate-specific operations
  async createCertificate(certificateData) {
    return await this.create('certificates', certificateData);
  }

  async findCertificateByCode(code) {
    return await this.findOne('certificates', 'code', code);
  }

  async findCertificatesByUser(userId) {
    return await this.findAll('certificates', { userId });
  }

  // Quiz-specific operations
  async createQuiz(quizData) {
    return await this.create('quizzes', quizData);
  }

  async findQuizzesByCourse(courseId) {
    return await this.findAll('quizzes', { courseId });
  }

  // Payment-specific operations
  async createPayment(paymentData) {
    return await this.create('payments', paymentData);
  }

  async findPaymentsByUser(userId) {
    return await this.findAll('payments', { userId });
  }

  async findPaymentById(id) {
    return await this.findById('payments', id);
  }
}

module.exports = new DatabaseHelpers();