import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, FileText, MessageSquare, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    { path: '/admin', icon: Home, label: t('adminSidebar.dashboard') }, // لأن Route index تساوي /admin
    { path: '/admin/services', icon: Settings, label: t('adminSidebar.services') },
    { path: '/admin/inquiries', icon: MessageSquare, label: t('adminSidebar.inquiries') },
    { path: '/admin/content', icon: FileText, label: t('adminSidebar.content') },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname === path;
  };

  return (
    <>
      {isOpen && (
        <div 
          className="modal-overlay"
          onClick={onClose}
          style={{ display: 'block' }}
        />
      )}
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">{t('adminSidebar.title')}</h1>
          <button onClick={onClose} className="sidebar-close">
            <X size={24} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
