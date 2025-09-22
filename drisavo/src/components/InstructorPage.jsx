import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";

const defaultContent = {
  keyLabel: "Key benefits",
  heading: "Perks & Benefits",
  benefits: [
    { title: "Set Your Schedule", desc: "Flexibility to be your own boss and manage your time." },
    { title: "Expand Your Network", desc: "Interact with diverse people from around the globe." },
    { title: "Competitive Pay", desc: "We can match rates from any driving school in Canada." },
    { title: "Manage Your Profile", desc: "Your performance drives your attractiveness to customers. Its all on you!" },
    { title: "Community Impact", desc: "Play a key role in promoting road safety and accident reduction." },
    { title: "Continuous Learning", desc: "Opportunities to remain sharp and up-to-date on safety rules and regulations." }
  ],
  documentsTitle: "Documents Required",
  documentsIntro: "Our MTO Certified In-car Driving Instructors must have the following documents to be uploaded on the mobile app. Follow the steps and upload the required documents!",
  documents: [
    "In-car Driving Certification",
    "Valid Ontario Driving Instructor’s License (MTO approved)",
    "G Driver’s Licence",
    "Driving Instructor Insurance",
    "Vehicle Ownership; vehicle in good condition with the brake padle on the passenger side.",
    "Ontario Car Safety Check Report.",
    "Images showing a dual brake pedal for the instructor, front side view of the instructor’s vehicle including the license plate."
  ]
};

const InstructorPage = () => {
  const [instructors, setInstructors] = useState([]);
  const [schedules, setSchedules] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // بيانات تسجيل الدخول
  const adminCredentials = {
    email: "admin@gmail.com",
    password: "123456789",
    type: "admin",
  };

  // تسجيل الدخول + جلب المدربين
  useEffect(() => {
    const loginAndFetch = async () => {
      try {
        // 1- تسجيل الدخول
        const loginRes = await fetch("https://api.drisavo.ca/api/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adminCredentials),
        });

        const loginData = await loginRes.json();
        if (!loginData.token) {
          setError("فشل تسجيل الدخول: لم يتم الحصول على التوكن");
          setLoading(false);
          return;
        }

        localStorage.setItem("adminToken", loginData.token);

        // 2- جلب المدربين
        const res = await fetch("https://api.drisavo.ca/api/api/getAcceptedInstructors", {
          headers: { Authorization: `Bearer ${loginData.token}` },
        });

        const instructorsData = await res.json();
        setInstructors(instructorsData);
      } catch (err) {
        setError("حدث خطأ: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loginAndFetch();
  }, []);

  // جلب مواعيد مدرب معين
  const fetchInstructorDates = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`https://api.drisavo.ca/api/api/getInstructorDates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSchedules((prev) => ({ ...prev, [id]: data }));
    } catch (err) {
      setError(`فشل في جلب مواعيد المدرب ${id}: ${err.message}`);
    }
  };

  if (loading) return <p>جاري التحميل...</p>;

  return (
    <>
      <Header />
      <div className="instructor-page">
      <section
      style={{
        backgroundColor: "#E6F7FA", // سماوي فاتح
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "1200px",
          margin: "0 auto",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        {/* الجزء اليسار: صورة وحدة */}
        <div style={{ flex: "1 1 400px", textAlign: "center" }}>
          <img
            src={"./inst-3-768x674.png"}
            alt="Instructor"
            style={{
              width: "100%",
              maxWidth: "400px",
              borderRadius: "20px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            }}
          />
        </div>

        {/* الجزء اليمين: النص + الخطوات */}
        <div style={{ flex: "1 1 400px" }}>
          <span
            style={{
              display: "inline-block",
              padding: "6px 14px",
              background: "#FF4B77",
              color: "white",
              borderRadius: "999px",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          >
            How It Works
          </span>
          <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "20px" }}>
            Become an instructor in no time <br />
            with our simplified steps
          </h2>

          <ul style={{ listStyle: "none", padding: 0, marginBottom: "20px" }}>
            {[
              "Download our app and sign up today on Android or iOS!",
              "Complete your profile and write a short bio",
              "Upload the required documents",
              "Get approved and set your preferred schedule!",
            ].map((step, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                  fontSize: "16px",
                }}
              >
                <span style={{ color: "#2563eb", marginRight: "8px" }}>✔</span>
                {step}
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", gap: "12px" }}>
            <img src={"./googleplay.jpg"} alt="Google Play" style={{ height: "50px" }} />
            <img src={"./appstore.png"} alt="App Store" style={{ height: "50px" }} />
          </div>
        </div>
      </div>
    </section>
        {/* قسم الفوائد */}
        <section className="benefits-hero">
          <div className="container">
            <span className="pill">{defaultContent.keyLabel}</span>
            <h1 className="main-heading">{defaultContent.heading}</h1>
            <div className="benefits-grid">
              {defaultContent.benefits.map((b, i) => (
                <div className="benefit-card" key={i}>
                  <div className="icon-circle">{/* أيقونة */}</div>
                  <h4>{b.title}</h4>
                  <p>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* قسم الوثائق */}
        <section className="documents-section">
          <div className="container docs-inner">
            <h2 className="docs-title">{defaultContent.documentsTitle}</h2>
            <p className="docs-intro">{defaultContent.documentsIntro}</p>
            <div className="docs-list">
              {defaultContent.documents.map((d, i) => (
                <div className="doc-item" key={i}>
                  <span className="dot">•</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* قسم المدربين */}
        <section className="instructors-section">
          <div className="container">
            <h2 className="schedule-title">المدربون المعتمدون</h2>
            {error && <p className="error-text">{error}</p>}
            <div className="instructors-grid">
              {instructors.length > 0 ? (
                instructors.map((ins) => (
                  <div key={ins.id} className="instructor-card">
                    <img src={ins.car_image_url} alt="Car" className="instructor-car" />
                    <h3>
                      {ins.f_name} {ins.l_name !== "NULL" ? ins.l_name : ""}
                    </h3>
                    <p>{ins.email}</p>
                    <p>{ins.phone_number}</p>
                    <button
                      className="view-schedule-btn"
                      onClick={() => fetchInstructorDates(ins.id)}
                    >
                      عرض المواعيد
                    </button>

                    {/* جدول المواعيد */}
                    {schedules[ins.id] && (
                      <div className="schedule-table">
                        <h4>جدول مواعيد {ins.f_name}</h4>
                        <table>
                          <thead>
                            <tr>
                              <th>التاريخ</th>
                              <th>من</th>
                              <th>إلى</th>
                            </tr>
                          </thead>
                          <tbody>
                            {schedules[ins.id].map((slot) => (
                              <tr key={slot.id}>
                                <td>{slot.date}</td>
                                <td>{slot.from_time}</td>
                                <td>{slot.to_time}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>لا يوجد مدربين مقبولين.</p>
              )}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default InstructorPage;