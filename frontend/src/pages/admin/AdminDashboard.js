import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    newUsersThisMonth: 0,
    newCoursesThisMonth: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const coursesSnap = await getDocs(collection(db, 'courses'));
        const enrollmentsSnap = await getDocs(collection(db, 'enrollments'));
        
        const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const courses = coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const enrollments = enrollmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const newUsersThisMonth = users.filter(user => {
          const userDate = user.createdAt?.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
          return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
        }).length;
        
        const newCoursesThisMonth = courses.filter(course => {
          const courseDate = course.createdAt?.toDate ? course.createdAt.toDate() : new Date(course.createdAt);
          return courseDate.getMonth() === currentMonth && courseDate.getFullYear() === currentYear;
        }).length;
        
        const totalRevenue = courses.reduce((total, course) => {
          return total + ((course.price || 0) * (course.enrollments || 0));
        }, 0);
        
        setStats({
          totalUsers: users.length,
          totalCourses: courses.length,
          totalEnrollments: enrollments.length,
          totalRevenue: totalRevenue,
          newUsersThisMonth: newUsersThisMonth,
          newCoursesThisMonth: newCoursesThisMonth
        });
        
        const notificationsSnap = await getDocs(
          query(collection(db, 'notifications'), orderBy('timestamp', 'desc'), limit(5))
        );
        setNotifications(notificationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'notifications', notificationId), { read: true });
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const recentActivities = [];

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="admin-dashboard-spinner"></div>
        <p className="admin-dashboard-loading-text">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-dashboard-header">
        <h1 className="admin-dashboard-title">Admin Dashboard</h1>
        <p className="admin-dashboard-subtitle">Welcome back, {currentUser?.name}</p>
      </div>

      <div className="admin-dashboard-stats">
        <div className="admin-dashboard-stat-card">
          <div className="admin-dashboard-stat-content">
            <div className="admin-dashboard-stat-icon users">
              <span>👥</span>
            </div>
            <div className="admin-dashboard-stat-details">
              <p className="admin-dashboard-stat-label">Total Users</p>
              <p className="admin-dashboard-stat-number">{stats.totalUsers.toLocaleString()}</p>
              <p className="admin-dashboard-stat-change">+{stats.newUsersThisMonth} this month</p>
            </div>
          </div>
        </div>

        <div className="admin-dashboard-stat-card">
          <div className="admin-dashboard-stat-content">
            <div className="admin-dashboard-stat-icon courses">
              <span>📚</span>
            </div>
            <div className="admin-dashboard-stat-details">
              <p className="admin-dashboard-stat-label">Total Courses</p>
              <p className="admin-dashboard-stat-number">{stats.totalCourses}</p>
              <p className="admin-dashboard-stat-change">+{stats.newCoursesThisMonth} this month</p>
            </div>
          </div>
        </div>

        <div className="admin-dashboard-stat-card">
          <div className="admin-dashboard-stat-content">
            <div className="admin-dashboard-stat-icon enrollments">
              <span>🎓</span>
            </div>
            <div className="admin-dashboard-stat-details">
              <p className="admin-dashboard-stat-label">Total Enrollments</p>
              <p className="admin-dashboard-stat-number">{stats.totalEnrollments.toLocaleString()}</p>
              <p className="admin-dashboard-stat-change">+15% from last month</p>
            </div>
          </div>
        </div>

        <div className="admin-dashboard-stat-card">
          <div className="admin-dashboard-stat-content">
            <div className="admin-dashboard-stat-icon revenue">
              <span>💰</span>
            </div>
            <div className="admin-dashboard-stat-details">
              <p className="admin-dashboard-stat-label">Total Revenue</p>
              <p className="admin-dashboard-stat-number">${stats.totalRevenue.toLocaleString()}</p>
              <p className="admin-dashboard-stat-change">+8% from last month</p>
            </div>
          </div>
        </div>
      </div>

      {notifications.length > 0 && (
        <div style={{background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
          <h2 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1e293b'}}>Recent Notifications</h2>
          <div style={{space: '0.75rem'}}>
            {notifications.map(notification => (
              <div key={notification.id} style={{
                padding: '0.75rem',
                borderRadius: '8px',
                background: notification.read ? '#f8fafc' : '#eff6ff',
                border: `1px solid ${notification.read ? '#e2e8f0' : '#bfdbfe'}`,
                marginBottom: '0.5rem',
                cursor: 'pointer'
              }} onClick={() => markAsRead(notification.id)}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                  <div>
                    <p style={{fontWeight: '500', color: '#1e293b', marginBottom: '0.25rem'}}>{notification.title}</p>
                    <p style={{color: '#64748b', fontSize: '0.875rem'}}>{notification.message}</p>
                  </div>
                  <span style={{fontSize: '0.75rem', color: '#94a3b8'}}>
                    {new Date(notification.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="admin-dashboard-activity">
        <h2 className="admin-dashboard-activity-title">Quick Actions</h2>
        <div className="admin-dashboard-activity-grid">
          <Link to="/admin/courses" className="admin-dashboard-activity-item">
            <div className="admin-dashboard-activity-content">
              <div className="admin-dashboard-activity-icon">
                <span>📚</span>
              </div>
              <div className="admin-dashboard-activity-text">
                <p className="admin-dashboard-activity-message">Manage Courses</p>
                <p className="admin-dashboard-activity-time">Add, edit, or remove courses</p>
              </div>
            </div>
          </Link>
          <Link to="/admin/users" className="admin-dashboard-activity-item">
            <div className="admin-dashboard-activity-content">
              <div className="admin-dashboard-activity-icon">
                <span>👥</span>
              </div>
              <div className="admin-dashboard-activity-text">
                <p className="admin-dashboard-activity-message">Manage Users</p>
                <p className="admin-dashboard-activity-time">View and manage all users</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;