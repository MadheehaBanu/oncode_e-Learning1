import React, { createContext, useContext, useState, useEffect } from 'react';
import { coursesAPI, usersAPI, enrollmentsAPI } from '../services/api';
import { useFirestore } from '../hooks/useFirestore';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { data: courses, loading: coursesLoading } = useFirestore('courses');
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Course operations
  const fetchCourses = async () => {
    // No-op for real-time data, or just return current courses
    return { courses };
  };

  const addCourse = async (courseData) => {
    try {
      const response = await coursesAPI.createCourse(courseData);
      const newCourse = response.course;
      // No need to manually update state with real-time subscription
      return newCourse;
    } catch (error) {
      console.error('Error adding course:', error);
      throw error;
    }
  };

  const updateCourse = async (courseId, updates) => {
    try {
      await coursesAPI.updateCourse(courseId, updates);
      // No need to manually update state
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      await coursesAPI.deleteCourse(courseId);
      // No need to manually update state
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  };

  // User operations
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAllUsers();
      setUsers(Array.isArray(response) ? response : []);
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (userData) => {
    try {
      const response = await usersAPI.createUser(userData);
      const newUser = response.user;
      setUsers(prev => [...prev, newUser]);
      // Refresh users to ensure consistency
      await fetchUsers();
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const updateUser = async (userId, updates) => {
    try {
      await usersAPI.updateUser(userId, updates);
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, ...updates } : user
      ));
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const deleteUser = async (userId) => {
    try {
      await usersAPI.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  // Enrollment operations
  const fetchMyEnrollments = async () => {
    try {
      const response = await enrollmentsAPI.getMyEnrollments();
      setEnrollments(response);
      return response;
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      throw error;
    }
  };

  const enrollInCourse = async (courseId) => {
    try {
      const response = await enrollmentsAPI.enroll(courseId);
      setEnrollments(prev => [...prev, response.enrollment]);
      return response;
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  };

  const updateEnrollmentProgress = async (enrollmentId, progressData) => {
    try {
      await enrollmentsAPI.updateProgress(enrollmentId, progressData);
      setEnrollments(prev => prev.map(enrollment =>
        enrollment.id === enrollmentId ? { ...enrollment, ...progressData } : enrollment
      ));
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  };

  const unenrollFromCourse = async (enrollmentId) => {
    try {
      await enrollmentsAPI.unenroll(enrollmentId);
      setEnrollments(prev => prev.filter(enrollment => enrollment.id !== enrollmentId));
    } catch (error) {
      console.error('Error unenrolling:', error);
      throw error;
    }
  };

  const value = {
    courses: courses || [],
    users,
    enrollments,
    loading: loading || coursesLoading,

    // Course methods
    fetchCourses,
    addCourse,
    updateCourse,
    deleteCourse,

    // User methods
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,

    // Enrollment methods
    fetchMyEnrollments,
    enrollInCourse,
    updateEnrollmentProgress,
    unenrollFromCourse
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};