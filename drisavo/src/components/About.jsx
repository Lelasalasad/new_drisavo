import React from 'react';
import { CheckCircle, Award, Users, Clock } from 'lucide-react'; 
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation(); 

  const stats = [
    { number: "10+", label: t("aboutSection.stats.experience"), icon: Clock },         
    { number: "500+", label: t("aboutSection.stats.clients"), icon: Users },         
    { number: "50+", label: t("aboutSection.stats.drivers"), icon: Award },            
    { number: "24/7", label: t("aboutSection.stats.support"), icon: CheckCircle }     
  ];

  return (
    <section id="about" className="about">
      <div className="about-container">
        <div className="about-content">
          {/* النصوص التعريفية */}
          <div className="about-text">
            <h2>{t("aboutSection.title")}</h2>
            <p>{t("aboutSection.p1")}</p>
            <p>{t("aboutSection.p2")}</p>

            {/* الميزات */}
            <ul className="about-features">
              <li>
                <CheckCircle size={24} color="#10b981" />
                <span>{t("aboutSection.features.licensed")}</span>
              </li>
              <li>
                <CheckCircle size={24} color="#10b981" />
                <span>{t("aboutSection.features.modernFleet")}</span>
              </li>
              <li>
                <CheckCircle size={24} color="#10b981" />
                <span>{t("aboutSection.features.support247")}</span>
              </li>
              <li>
                <CheckCircle size={24} color="#10b981" />
                <span>{t("aboutSection.features.backgroundCheck")}</span>
              </li>
            </ul>
          </div>

          {/* صورة + بادج سنوات التميز */}
          <div className="about-image">
            <img
              src="https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Professional driver"
            />
            <div className="about-badge">
              <h3>10+</h3>
              <p>{t("aboutSection.badge")}</p>
            </div>
          </div>
        </div>

        {/* شبكة الإحصائيات */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-icon">
                <stat.icon size={32} color="#1e40af" />
              </div>
              <h3 className="stat-number">{stat.number}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
