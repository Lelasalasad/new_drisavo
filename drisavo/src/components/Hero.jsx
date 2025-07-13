import React from 'react';
import { ChevronRight, Shield, Clock, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              {t('hero.title1')}
              <span className="hero-highlight"> {t('hero.title2')}</span>
              <br />
              {t('hero.title3')}
            </h1>
            <p className="hero-subtitle">
              {t('hero.subtitle')}
            </p>
            <div className="hero-buttons">
              <button onClick={scrollToContact} className="btn-primary">
                {t('hero.getStarted')}
                <ChevronRight size={20} />
              </button>
              <button 
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary"
              >
                {t('hero.ourServices')}
              </button>
            </div>
          </div>

          <div className="hero-features">
            <div className="feature-item">
              <div className="feature-icon shield">
                <Shield size={24} color="white" />
              </div>
              <div className="feature-text">
                <h3>{t('hero.feature1.title')}</h3>
                <p>{t('hero.feature1.desc')}</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon clock">
                <Clock size={24} color="white" />
              </div>
              <div className="feature-text">
                <h3>{t('hero.feature2.title')}</h3>
                <p>{t('hero.feature2.desc')}</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon users">
                <Users size={24} color="white" />
              </div>
              <div className="feature-text">
                <h3>{t('hero.feature3.title')}</h3>
                <p>{t('hero.feature3.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
