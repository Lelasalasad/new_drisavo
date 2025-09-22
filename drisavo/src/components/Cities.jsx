import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";

const API_BASE_URL = "https://api.drisavo.ca/api/api/v1";

const SVG_PLACEHOLDER = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>
     <rect width='100%' height='100%' fill='#e6eef8'/>
     <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#94a3b8' font-family='Arial' font-size='20'>No Image</text>
   </svg>`
);
const PLACEHOLDER = `data:image/svg+xml;utf8,${SVG_PLACEHOLDER}`;

const defaultCity = {
  id: "default",
  name: "Damascus",
  slug: "damascus",
  email: "info@damascus.example",
  phone: "+963-11-0000000",
  description: "مدينة افتراضية للاختبار — وصف قصير عن المدينة.",
  details:
    "تفاصيل إضافية عن المدينة الافتراضية: مواقع سياحية، مدارس، ومعلومات عامة للاختبار.",
  map_link: "https://www.google.com/maps",
  images: [PLACEHOLDER],
};

const Cities = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const resolveImage = (img) => {
    if (!img) return PLACEHOLDER;
    try {
      const s = String(img).trim();
      if (s.startsWith("http://") || s.startsWith("https://")) return s;
      if (s.startsWith("/")) return `${API_BASE_URL}${s}`;
      return `${API_BASE_URL}/${s}`;
    } catch {
      return PLACEHOLDER;
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/cities`, {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        });

        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.cities)
          ? res.data.cities
          : [];

        const citiesArray = data.length ? data : [defaultCity];

        const normalized = citiesArray.map((c) => {
          const imgs = Array.isArray(c.images)
            ? c.images
            : c.images
            ? [c.images]
            : [];
          return {
            ...c,
            images: imgs.length ? imgs.map(resolveImage) : [PLACEHOLDER],
          };
        });

        setCities(normalized);
        setSelectedCity(normalized[0] || defaultCity);
      } catch (err) {
        console.error("Error fetching city data:", err);
        const msg = err.response?.data?.message || err.message || "خطأ في الشبكة";
        setError("فشل في جلب المدن: " + msg);
        toast.error("فشل في جلب المدن: " + msg);
        setCities([defaultCity]);
        setSelectedCity(defaultCity);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ padding: 40, textAlign: "center" }}>
          <p>جاري تحميل المدن...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="cities-page" style={{ padding: "40px 0", marginTop: "50px" }}>
        <div
          className="cities-container"
          style={{
            display: "flex",
            gap: 32,
            maxWidth: 1200,
            margin: "0 auto",
            marginTop: "50px" ,
            alignItems: "flex-start",
          }}
        >
          {/* Sidebar */}
          <aside className="sidebar-c" style={{ minWidth: 220 }}>
            <div style={{marginTop: "30px" , marginBottom: 12, fontWeight: 700, fontSize: "18px" }}>
              المدن
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {cities.map((c) => (
                <li key={c.id} style={{ marginBottom: 8 }}>
                  <button
                    className={`city-btn ${selectedCity?.id === c.id ? "active" : ""}`}
                    onClick={() => setSelectedCity(c)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border:
                        selectedCity?.id === c.id
                          ? "1px solid #2563eb"
                          : "1px solid #00000033",
                      background:
                        selectedCity?.id === c.id ? "#f0f9ff" : "white",
                      cursor: "pointer",
                      color: selectedCity?.id === c.id ? "#111827" : "inherit",
                    }}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main content */}
          <main className="content-c" style={{ flex: 1 }}>
            {selectedCity && (
              <div
                className="city-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  padding: 20,
                  borderRadius: 12,
                  border: "1px solid #eef2f7",
                  background: "white",
                  boxShadow: "0 4px 14px rgba(2,6,23,0.05)",
                }}
              >
                {/* صورة المدينة */}
                <div style={{ borderRadius: 10, overflow: "hidden" }}>
                  <img
                    src={selectedCity.images?.[0] ?? PLACEHOLDER}
                    alt={selectedCity.name}
                    style={{
                      width: "100%",
                      height: 320,
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                  />
                </div>

                {/* Thumbnails */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 10,
                    overflowX: "auto",
                    paddingBottom: 6,
                  }}
                >
                  {selectedCity.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${selectedCity.name}-${idx}`}
                      style={{
                        width: 90,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 8,
                        cursor: "pointer",
                        border: "1px solid #eef2f7",
                      }}
                      onClick={(e) => {
                        const preview = e.currentTarget.src;
                        const mainImg = e.currentTarget
                          .closest(".city-card")
                          ?.querySelector("img");
                        if (mainImg) mainImg.src = preview;
                      }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = PLACEHOLDER;
                      }}
                    />
                  ))}
                </div>

                {/* معلومات الاتصال */}
                <div style={{ marginTop: 12 }}>
                  {selectedCity.email && (
                    <p>
                      <strong>Email: </strong>
                      <a href={`mailto:${selectedCity.email}`}>
                        {selectedCity.email}
                      </a>
                    </p>
                  )}
                  {selectedCity.phone && (
                    <p>
                      <strong>Phone: </strong>
                      {selectedCity.phone}
                    </p>
                  )}

                  <p style={{ marginTop: 12 }}>
                    <strong>الخريطة: </strong>
                    {selectedCity.map_link ? (
                      <a
                        href={selectedCity.map_link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        عرض الخريطة الكاملة
                      </a>
                    ) : (
                      <span>لا يوجد رابط خريطة</span>
                    )}
                  </p>
                </div>

                {/* تفاصيل */}
                <div style={{ marginTop: 16 }}>
                  <h2 style={{ marginTop: 0 }}>{selectedCity.name}</h2>
                  <p style={{ color: "#475569" }}>{selectedCity.description}</p>

                  <h4 style={{ marginBottom: 8, marginTop: 16 }}>تفاصيل</h4>
                  <p style={{ color: "#475569" }}>{selectedCity.details}</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
      <ToastContainer position="top-right" />
    </>
  );
};

export default Cities;
