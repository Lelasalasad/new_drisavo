import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "https://api.drisavo.ca/api/api";

const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const extractServerMessage = (data) => {
    if (!data) return null;
    if (data.errors && typeof data.errors === "object") {
      const arr = [];
      Object.entries(data.errors).forEach(([k, v]) => {
        if (Array.isArray(v)) arr.push(...v.map((s) => `${k}: ${s}`));
        else if (typeof v === "string") arr.push(`${k}: ${v}`);
      });
      return arr.join(" • ");
    }
    const msg = data.message || data.msg || data.error;
    if (typeof msg === "string") return msg;
    if (typeof msg === "object") {
      if (msg.en) return msg.en;
      const vals = Object.values(msg).flat().filter(Boolean);
      if (vals.length) return vals.join(" • ");
    }
    if (data.data) {
      if (typeof data.data === "string") return data.data;
      if (data.data?.message)
        return typeof data.data.message === "string"
          ? data.data.message
          : JSON.stringify(data.data.message);
    }
    try {
      return JSON.stringify(data);
    } catch {
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error(t("login.enterEmail") || "Please enter your email");
      return;
    }
    if (!password) {
      toast.error(t("login.enterPassword") || "Please enter your password");
      return;
    }

    setIsSubmitting(true);
    try {
      const resp = await axios.post(`${API_BASE}/login`, {
  email: email.trim(),
  password,
  type: "student",
});


      console.log("[Login] response:", resp.data);
      const serverMsg = extractServerMessage(resp.data);

      const token =
        resp.data?.token ||
        resp.data?.data?.token ||
        resp.data?.access_token ||
        resp.data?.data?.access_token ||
        null;

      if (token) {
        localStorage.setItem("token", token);
        toast.success(serverMsg || t("login.success") || "Logged in successfully");
        navigate("/payment-page"); // ✅ مباشرة بعد تسجيل الدخول
      } else {
        toast.error(
          serverMsg ||
            t("login.error") ||
            "Login failed: no token received"
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        extractServerMessage(err.response?.data) ||
        (err.response ? `Server error ${err.response.status}` : null);

      if (err.response?.data?.errors) {
        const errMsg = extractServerMessage(err.response.data);
        if (errMsg && errMsg.length < 200) toast.error(errMsg);
        else
          toast.error(
            t("login.validationFailed") ||
              "Validation failed. Check your input."
          );
      } else if (serverMsg) {
        toast.error(serverMsg);
      } else {
        toast.error(err.message || t("login.error") || "Login failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <section className="auth-section">
        <div className="auth-wrapper">
          <h2 className="form-title">{t("login.title")}</h2>
          <p className="form-subtitle">{t("login.subtitle")}</p>
          <form onSubmit={handleLogin} className="auth-form">
            <input
              type="email"
              placeholder={t("login.email") || "Email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
            <input
              type="password"
              placeholder={t("login.password") || "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
            <button
              type="submit"
              className="btn-primary auth-btn"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t("login.submitting") || "Signing in..."
                : t("login.button")}
            </button>
          </form>
          <p className="form-footer">
            {t("login.noAccount") || "Don't have an account?"}{" "}
            <Link to="/signup" className="form-link">
              {t("login.signupLink") || "Sign up"}
            </Link>
          </p>
        </div>
      </section>
      <Footer />
      <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
};

export default LoginPage;
