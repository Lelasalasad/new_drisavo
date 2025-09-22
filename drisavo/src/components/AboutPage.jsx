import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AboutPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', title: '', message: '' });
  const API_BASE = process.env.REACT_APP_API_BASE || "https://api.drisavo.ca/api/api/v1";

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/inquiries`, form);
      toast.success("Message sent successfully!");
      setForm({ name: '', email: '', phone: '', title: '', message: '' });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to send message";
      toast.error(msg);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="about-page">

        {/* ====== OUR PARTNERS ====== */}
        <section id="partners" className="partners-hero">
          <div className="container text-center">
            <h2>{t('aboutPage.partnersTitle')}</h2>
            <p className="lead">{t('aboutPage.partnersLead')}</p>
            <Link
              to="/partner"
              className="learn-more-btn"
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#007BFF',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              {t('aboutPage.learnMore')}
            </Link>
          </div>
        </section>

        {/* ====== CONTACT ====== */}
        <section id="contact" className="contact-section">
          <div className="container grid-2">
            <div>
              <h2>{t('aboutPage.contactTitle')}</h2>
              <p>{t('aboutPage.contactSubtitle')}</p>
              <form className="contact-form" onSubmit={handleSubmit}>
                <input name="name" placeholder={t('aboutPage.fullName')} value={form.name} onChange={handleChange} required />
                <input name="email" type="email" placeholder={t('aboutPage.email')} value={form.email} onChange={handleChange} required />
                <input name="phone" placeholder={t('aboutPage.phone')} value={form.phone} onChange={handleChange} />
                <input name="title" placeholder={t('aboutPage.title')} value={form.title} onChange={handleChange} />
                <textarea name="message" placeholder={t('aboutPage.message')} value={form.message} onChange={handleChange} />
                <button type="submit" className="send-btn">{t('aboutPage.sendMessage')}</button>
              </form>
            </div>
            <aside className="contact-details">
              <h3>Contact details</h3>
              <p><strong>Company location</strong><br />1020 Bayridge Drive, Kingston, Ontario, Canada K7P 2S2</p>
              <p><strong>Send an email</strong><br /><a href="mailto:info@drisavo.com">info@drisavo.com</a></p>
              <p><strong>Call us</strong><br />613-766-0574</p>
            </aside>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
