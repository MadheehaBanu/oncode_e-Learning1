import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';


import Navbar from './components/Navbar';
import StudentSidebar from './components/StudentSidebar';
import InstructorSidebar from './components/InstructorSidebar';
import TestCourses from './pages/TestCourses';
import StudentEnrollment from './pages/StudentEnrollment';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

import CourseDetail from './pages/CourseDetail';
import About from './pages/About';
import Contact from './pages/Contact';

import Faculties from './pages/Faculties';
import Campuses from './pages/Campuses';
import FacultyDetail from './pages/faculties/FacultyDetail';
import VerifyCertificate from './pages/VerifyCertificate';
import MyResults from './pages/MyResults';
import MyEnrollments from './pages/MyEnrollments';
import Profile from './pages/Profile';


import Programmes from './pages/Programmes';

import ForgotPassword from './pages/ForgotPassword';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CreateCourse from './pages/instructor/CreateCourse';
import ManageQuizzes from './pages/instructor/ManageQuizzes';
import Assignments from './pages/instructor/Assignments';
import AddModule from './pages/instructor/AddModule';
import Checkout from './pages/Checkout';
import NewsEvents from './pages/NewsEvents';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCourses from './pages/admin/ManageCourses';
import ManageContent from './pages/admin/ManageContent';
import ManageUsers from './pages/admin/ManageUsers';
import AdminLayout from './components/AdminLayout';
import ManageCertificates from './pages/admin/ManageCertificates';
import CreateStudent from './pages/admin/CreateStudent';
import AdminSettings from './pages/admin/AdminSettings';
import FixAdmin from './pages/FixAdmin';
// added import
import Footer from './components/Footer';
import './App.css';
import './styles/PageLayout.css';
import Inquire from "./pages/inquire";




const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();
  console.log("AdminRoute Check:", {
    exists: !!currentUser,
    role: currentUser?.role,
    email: currentUser?.email
  });

  if (!currentUser) return <Navigate to="/login" />;

  if (currentUser.role !== 'admin') {
    console.warn("AdminRoute: Access denied for role:", currentUser.role);
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const DashboardRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (currentUser?.role === 'admin') {
    return <Navigate to="/admin" />;
  }
  if (currentUser?.role === 'instructor') {
    return <Navigate to="/instructor/dashboard" />;
  }
  if (currentUser?.role === 'student') {
    return <Navigate to="/student/dashboard" />;
  }
  return currentUser ? children : <Navigate to="/login" />;
};

const StudentRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser?.role === 'student' ? children : <Navigate to="/login" />;
};

const InstructorRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser?.role === 'instructor' ? children : <Navigate to="/dashboard" />;
};

const ConditionalNavbar = () => {
  const location = useLocation();
  const hideNavbar = ['/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/admin');
  return hideNavbar ? null : <Navbar />;
};

const ConditionalSidebar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const hideSidebar = ['/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/admin');

  if (!currentUser || hideSidebar || currentUser.role === 'admin') {
    return null;
  }

  if (currentUser.role === 'instructor') {
    return <InstructorSidebar />;
  }

  if (currentUser.role === 'student') {
    return <StudentSidebar />;
  }

  return null;
};

const ConditionalFooter = () => {
  const location = useLocation();
  const hideFooter = ['/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/admin');
  return hideFooter ? null : <Footer />;
};

const MainContent = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const hideSidebar = ['/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/admin');
  const showSidebar = currentUser && !hideSidebar && ['student', 'instructor'].includes(currentUser.role);

  return (
    <div className={showSidebar ? 'main-content-with-sidebar' : ''}>
      {children}
    </div>
  );
};

const AppContent = () => {
  const { currentUser } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <ConditionalNavbar />
        <ConditionalSidebar />
        <MainContent>
          <Routes>
            <Route path="/test-courses" element={<TestCourses />} />
            <Route path="/enroll" element={<StudentEnrollment />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/inquire" element={<Inquire />} />

            <Route path="/faculties" element={<Faculties />} />
            <Route path="/campuses" element={<Campuses />} />
            <Route path="/faculties/:slug" element={<FacultyDetail />} />
            <Route path="/programmes" element={<Programmes />} />
            <Route path="/verify-certificate" element={<VerifyCertificate />} />
            <Route path="/news-events" element={<NewsEvents />} />
            <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/forgot-password" element={!currentUser ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/dashboard" element={<DashboardRoute><div /></DashboardRoute>} />
            <Route path="/student/dashboard" element={
              <StudentRoute>
                <Dashboard />
              </StudentRoute>
            } />
            <Route path="/student/enrollments" element={
              <StudentRoute>
                <MyEnrollments />
              </StudentRoute>
            } />
            <Route path="/student/results" element={
              <StudentRoute>
                <MyResults />
              </StudentRoute>
            } />
            <Route path="/student/profile" element={
              <StudentRoute>
                <Profile />
              </StudentRoute>
            } />
            <Route path="/my-enrollments" element={<Navigate to="/student/enrollments" />} />
            <Route path="/my-results" element={<Navigate to="/student/results" />} />
            <Route path="/profile" element={<Navigate to="/student/profile" />} />
            <Route path="/payment/:courseId" element={
              <ProtectedRoute>

              </ProtectedRoute>
            } />
            <Route path="/payment-success" element={
              <ProtectedRoute>

              </ProtectedRoute>
            } />
            <Route path="/quiz/:courseId/:quizId" element={
              <ProtectedRoute>

              </ProtectedRoute>
            } />
            <Route path="/checkout/:courseId" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/instructor/dashboard" element={
              <InstructorRoute>
                <InstructorDashboard />
              </InstructorRoute>
            } />
            <Route path="/instructor/create-course" element={
              <InstructorRoute>
                <CreateCourse />
              </InstructorRoute>
            } />

            <Route path="/instructor/assignments" element={
              <InstructorRoute>
                <Assignments />
              </InstructorRoute>
            } />
            <Route path="/instructor/add-module" element={
              <InstructorRoute>
                <AddModule />
              </InstructorRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/courses" element={
              <AdminRoute>
                <AdminLayout>
                  <ManageCourses />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <AdminLayout>
                  <ManageUsers />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <AdminLayout>
                  <ManageUsers />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/certificates" element={
              <AdminRoute>
                <AdminLayout>
                  <ManageCertificates />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/create-student" element={
              <AdminRoute>
                <AdminLayout>
                  <CreateStudent />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/gallery" element={
              <AdminRoute>
                <AdminLayout>

                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/settings" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminSettings />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/fix-admin" element={<FixAdmin />} />
          </Routes>
        </MainContent>
        <ConditionalFooter />
      </div>
    </Router>
  );
};

const App = () => {
  useEffect(() => {

  }, []);

  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
};

export default App;