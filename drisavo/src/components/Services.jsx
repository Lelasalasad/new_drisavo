import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Services = () => {
  const API_BASE_URL = "https://api.drisavo.ca/api/api/v1";
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Default service
  const defaultService = {
    id: "default",
    title: "Default Service",
    category: "bde",
    description: "This is a default service displayed when fetching services from the API fails.",
    price: "100",
    original_price: "150",
    features: [
      "Feature 1: Full support.",
      "Feature 2: High quality.",
      "Feature 3: Available around the clock.",
    ],
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/services`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
        });
        console.log("API Response:", res.data);
        const dataArray = Array.isArray(res.data.data) ? res.data.data : [];
        setServices(dataArray.length ? dataArray : [defaultService]);
      } catch (err) {
        console.error("Failed to load services", err);
        setError("Failed to fetch services: " + err.message);
        toast.error("Failed to fetch services: " + err.message);
        setServices([defaultService]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Function to filter services by category
  const byCategory = (cat) => services.filter((s) => s.category === cat);

  if (loading) {
    return (
      <div className="services-section">
        <Header />
        <div className="container">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />
      <section className="services-section">
        <div className="container">
          {error && <p className="error-text">{error}</p>}

          {/* BDE Program - All services appear here */}
          {services.length > 0 ? (
            services.map((s) => (
              <div key={s.id} className="bde-container" id="bde">
                <div className="bde-description">
                  <h2 className="service-title">{s.title}</h2>
                  <p className="service-desc">{s.description}</p>
                </div>
                <div className="bde-card">
                  {s.price && (
                    <div className="card-pricing">
                      {s.original_price && (
                        <span className="original-price">
                          {s.original_price}
                        </span>
                      )}
                      <span className="current-price">{s.price}</span>
                    </div>
                  )}
                  {s.features && s.features.length > 0 && (
                    <>
                      <h4 className="included-title">Included:</h4>
                      <ul className="inclusions-list">
                        {s.features.map((f, i) => (
                          <li key={i} dangerouslySetInnerHTML={{ __html: f }} />
                        ))}
                      </ul>
                    </>
                  )}
                  <Link to="/payment-page" className="enroll-btn">
                    Enroll Now
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No services available at the moment.</p>
          )}

          {/* Private Lessons */}
          {byCategory("private").length > 0 ? (
            byCategory("private").map((s) => (
              <div key={s.id} className="service-block" id="private">
                <h3 className="service-heading">{s.title}</h3>
                <p className="service-desc">{s.description}</p>
                <Link to="/payment-page" className="enroll-btn">
                  Enroll Now
                </Link>
                {s.features && s.features.length > 0 ? (
                  <div className="plans-grid">
                    {s.features.map((plan, idx) => (
                      <div className="plan-card" key={idx}>
                        <h4>{plan}</h4>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No plans available.</p>
                )}
              </div>
            ))
          ) : (
            <p>No private lessons available.</p>
          )}

          {/* Road Test */}
          {byCategory("roadtest").length > 0 ? (
            byCategory("roadtest").map((s) => (
              <div key={s.id} className="service-block" id="roadtest">
                <h3 className="service-heading">{s.title}</h3>
                {s.features && s.features.length > 0 ? (
                  <div className="plans-grid">
                    {s.features.map((plan, idx) => (
                      <div className="plan-card" key={idx}>
                        <h4>{plan}</h4>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No plans available.</p>
                )}
              </div>
            ))
          ) : (
            <p>No Road Test services available.</p>
          )}

          {/* FAQs */}
          {byCategory("faq").length > 0 ? (
            byCategory("faq").map((s) => (
              <div key={s.id} className="service-block faq-block">
                <h3 className="service-heading">{s.title}</h3>
                {s.features && s.features.length > 0 ? (
                  s.features.map((qa, idx) => {
                    const [q, a] = qa.split("|");
                    return (
                      <div key={idx} className="faq-item">
                        <h4>{q}</h4>
                        <p>{a}</p>
                      </div>
                    );
                  })
                ) : (
                  <p>No FAQs available.</p>
                )}
              </div>
            ))
          ) : (
            <p>No FAQs available.</p>
          )}
        </div>
      </section>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default Services;