import React from "react";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

/* by lelas alasad */
const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: t("home") || "Home", link: "/" },
    { label: t("Services") || "Services", link: "/services" },
    { label: t("Cities") || "Cities", link: "/cities" },
    { label: t("Certificated-Instructors") || "Become an Instructor", link: "/Certificated-Instructors" },
  ];

  const services = [
    { label: "BDE Program", link: "/services#bde" },
    { label: "Private Lesson", link: "/services#private" },
    { label: "Road Test", link: "/services#roadtest" },
  ];

  const company = [
    { label: "Privacy Policy", link: "/aboutpage#pri" },
    { label: "About Us", link: "/aboutpage#ab" },
    { label: "Careers", link: "/aboutpage#ca" },
    { label: "Our Team", link: "/aboutpage#tm" },
  ];

  // يستخدم نفس منطق الـ Header للتنقل و الـ scrolling
  const handleNavigation = (link) => {
    if (!link) return;
    const [basePart, hash] = link.split("#");
    const base = basePart && basePart.trim() !== "" ? basePart : "/";

    if (location.pathname !== base) {
      navigate(base);
      // ننتظر شوية حتى تتم عملية الـ navigation ثم نبحث عن العنصر ونعمل scroll
      setTimeout(() => {
        if (!hash) return;
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 350); // 350ms مناسب عادة بعد التغيير بالـ route
    } else {
      if (hash) {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // إذا الرابط بدون هاش لكن نفس الصفحة نحتفظ بالسلوك الافتراضي (مثلاً إعادة التمرير للأعلى)
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="footer" style={{ background: "#eaf9fb", color: "#000306ff", padding: "48px 0" }}>
      <div className="footer-container" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
        <div className="footer-content" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 30 }}>
          {/* وصف الشركة */}
          <div className="footer-section">
<img src="/Logo4.png" alt="Drisavo Logo" className="logo" />
            <p style={{ color: "#000204ff", lineHeight: 1.6 }}>
              From Beginner Driver’s Education (BDE) certificates to connecting students
              with local MTO-certified instructors, Drisavo is evolving into a platform for
              complete mobility solutions.
            </p>
            <div className="social-links" style={{ marginTop: 14, display: "flex", gap: 12 }}>
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="facebook" style={{ color: "#e6eef8" }}>
                <Facebook size={22} />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="linkedin" style={{ color: "#e6eef8" }}>
                <Linkedin size={22} />
              </a>
              <a href="https://www.tiktok.com" target="_blank" rel="noreferrer" aria-label="tiktok" style={{ color: "#e6eef8" }}>
                <FaTiktok size={20} />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="instagram" style={{ color: "#e6eef8" }}>
                <Instagram size={22} />
              </a>
            </div>
          </div>

          {/* روابط التنقل */}
          <div className="footer-section">
            <h4 style={{ color: "#000000ff", marginBottom: 12 }}>{t("Navigation") || "Navigation"}</h4>
            <ul className="footer-links" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {navLinks.map((n, i) => (
                <li key={i} style={{ marginBottom: 8 }}>
                  <button
                    onClick={() => handleNavigation(n.link)}
                    className="footer-link-btn"
                    style={{ background: "transparent", border: "none", color: "#000204ff", cursor: "pointer", padding: 0 }}
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* خدمات درايفيزا */}
          <div className="footer-section">
            <h4 style={{ color: "#010000ff", marginBottom: 12 }}>Services</h4>
            <ul className="footer-links" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {services.map((s, i) => (
                <li key={i} style={{ marginBottom: 8 }}>
                  <button
                    onClick={() => handleNavigation(s.link)}
                    className="footer-link-btn"
                    style={{ background: "transparent", border: "none", color: "#cbd5e1", cursor: "pointer", padding: 0 }}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* معلومات الشركة */}
          <div className="footer-section">
            <h4 style={{ color: "#000000ff", marginBottom: 12 }}>Company</h4>
            <ul className="footer-links" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {company.map((c, i) => (
                <li key={i} style={{ marginBottom: 8 }}>
                  <button
                    onClick={() => handleNavigation(c.link)}
                    className="footer-link-btn"
                    style={{ background: "transparent", border: "none", color: "#000306ff", cursor: "pointer", padding: 0 }}
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* الشريط السفلي */}
        <div className="footer-bottom" style={{ marginTop: 36, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 18, textAlign: "center", color: "#93c5fd" }}>
          <p style={{ margin: 0 }}>&copy; {currentYear} Drisavo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;