// src/components/PartnersPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Settings } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";

const API_BASE =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.REACT_APP_API_BASE) ||
  (typeof window !== "undefined" && window.__REACT_APP_API_BASE) ||
  "https://api.drisavo.ca/api/api";

const api = axios.create({ baseURL: API_BASE, timeout: 10000 });

const PLACEHOLDER = "/placeholder.png";

const PartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [students, setStudents] = useState([]);
  const [showInputId, setShowInputId] = useState(null);
  const [accountInput, setAccountInput] = useState("");
  const [studentsForPartner, setStudentsForPartner] = useState({});

  useEffect(() => {
    fetchPartners();
    fetchStudents();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await api.get("/partners");
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setPartners(data);
    } catch (err) {
      console.warn("fetchPartners failed:", err.message);
      setPartners([]);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students-with-discounts");
      setStudents(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.warn("fetchStudents failed:", err.message);
      setStudents([]);
    }
  };

  const toggleInput = (partnerId) => {
    if (showInputId === partnerId) {
      setShowInputId(null);
      setAccountInput("");
    } else {
      setShowInputId(partnerId);
      setAccountInput("");
      setStudentsForPartner((prev) => ({ ...prev, [partnerId]: [] }));
    }
  };

  const handleCheckAccount = (partner) => {
    if (accountInput !== partner.account_id) {
      setStudentsForPartner((prev) => ({ ...prev, [partner.id]: [] }));
      return;
    }
    const used = students.filter(
      (s) => Number(s.partner_id) === Number(partner.id)
    );
    setStudentsForPartner((prev) => ({ ...prev, [partner.id]: used }));
  };

  const calculateProfit = (partnerId) => {
    const count = studentsForPartner[partnerId]?.length || 0;
    return count * 10; // مؤقتًا 10$ لكل طالب
  };

  return (
    <>
      <Header />
      <div
        className="partners-container"
        style={{ maxWidth: 1200, margin: "90px auto", padding: "0 20px" }}
      >
        <h1
          className="main-title"
          style={{ marginTop: "20px", textAlign: "center", marginBottom: 30 }}
        >
          شركاؤنا
        </h1>

        <div
          className="partners-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="partner-card"
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                textAlign: "center",
                position: "relative",
              }}
            >

              <img
                src={partner.logo}
                alt={partner.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = PLACEHOLDER;
                }}
                style={{
                  maxWidth: "150px",
                  maxHeight: "150px",
                  objectFit: "contain",
                  marginBottom: 10,
                }}
              />


              <h3 style={{ fontSize: 18, fontWeight: "bold" }}>
                {partner.name}
              </h3>

              <button
                onClick={() => toggleInput(partner.id)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <Settings size={20} />
              </button>

              {showInputId === partner.id && (
                <div style={{ marginTop: 15, textAlign: "center" }}>
                  <input
                    type="text"
                    placeholder="أدخل رقم الحساب"
                    value={accountInput}
                    onChange={(e) => setAccountInput(e.target.value)}
                    style={{
                      padding: "6px 10px",
                      marginRight: 8,
                      border: "1px solid #ccc",
                      borderRadius: 6,
                    }}
                  />
                  <button
                    onClick={() => handleCheckAccount(partner)}
                    style={{
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: 6,
                      background: "#007bff",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    تأكيد
                  </button>

                  {studentsForPartner[partner.id]?.length > 0 && (
                    <div style={{ marginTop: 10, textAlign: "center" }}>
                      <p>
                        عدد الطلاب: {studentsForPartner[partner.id].length}
                      </p>
                      <p>نسبة الربح: {calculateProfit(partner.id)}$</p>
                      <ul style={{ marginTop: 5, textAlign: "left" }}>
                        {studentsForPartner[partner.id].map((s) => (
                          <li key={s.id}>{s.name || "طالب بدون اسم"}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {accountInput &&
                    studentsForPartner[partner.id]?.length === 0 && (
                      <p style={{ marginTop: 10 }}>
                        لا يوجد طلاب أو رقم حساب غير صحيح
                      </p>
                    )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PartnersPage;
