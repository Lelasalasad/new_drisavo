import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "https://api.drisavo.ca/api/api";

export default function SignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fName: "",
    lName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    type: "student", // student | teacher | company
    phoneNumber: "",
    birthday: "",
    latitude: "",
    longitude: "",
    city: "", // ✅ أضفنا city
  });

  const [loading, setLoading] = useState(false);
  const [isPicking, setIsPicking] = useState(false);

  useEffect(() => {
    window.setPickedLocation = (lat, lng) => {
      setForm((s) => ({
        ...s,
        latitude: lat?.toString() || "",
        longitude: lng?.toString() || "",
      }));
      toast.success(t("signup.locationPicked") || "Location picked");
    };
    return () => {
      try {
        delete window.setPickedLocation;
      } catch {}
    };
  }, [t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const pickMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error(t("signup.geolocationNotSupported") || "Geolocation not supported");
      return;
    }
    setIsPicking(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((s) => ({
          ...s,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString(),
        }));
        setIsPicking(false);
        toast.success(t("signup.locationPicked") || "Location picked");
      },
      (err) => {
        setIsPicking(false);
        toast.error(err.message || t("signup.locationError") || "Could not get location");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

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

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.fName || !form.lName) {
      toast.error("Please enter your name");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error(t("signup.passwordMismatch") || "Passwords do not match");
      return;
    }
    if (!form.latitude || !form.longitude) {
      toast.error(t("signup.coordsRequired") || "Please pick a location (latitude & longitude required).");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("fName", form.fName.trim());
      fd.append("lName", form.lName.trim());
      fd.append("email", form.email.trim());
      fd.append("password", form.password);
      fd.append("gender", form.gender);
      fd.append("type", form.type);
      fd.append("phoneNumber", form.phoneNumber.trim());
      if (form.birthday) fd.append("birthday", `${form.birthday} 00:00:00`);
      fd.append("latitude", form.latitude);
      fd.append("longitude", form.longitude);
      fd.append("city", form.city.trim()); // ✅ أرسلنا city مع الطلب

      const resp = await axios.post(`${API_BASE}/userSignUp`, fd);

      const serverMsg = extractServerMessage(resp.data);
      if (resp.status >= 200 && resp.status < 300) {
        toast.success(serverMsg || t("signup.success") || "Signed up successfully");
        navigate("/verify", { state: { email: form.email, redirectTo: "/login" } });
      } else {
        toast.error(serverMsg || t("signup.failed") || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response) {
        const serverMsg = extractServerMessage(err.response.data);
        toast.error(serverMsg || `Error ${err.response.status}`);
      } else {
        toast.error(err.message || "Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <section className="auth-section">
        <div className="auth-wrapper">
          <h2 className="form-title">{t("signup.title") || "Sign up"}</h2>

          <form onSubmit={handleSignup} className="auth-form" encType="multipart/form-data">
            <div className="two-columns">
              <input
                name="fName"
                placeholder={t("signup.firstName") || "First name"}
                onChange={handleChange}
                required
                className="form-input"
                value={form.fName}
              />
              <input
                name="lName"
                placeholder={t("signup.lastName") || "Last name"}
                onChange={handleChange}
                required
                className="form-input"
                value={form.lName}
              />
            </div>

            <input
              name="email"
              type="email"
              placeholder={t("signup.email") || "Email"}
              onChange={handleChange}
              required
              className="form-input"
              value={form.email}
            />

            <input
              name="password"
              type="password"
              placeholder={t("signup.password") || "Password"}
              onChange={handleChange}
              required
              className="form-input"
              value={form.password}
            />

            <input
              name="confirmPassword"
              type="password"
              placeholder={t("signup.confirmPassword") || "Confirm Password"}
              onChange={handleChange}
              required
              className="form-input"
              value={form.confirmPassword}
            />

            <select name="gender" onChange={handleChange} className="form-input" required value={form.gender}>
              <option value="">{t("signup.selectGender") || "Select gender"}</option>
              <option value="male">{t("signup.male") || "Male"}</option>
              <option value="female">{t("signup.female") || "Female"}</option>
            </select>

            <select name="type" onChange={handleChange} className="form-input" required value={form.type}>
              <option value="student">{t("signup.type.student") || "Student"}</option>
              <option value="teacher">{t("signup.type.teacher") || "Teacher"}</option>
              <option value="company">{t("signup.type.company") || "Company"}</option>
            </select>

            <input
              name="phoneNumber"
              placeholder={t("signup.phone") || "Phone number"}
              onChange={handleChange}
              required
              className="form-input"
              value={form.phoneNumber}
            />

            <input name="birthday" type="date" onChange={handleChange} className="form-input" value={form.birthday} />

            {/* ✅ حقل المدينة */}
            <input
              name="city"
              placeholder={t("signup.city") || "City"}
              onChange={handleChange}
              required
              className="form-input"
              value={form.city}
            />

            <label className="label">{t("signup.location") || "Location"}</label>
            <div className="location-row" style={{ gap: 8, alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <input
                  name="latitude"
                  placeholder="Latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  className="form-input"
                />
                <input
                  name="longitude"
                  placeholder="Longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button type="button" onClick={pickMyLocation} className="btn-primary" disabled={isPicking}>
                  {isPicking ? "Picking..." : "Use my location"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toast.info("Open map and pick a point; then call window.setPickedLocation(lat,lng)");
                  }}
                  className="btn-secondary"
                >
                  Pick on map
                </button>
              </div>
            </div>

            <small className="muted">
              {form.latitude && form.longitude ? `Coords: ${form.latitude}, ${form.longitude}` : "No coordinates selected"}
            </small>

            <button type="submit" className="btn-primary auth-btn" disabled={loading}>
              {loading ? "Submitting..." : t("signup.button") || "Sign up"}
            </button>
          </form>

          <p className="form-footer">
            {t("login.alreadyAccount") || "Already have an account?"}{" "}
            <Link to="/login" className="form-link">
              {t("login.loginLink") || "Log in"}
            </Link>
          </p>
        </div>
      </section>

      <Footer />
      <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
}
