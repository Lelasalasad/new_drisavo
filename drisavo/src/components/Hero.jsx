import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import CountUp from "react-countup";
import { useTranslation } from "react-i18next";
import { CheckCircle } from "lucide-react";

import { Link } from "react-router-dom";
import { contentService } from "../services/contentService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Hero = () => {
  const { t } = useTranslation();
  const [activeCard, setActiveCard] = useState(0);
  const [offers, setOffers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // بيانات افتراضية في حال فشل جلب البيانات
  const defaultOffers = [
    {
      id: 1,
      title: "Beginner Driver’s Education Package",
      content: {
        price: "$399",
        original_price: "$499",
        details: [
          "10 hours in-car lessons",
          "20 hours online theory",
          "Free pickup and drop-off",
        ],
      },
    },
    {
      id: 2,
      title: "Refresher Driving Lessons",
      content: {
        price: "$199",
        details: [
          "5 hours in-car lessons",
          "Flexible scheduling",
          "Professional instructors",
        ],
      },
    },
  ];

  const defaultReviews = [
    {
      id: 1,
      content: {
        text: "Amazing driving school! The instructors are patient and professional.",
        author: "John Doe",
        date: "Jan 2025",
        image: "./da.jpg",
      },
    },
    {
      id: 2,
      content: {
        text: "I passed my driving test on the first try thanks to Drisavo!",
        author: "Sarah Smith",
        date: "Feb 2025",
        image: "./ta.jpg",
      },
    },
  ];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const [offersData, reviewsData] = await Promise.all([
          contentService.getOffers(),
          contentService.getReviews(),
        ]);
        setOffers(offersData.length > 0 ? offersData : defaultOffers);
        setReviews(reviewsData.length > 0 ? reviewsData : defaultReviews);
      } catch (err) {
        console.error("Failed to load content", err);
        setError(t("hero.loadFail"));
        toast.error(t("hero.loadFail"));
        setOffers(defaultOffers);
        setReviews(defaultReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    const interval = setInterval(() => {
      setActiveCard((prev) => (prev === 0 ? 1 : 0));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="hero">
          <div className="hero-container">
            <p>{t("hero.loading")}</p>
          </div>
        </div>
        <Footer />
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            {activeCard === 0 ? (
              <div className="hero-text">
                <h1 className="hero-title">
                  {t("hero.title1")}
                  <br />
                  {t("hero.title1Line2")}
                </h1>
                <div className="hero-buttons">
                  <Link to="/payment-page" className="btn-enroll">
                    {t("hero.enroll")} <ChevronRight size={20} />
                  </Link>
                  <button
                    className="btn-secondary"
                    onClick={() =>
                      document.getElementById("how-drisavo-works")?.scrollIntoView({ behavior: "smooth" })
                    }
                    
                    
                  >
                    {t("hero.howItWorks")}
                  </button>
                </div>
                <p className="hero-subtitle">{t("hero.subtitle1")}</p>
                <div className="hero-stats">
                  <p>
                    <CountUp end={1732} duration={2.5} /> {t("hero.happyCustomers")}
                  </p>
                  <p>
                    <CountUp end={4.8} decimals={1} duration={2.5} /> ⭐ {t("hero.rating")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="hero-text">
                <h1 className="hero-title">
                  {t("hero.title2")}
                  <br />
                  {t("hero.title2Line2")}
                </h1>
                <p className="hero-subtitle">{t("hero.subtitle2")}</p>
                <div className="hero-buttons">
                  <Link to="/payment-page" className="btn-enroll">
                    {t("hero.enroll")} <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
            )}
            <div className="hero-image">
              <img
                src={activeCard === 0 ? "./image (5).png" : "./image (6).png"}
                alt="driving theme"
              />
            </div>
          </div>
        </div>
      </section>
  {/*

      <section className="newsworthy">
        <div className="newsworthy-container">
          <h2 className="newsworthy-title">{t("hero.newsworthyTitle")}</h2>
          <div className="newsworthy-content">
            <div className="news-item">
              <img src="./image (1).png" alt="Feature 1" className="news-image" />
            </div>
            <div className="news-item">
              <img src="./image (2).png" alt="Feature 2" className="news-image" />
            </div>
            <div className="news-item">
              <img src="./image (3).png" alt="Feature 3" className="news-image" />
            </div>
          </div>
        </div>
      </section>
            */}
      <section className="services-header-h">
        <div className="services-header-container-h">
          <div className="left-content-h">
            <button className="services-btn-h">{t("hero.servicesBtn")}</button>
            <h2 className="header-title-h">{t("hero.servicesTitle")}</h2>
          </div>
          <div className="right-content-h">
            <p className="instruction-text-h">{t("hero.servicesInstruction")}</p>
            <button className="learn-more-btn">{t("hero.learnMore")}</button>
          </div>
        </div>
      </section>
{/*<section className="special-offers">
        <div className="special-offers-container">
          <h2 className="special-offers-title">{t("hero.specialOffersTitle")}</h2>
          <div className="offers-content">
            {offers.map((offer) => (
              <div key={offer.id} className="offer-item">
                <h3>{offer.title}</h3>
                <p className="offer-price">
                  {offer.content.price}{" "}
                  {offer.content.original_price && (
                    <span className="original-price">{offer.content.original_price}</span>
                  )}
                </p>
                <ul className="offer-details">
                  {offer.content.details && offer.content.details.length > 0 ? (
                    offer.content.details.map((d, i) => <li key={i}>{d}</li>)
                  ) : (
                    <li>{t("hero.noDetails")}</li>
                  )}
                </ul>
                <div className="hero-buttons">
                  <Link to="/payment-page" className="btn-primary">
                    {t("hero.enroll")} <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      
      <section className="drisavo-works" id="how-drisavo-works">
  <div className="works-container">
    <div className="works-text">
      <h2 className="works-title">
        {t("drisavoWorks.title")}
      </h2>
      <h3 className="works-subtitle">
        {t("drisavoWorks.subtitle")}
      </h3>
      <ul className="works-steps">
        <li>
          <CheckCircle size={20} color="#0077b6" /> {t("drisavoWorks.step1")}
        </li>
        <li>
          <CheckCircle size={20} color="#0077b6" /> {t("drisavoWorks.step2")}
        </li>
        <li>
          <CheckCircle size={20} color="#0077b6" /> {t("drisavoWorks.step3")}
        </li>
        <li>
          <CheckCircle size={20} color="#0077b6" /> {t("drisavoWorks.step4")}
        </li>
      </ul>
      <div className="works-buttons">
        <img
          src="./googleplay.jpg"
          alt="Google Play"
          className="store-badge"
        />
        <img
          src="./appstore.png"
          alt="App Store"
          className="store-badge"
        />
      </div>
    </div>
    <div className="works-image">
      <img src="./drisavo-app.png" alt="Drisavo App" />
      {/* <img src="./drisavo-qr.png" alt="QR Code" className="qr-code" /> */}
    </div>
  </div>
</section>

      <section className="reviews">
        <div className="reviews-container">
          <button className="reviews-btn">{t("hero.reviewsBtn")}</button>
          <h2 className="reviews-title">{t("hero.reviewsTitle")}</h2>
          <div className="reviews-content">
            {reviews.map((rev) => (
              <div key={rev.id} className="review-item">
                <p className="review-text">{rev.content.text}</p>
                <div className="review-author">
                  {rev.content.image && (
                    <img src={rev.content.image} alt={rev.content.author} className="review-image" />
                  )}
                  <span>
                    {rev.content.author}, {rev.content.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
};

export default Hero;