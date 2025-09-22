import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Footer from "./components/Footer";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminLogin from "./components/admin/AdminLogin";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";
import PaymentPage from "./components/PaymentPage";
import Cities from './components/Cities';
import AboutPage from './components/AboutPage';
import CertificatedInstructors from './components/InstructorPage';
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import VerifyCodePage from "./components/VerifyCodePage";
import PrivateRoute from "./components/PrivateRoute"; // ✅ استدعاء
import PartnersPage from "./components/PartnersPage";

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = i18n.language;
    }
  }, [i18n.language]);

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* صفحات الأدمن */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminDashboard />} />

            {/* صفحات المستخدم */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify" element={<VerifyCodePage />} />
            
            {/* صفحة محمية */}
            <Route
              path="/payment-page"
              element={
                <PrivateRoute>
                  <PaymentPage />
                </PrivateRoute>
              }
            />

            <Route path="/services" element={<Services />} />
            <Route path="/aboutpage" element={<AboutPage />} />
            <Route path="/Certificated-Instructors" element={<CertificatedInstructors />} />
            <Route path="/cities" element={<Cities />} />
            <Route path="/partner" element={<PartnersPage />} />

            {/* الصفحة الرئيسية */}
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Hero />
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
