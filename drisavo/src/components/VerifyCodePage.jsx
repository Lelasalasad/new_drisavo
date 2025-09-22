import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "https://api.drisavo.ca/api/api";

export default function VerifyCodePage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  // نقرأ redirectTo من الستيت — هذا يحدّد وين نوجّه بعد النجاح
  const redirectTo = location.state?.redirectTo || "/login";
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const extractServerMessage = (data) => {
    if (!data) return null;
    if (data.errors && typeof data.errors === "object") {
      const arr = [];
      Object.values(data.errors).forEach((v) => {
        if (Array.isArray(v)) arr.push(...v);
        else if (typeof v === "string") arr.push(v);
      });
      return arr.join(" • ");
    }
    const msg = data.message;
    if (typeof msg === "string") return msg;
    if (typeof msg === "object") {
      if (msg.en) return msg.en;
      const vals = Object.values(msg).filter(Boolean).map((v) => (Array.isArray(v) ? v.join(" ") : v));
      if (vals.length) return vals.join(" • ");
    }
    try {
      return JSON.stringify(data);
    } catch {
      return null;
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error(t("verify.enterCode") || "Please enter the verification code");
      return;
    }
    if (!email) {
      toast.error(t("verify.noEmail") || "No email provided");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        email,
        code: code.trim(),
        firebaseToken: "dummyToken",
        deviceId: "1",
      };

      const resp = await axios.post(`${API_BASE}/verifyCode`, payload);

      const serverMsg = extractServerMessage(resp.data);
      const token = resp.data?.token || null;

      if ((resp.status >= 200 && resp.status < 300) && (resp.data?.success || resp.data)) {
        toast.success(serverMsg || t("verify.success") || "Verified successfully");

        if (token) {
          // لو الباك عاد توكن بعد التحقق نخزنه فوراً
          localStorage.setItem("token", token);
        }

        // هنا نوجّه حسب redirectTo الي مرّرناه (جاي إما من signup أو من login)
        navigate(redirectTo || "/login");
      } else {
        toast.error(serverMsg || t("verify.failed") || "Verification failed");
      }
    } catch (err) {
      console.error("Verify error:", err);
      if (err.response) {
        const serverMsg = extractServerMessage(err.response.data);
        toast.error(serverMsg || `${t("verify.error") || "Error"} (${err.response.status})`);
      } else {
        toast.error(err.message || t("verify.error") || "Network error");
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
          <h2 className="form-title">{t("verify.title") || "Verify code"}</h2>
          <p className="form-subtitle">
            {t("verify.subtitle") ||
              (email ? `${t("verify.sentTo") || "We sent a code to"} ${email}. ${t("verify.enterBelow") || "Enter it below."}` : t("verify.enterBelow") || "Enter the verification code you received.")}
          </p>

          <form onSubmit={handleVerify} className="auth-form">
            <input
              type="text"
              name="code"
              placeholder={t("verify.placeholder") || "Enter verification code"}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="form-input"
              required
            />

            <button type="submit" className="btn-primary auth-btn" disabled={isSubmitting}>
              {isSubmitting ? (t("verify.submitting") || "Verifying...") : (t("verify.button") || "Verify")}
            </button>
          </form>

          <p className="form-footer muted">
            {t("verify.didntReceive") || "Didn't receive the code? Check your spam folder or make sure the email is correct."}
          </p>
        </div>
      </section>

      <Footer />
      <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
}
