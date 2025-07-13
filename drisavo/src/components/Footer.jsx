import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Drisavo</h3>
            <p>{t('footer.description')}</p>
            <div className="social-links">
              <Facebook size={24} />
              <Twitter size={24} />
              <Instagram size={24} />
              <Linkedin size={24} />
            </div>
          </div>

          <div className="footer-section">
            <h4>{t('footer.services')}</h4>
            <ul className="footer-links">
              <li><a href="#">{t('footer.personalDriver')}</a></li>
              <li><a href="#">{t('footer.commercialTransport')}</a></li>
              <li><a href="#">{t('footer.groupTransportation')}</a></li>
              <li><a href="#">{t('footer.corporateServices')}</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{t('footer.quickLinks')}</h4>
            <ul className="footer-links">
              <li><a href="#">{t('footer.aboutUs')}</a></li>
              <li><a href="#">{t('footer.ourTeam')}</a></li>
              <li><a href="#">{t('footer.careers')}</a></li>
              <li><a href="#">{t('footer.privacyPolicy')}</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{t('footer.contactInfo')}</h4>
            <div className="contact-item">
              <Phone size={16} />
              <span>{t('footer.phone')}</span>
            </div>
            <div className="contact-item">
              <Mail size={16} />
              <span>{t('footer.email')}</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>{t('footer.address')}</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Drisavo. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
