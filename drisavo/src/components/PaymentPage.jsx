// src/components/PaymentPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const API_BASE = "https://api.drisavo.ca/api/api";

const PaymentPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [loadingPackages, setLoadingPackages] = useState(false);

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "token") setToken(e.newValue || "");
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const fetchPackages = useCallback(async (authToken) => {
    try {
      setLoadingPackages(true);
      const res = await axios.get(`${API_BASE}/getPackages`, {
        headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
        timeout: 10000,
      });

      const data = Array.isArray(res.data) ? res.data : [];
      setPackages(data);
    } catch (err) {
      console.error("fetchPackages error:", err);
      toast.error(t("failedLoadPackages") || "فشل في جلب الباقات");
      setPackages([]);
    } finally {
      setLoadingPackages(false);
    }
  }, [t]);

  useEffect(() => {
    if (token) {
      fetchPackages(token);
    } else {
      setPackages([]);
      setSelectedPackageId(null);
    }
  }, [token, fetchPackages]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE}/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, timeout: 8000 }
      );
    } catch (err) {
      console.error("logout error:", err);
    } finally {
      localStorage.removeItem("token");
      setToken("");
      setPackages([]);
      setSelectedPackageId(null);
      toast.info(t("loggedOut") || "تم تسجيل الخروج");
    }
  };

  const handlePurchase = () => {
    if (!token) {
      toast.error(t("mustLogin") || "يجب تسجيل الدخول أولاً");
      return;
    }
    if (!selectedPackageId) {
      toast.error(t("selectPackage") || "اختر باقة");
      return;
    }
    toast.success(t("proceedStripe") || "جاري التحويل إلى صفحة الدفع...");
  };

  return (
    <>
      <Header />
      <section className="payment-wrapper" style={{ padding: 40 }}>
        <div className="payment-form" style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 className="form-title">{t("packages") || "Packages"}</h2>
          <p className="form-subtitle">{t("choosePackage") || "Choose a package"}</p>

          {!token && (
            <div style={{ border: "1px solid #eef2f7", padding: 18, borderRadius: 8, marginBottom: 20, background: "#ffffff" }}>
              <p>{t("pleaseLoginOrSignup") || "Please login or sign up to see available packages."}</p>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button className="payment-btn" onClick={() => navigate("/login", { state: { from: "/payment-page" } })}>
                  {t("login") || "Login"}
                </button>
                <button className="btn-secondary" onClick={() => navigate("/signup", { state: { from: "/payment-page" } })}>
                  {t("signup") || "Sign up"}
                </button>
                <button className="btn-ghost" onClick={() => navigate("/verify", { state: { from: "/payment-page" } })}>
                  {t("haveCode") || "Have a verification code?"}
                </button>
              </div>
            </div>
          )}

          {token && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, background: "#fff", padding: 12, borderRadius: 8, border: "1px solid #eef2f7" }}>
              <div><strong>{t("loggedIn") || "Logged in"}</strong></div>
              <button className="btn-secondary" onClick={handleLogout}>{t("logout") || "Logout"}</button>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 18 }}>
            {loadingPackages ? (
              <p>{t("loadingPackages") || "Loading packages..."}</p>
            ) : packages.length === 0 ? (
              <p>{t("noPackages") || "No packages available"}</p>
            ) : (
              <div className="packages-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                {packages.map((p) => {
                  const name = i18n.language === "fr" ? p.fr_name : p.en_name;
                  const desc = i18n.language === "fr" ? p.fr_description : p.en_description;
                  return (
                    <div key={p.id} className={`package-card ${selectedPackageId === p.id ? "active" : ""}`} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "#fff" }}>
                      <input type="radio" name="package" value={p.id} checked={selectedPackageId === p.id} onChange={() => setSelectedPackageId(p.id)} />
                      <h3 style={{ margin: "8px 0" }}>{name}</h3>
                      <p style={{ color: "#6b7280", whiteSpace: "pre-line" }}>{desc}</p>
                      <p><strong>{t("price") || "Price"}:</strong> ${p.price}</p>
                      <p><strong>{t("hours") || "Hours"}:</strong> 🚗 {p.behind_the_wheel_hour_count} | 📚 {p.course_hour_count}</p>
                      {p.datesData && p.datesData.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <strong>{t("dates") || "Dates"}:</strong>
                          <ul style={{ margin: "4px 0 0 16px" }}>
                            {p.datesData.map((d) => (
                              <li key={d.id}>
                                {d.firstDate} → {d.secondDate} ({d.fromTime} - {d.toTime})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="total-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span>{t("total") || "Total"}</span>
            <span style={{ fontWeight: 700 }}>
              {(() => {
                const pkg = packages.find((x) => x.id === selectedPackageId);
                if (!pkg) return "$0";
                return `$${pkg.price}`;
              })()}
            </span>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="payment-btn" onClick={handlePurchase} disabled={!token || loadingPackages}>
              {t("bookLesson") || "Book / Pay"}
            </button>
            {!token && (
              <button className="btn-secondary" onClick={() => navigate("/signup")}>
                {t("createAccount") || "Create account"}
              </button>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default PaymentPage;
