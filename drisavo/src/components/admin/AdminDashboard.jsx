import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import DashboardHome from './DashboardHome';
import ServicesManager from './ServicesManager';
import InquiriesManager from './InquiriesManager';
import ContentManager from './ContentManager';
import { useTranslation } from 'react-i18next';  // استيراد useTranslation

const AdminDashboard = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { i18n } = useTranslation();            // استيراد i18n

  useEffect(() => {
    if (i18n.language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = i18n.language;
    }
  }, [i18n.language]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="admin-main">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="inquiries" element={<InquiriesManager />} />
            <Route path="content" element={<ContentManager />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
