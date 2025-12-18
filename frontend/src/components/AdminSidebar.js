import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/courses', label: 'Manage Courses' },
    { path: '/admin/users', label: 'Manage Users' },
    { path: '/admin/certificates', label: 'Certificates' },
    { path: '/admin/programme', label: 'Manage Programme' },
    { path: '/admin/settings', label: 'Settings' }
  ];

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2 className="admin-sidebar-title">Admin Panel</h2>
      </div>
      <nav className="admin-sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`admin-sidebar-link ${location.pathname === item.path ? 'active' : ''
              }`}
          >

            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;