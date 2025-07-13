import React, { useState } from 'react';
import { Menu, X, Phone, Mail, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div>
            <img src="/Logo4.png" alt="Drisavo Logo" className="logo" />
          </div>

          <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
            <button onClick={() => scrollToSection('hero')} className="nav-button">
              {t('home')}
            </button>
            <button onClick={() => scrollToSection('services')} className="nav-button">
              {t('services')}
            </button>
            <button onClick={() => scrollToSection('about')} className="nav-button">
              {t('about')}
            </button>
            <button onClick={() => scrollToSection('contact')} className="nav-button">
              {t('contact')}
            </button>

            {isAuthenticated && isAdmin() ? (
              <>
                <Link to="/admin" className="nav-button">
                  {t('dashboard')}
                </Link>
                <button onClick={logout} className="nav-button">
                  {t('logout')}
                </button>
              </>
            ) : (
              <Link to="/admin/login" className="nav-button">
                {t('adminLogin')}
              </Link>
            )}
          </nav>

          <div className="header-contact">
            <div className="contact-item">
              <Phone size={16} />
              <span>0981459712</span>
            </div>
            <div className="contact-item">
              <Mail size={16} />
              <span>lelasalasad0@gmail.com</span>
            </div>
            {/* أيقونة اللغة */}
            <div className="contact-item">
              <Globe size={20} />
              <select
                onChange={(e) => changeLanguage(e.target.value)}
                defaultValue={i18n.language}
                style={{ border: 'none', background: 'transparent', color: 'inherit', cursor: 'pointer' }}
              >
                <option value="en">EN</option>
                <option value="ar">AR</option>
                <option value="fr">FR</option>
              </select>
            </div>
          </div>

          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
