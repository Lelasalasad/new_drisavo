import React, { useState } from "react";
import { Menu, X, Globe, ChevronDown, ChevronRight } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
/*lelasasadd */
const Dropdown = ({ title, items, closeMenu }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getBasePath = (link) => {
    if (!link) return "/";
    const parts = link.split("#");
    return parts[0] || "/";
  };

  const handleTitleClick = (e) => {
    e && e.preventDefault();
    if (!items || items.length === 0) return;

    const base = getBasePath(items[0].link);
    if (location.pathname !== base) {
      navigate(base);
    } else {
      setOpen((s) => !s);
    }
  };

  const handleClick = (item) => {
    const [base, hash] = item.link.split("#");
    const targetBase = base || "/";

    if (location.pathname !== targetBase) {
      navigate(targetBase);
      setTimeout(() => {
        if (!hash) return;
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 450);
    } else {
      if (hash) {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    setOpen(false);
    if (typeof closeMenu === "function") closeMenu();
  };

  return (
    <div
      className="dropdown"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="dropdown-btn"
        onClick={handleTitleClick}
        aria-expanded={open}
        type="button"
      >
        {title} <ChevronDown size={16} />
      </button>

      {open && (
        <ul className="dropdown-menu" role="menu">
          {items.map((item, i) => (
            <li key={i} role="none">
              <button
                onClick={() => handleClick(item)}
                className="dropdown-link"
                role="menuitem"
                type="button"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const services = [
    { label: "BDE Program", link: "/services#bde" },
    { label: "Private Lesson", link: "/services#private" },
    { label: "Road Test", link: "/services#roadtest" },
  ];

  

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="logo-wrap">
            <Link to="/" onClick={closeMenu}>
              <img src="/Logo4.png" alt="Drisavo Logo" className="logo" />
            </Link>
          </div>

          <nav className={`nav ${isMenuOpen ? "active" : ""}`}>
            <Link to="/" className="nav-button" onClick={closeMenu}>
              {t("home")}
            </Link>

            <Dropdown
              title={t("Services")}
              items={services}
              closeMenu={closeMenu}
            />

            <Link to="/cities" className="nav-button" onClick={closeMenu}>
              {t("Cities")}
            </Link>

            <Link
              to="/Certificated-Instructors"
              className="nav-button"
              onClick={closeMenu}
            >
              {t("Certificated-Instructors")}
            </Link>

            <Link to="/aboutpage"
              className="nav-button"
              onClick={closeMenu}
            >
              {t("Partners")}
              </Link>
            <Link
              to="/aboutpage#contact"
              className="nav-button"
              onClick={closeMenu}
            >
              Contact
            </Link>

            {isAuthenticated && isAdmin() ? (
              <>
                <Link to="/admin" className="nav-button" onClick={closeMenu}>
                  {t("dashboard")}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="nav-button"
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="nav-button"
                onClick={closeMenu}
              >
                {t("adminLogin")}
              </Link>
            )}
            <Link
              to="/payment-page"
              className="btn-enroll-H"
              onClick={closeMenu}
            >
              Enroll Now <ChevronRight size={18} />
            </Link>
          </nav>

          <div className="header-contact">
            <div className="contact-item">
              <Globe size={18} style={{ marginRight: "5px" }} />
              <select
                onChange={(e) => changeLanguage(e.target.value)}
                defaultValue={i18n.language}
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
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
