import React, { useState, useEffect } from 'react';
import { Car, Truck, Users, Building, Clock, Shield } from 'lucide-react';
import { serviceService } from '../services/serviceService';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await serviceService.getServices();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      car: Car,
      truck: Truck,
      users: Users,
      building: Building
    };
    return icons[iconName] || Car;
  };

  if (loading) {
    return (
      <section id="services" className="services">
        <div className="services-container">
          <div className="section-header">
            <h2 className="section-title">{t('servicessec.loading')}</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="services">
      <div className="services-container">
        <div className="section-header">
          <h2 className="section-title">
            {t('servicessec.title')}
          </h2>
          <p className="section-subtitle">
            {t('servicessec.subtitle')}
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => {
            const IconComponent = getIcon(service.icon);
            return (
              <div key={service.id} className="service-card">
                <div className="service-icon">
                  <IconComponent size={32} color="#1e40af" />
                </div>
                <h3 className="service-title">
                  {service.title}
                </h3>
                <p className="service-description">
                  {service.description}
                </p>
                <ul className="service-features">
                  {service.features && service.features.map((feature, idx) => (
                    <li key={idx}>
                      <Shield size={16} color="#10b981" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <p className="service-price">{service.price}</p>
                <button
                  className="service-button"
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {t('servicessec.button')}
                </button>
              </div>
            );
          })}
        </div>

        <div className="services-cta">
          <h3>{t('servicessec.whyUs')}</h3>
          <div className="cta-features">
            <div className="cta-feature">
              <Clock size={32} color="#06b6d4" />
              <div>
                <h4>{t('servicessec.features.0.title')}</h4>
                <p>{t('servicessec.features.0.desc')}</p>
              </div>
            </div>
            <div className="cta-feature">
              <Shield size={32} color="#10b981" />
              <div>
                <h4>{t('servicessec.features.1.title')}</h4>
                <p>{t('servicessec.features.1.desc')}</p>
              </div>
            </div>
            <div className="cta-feature">
              <Users size={32} color="#ea580c" />
              <div>
                <h4>{t('servicessec.features.2.title')}</h4>
                <p>{t('servicessec.features.2.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
