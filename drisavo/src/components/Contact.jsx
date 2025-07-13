import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { inquiryService } from '../services/inquiryService';
import { serviceService } from '../services/serviceService';
import { contentService } from '../services/contentService';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_id: '',
    message: ''
  });
  const [services, setServices] = useState([]);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [servicesData, contentData] = await Promise.all([
        serviceService.getServices(),
        contentService.getPublicContent()
      ]);
      setServices(servicesData);
      setContent(contentData);
    } catch (error) {
      console.error(t('contactsec.loadError'), error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await inquiryService.submitInquiry(formData);
      if (result.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', service_id: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(result.message || t('contactsec.sendError'));
      }
    } catch (error) {
      setError(error.message || t('contactsec.sendError'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <div className="section-header">
          <h2 className="section-title">{t('contactsec.title')}</h2>
          <p className="section-subtitle">
            {t('contactsec.subtitle')}
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h3>{t('contactsec.infoTitle')}</h3>

            <div className="contact-item">
              <div className="contact-icon">
                <Phone size={24} color="#1e40af" />
              </div>
              <div className="contact-details">
                <h4>{t('contactsec.phone')}</h4>
                <p>{content['contact-phone']?.content || '+1 (555) 123-4567'}</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <Mail size={24} color="#1e40af" />
              </div>
              <div className="contact-details">
                <h4>{t('contactsec.email')}</h4>
                <p>{content['contact-email']?.content || 'info@drisavo.com'}</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <MapPin size={24} color="#1e40af" />
              </div>
              <div className="contact-details">
                <h4>{t('contactsec.address')}</h4>
                <p>{content['contact-address']?.content || '123 Business District, City, State 12345'}</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <Clock size={24} color="#1e40af" />
              </div>
              <div className="contact-details">
                <h4>{t('contactsec.hours')}</h4>
                <p>{t('contactsec.24_7')}</p>
              </div>
            </div>

            <div className="emergency-card">
              <h4>{t('contactsec.emergency')}</h4>
              <p>{t('contactsec.emergencyDesc')}</p>
              <p className="emergency-number">
                {content['emergency-phone']?.content || '+1 (555) 911-HELP'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <h3>{t('contactsec.formTitle')}</h3>

            {success && (
              <div style={{
                background: '#d1fae5',
                border: '1px solid #a7f3d0',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#065f46'
              }}>
                <CheckCircle size={20} />
                <span>{t('contactsec.success')}</span>
              </div>
            )}

            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '1rem',
                color: '#dc2626'
              }}>
                {error}
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">{t('contactsec.name')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">{t('contactsec.email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="phone">{t('contactsec.phone')}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="service_id">{t('contactsec.service')}</label>
                <select
                  id="service_id"
                  name="service_id"
                  value={formData.service_id}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">{t('contactsec.chooseService')}</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">{t('contactsec.message')}</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t('contactsec.messagePlaceholder')}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              <Send size={20} />
              <span>{loading ? t('contactsec.sending') : t('contactsec.send')}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
