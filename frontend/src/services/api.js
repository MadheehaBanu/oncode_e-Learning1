import axios from 'axios';

// Determine API URL based on environment
const getApiBaseUrl = () => {
  // Production: Use environment variable
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_URL || 'https://your-backend-url.vercel.app/api';
  }
  // Development: Use localhost
  return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for session management
  timeout: 10000, // 10 second timeout
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  validate: () => api.get('/auth/validate'),
  refresh: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

// Courses API
export const coursesAPI = {
  getAllCourses: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/courses${queryString ? `?${queryString}` : ''}`);
  },
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  searchCourses: (query) => api.get(`/courses?search=${encodeURIComponent(query)}`),
  getCategoryStats: () => api.get('/courses/categories/stats'),
  addReview: (courseId, reviewData) => api.post(`/courses/${courseId}/reviews`, reviewData),
};

// Payments API
export const paymentsAPI = {
  createPaymentIntent: (courseId, amount) => 
    api.post('/payments/create-payment-intent', { courseId, amount }),
  confirmPayment: (paymentIntentId, courseId) => 
    api.post('/payments/confirm-payment', { paymentIntentId, courseId }),
  getPaymentHistory: () => api.get('/payments/history'),
  processPayment: (paymentData) => api.post('/payments/process', paymentData),
  getPaymentMethods: () => api.get('/payments/methods'),
};

// Users API
export const usersAPI = {
  getAllUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/users${queryString ? `?${queryString}` : ''}`);
  },
  getUser: (userId) => api.get(`/users/${userId}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (userId, updates) => api.put(`/users/${userId}`, updates),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
};

// Enrollments API
export const enrollmentsAPI = {
  getUserEnrollments: (userId) => api.get(`/enrollments/user/${userId}`),
  getMyEnrollments: () => api.get('/enrollments/my'),
  getAllEnrollments: () => api.get('/enrollments'),
  enroll: (courseId) => api.post('/enrollments', { courseId }),
  unenroll: (enrollmentId) => api.delete(`/enrollments/${enrollmentId}`),
  updateProgress: (enrollmentId, progress) => 
    api.put(`/enrollments/${enrollmentId}/progress`, { progress }),
  getEnrollmentStats: () => api.get('/enrollments/stats'),
};

// Contact API
export const contactAPI = {
  submitContact: (contactData) => api.post('/contact', contactData),
  getAllContacts: () => api.get('/contact'),
  updateContactStatus: (contactId, status) => 
    api.put(`/contact/${contactId}/status`, { status }),
  respondToContact: (contactId, response) => 
    api.put(`/contact/${contactId}/respond`, { response }),
};

// Certificates API
export const certificatesAPI = {
  verifyCertificate: (code) => api.get(`/certificates/verify/${code}`),
  getUserCertificates: () => api.get('/certificates/my'),
  generateCertificate: (enrollmentId) => api.post(`/certificates/generate`, { enrollmentId }),
  getAllCertificates: () => api.get('/certificates'),
};

// Quizzes API
export const quizzesAPI = {
  getCourseQuizzes: (courseId) => api.get(`/quizzes/course/${courseId}`),
  getQuiz: (quizId) => api.get(`/quizzes/${quizId}`),
  submitQuiz: (quizId, answers) => api.post(`/quizzes/${quizId}/submit`, { answers }),
  createQuiz: (quizData) => api.post('/quizzes', quizData),
  updateQuiz: (quizId, quizData) => api.put(`/quizzes/${quizId}`, quizData),
  deleteQuiz: (quizId) => api.delete(`/quizzes/${quizId}`),
};

// Home/Dashboard API
export const homeAPI = {
  getDashboardStats: () => api.get('/home/stats'),
  getFeaturedCourses: () => api.get('/home/featured'),
  getRecentActivity: () => api.get('/home/activity'),
};

// Programmes API
export const programmesAPI = {
  getAllProgrammes: () => api.get('/programmes'),
  getProgramme: (id) => api.get(`/programmes/${id}`),
  createProgramme: (programmeData) => api.post('/programmes', programmeData),
  updateProgramme: (id, programmeData) => api.put(`/programmes/${id}`, programmeData),
  deleteProgramme: (id) => api.delete(`/programmes/${id}`),
};

// Enrollment Application API
export const enrollmentApplicationAPI = {
  submitApplication: (applicationData) => api.post('/enrollment', applicationData),
  getApplications: () => api.get('/enrollment'),
  updateApplicationStatus: (applicationId, status) => 
    api.put(`/enrollment/${applicationId}/status`, { status }),
};

// Utility functions
export const apiUtils = {
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      return error.response.data?.error || error.response.data?.message || 'Server error occurred';
    } else if (error.request) {
      // Request was made but no response received
      return 'Network error - please check your connection';
    } else {
      // Something else happened
      return error.message || 'An unexpected error occurred';
    }
  },
  
  isNetworkError: (error) => {
    return !error.response && error.request;
  },
  
  isAuthError: (error) => {
    return error.response?.status === 401;
  },
  
  isValidationError: (error) => {
    return error.response?.status === 400 && error.response.data?.errors;
  }
};

export default api;