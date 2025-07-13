import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, LogOut, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminHeader = ({ onMenuClick }) => {
  const { logout } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <button onClick={onMenuClick} className="menu-button">
          <Menu size={24} />
        </button>

        <div className="admin-user">
          <div className="user-info">
            <User size={20} />
            <span>{t('adminHeader.adminUser')}</span>
          </div>
          <button onClick={logout} className="logout-button">
            <LogOut size={20} />
            <span>{t('adminHeader.logout')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
