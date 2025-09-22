// src/components/admin/AdminAddPartner.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// API base
const API_BASE = (
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE) ||
  (typeof window !== "undefined" && window.__REACT_APP_API_BASE) ||
  "https://api.drisavo.ca/api/api"
);

const api = axios.create({ baseURL: API_BASE, timeout: 10000 });

const AdminAddPartner = () => {
  const [newPartner, setNewPartner] = useState({
    name: "",
    logoFile: null,
    logoPreview: null,
    description: "",
    contact_email: "",
    discount_code: "",
    discount_amount: "", // ✅ كمية الحسم
    account_id: "",
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setNewPartner((p) => ({ ...p, logoFile: file, logoPreview: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("name", newPartner.name);
      fd.append("logo", newPartner.logoFile);
      fd.append("description", newPartner.description || "");
      fd.append("contact_email", newPartner.contact_email || "");
      fd.append("discount_code", newPartner.discount_code || "");
      fd.append("discount_amount", newPartner.discount_amount || ""); // ✅ إرسال كمية الحسم
      fd.append("account_id", newPartner.account_id || "");

      await api.post("/partners", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });

      toast.success("✅ تمت إضافة الشريك بنجاح");
      setNewPartner({
        name: "",
        logoFile: null,
        logoPreview: null,
        description: "",
        contact_email: "",
        discount_code: "",
        discount_amount: "",
        account_id: "",
      });
    } catch (err) {
      toast.error("❌ فشل في إضافة الشريك");
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "30px auto", padding: 20 }}>
      <h2>إضافة شريك جديد</h2>
      <form onSubmit={handleAddPartner} className="partner-form">
        <div className="form-group">
          <label>اسم الشريك</label>
          <input
            type="text"
            value={newPartner.name}
            onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>شعار الشريك</label>
          <input type="file" accept="image/*" onChange={handleLogoChange} />
          {newPartner.logoPreview && (
            <img src={newPartner.logoPreview} alt="preview" style={{ maxWidth: "120px", marginTop: 10 }} />
          )}
        </div>

        <div className="form-group">
          <label>الوصف</label>
          <textarea
            value={newPartner.description}
            onChange={(e) => setNewPartner({ ...newPartner, description: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>البريد الإلكتروني</label>
          <input
            type="email"
            value={newPartner.contact_email}
            onChange={(e) => setNewPartner({ ...newPartner, contact_email: e.target.value })}
          />
        </div>

        {/* ✅ كود الخصم + كمية الحسم جنب بعض */}
        <div style={{ display: "flex", gap: "20px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>كود الخصم</label>
            <input
              type="text"
              value={newPartner.discount_code}
              onChange={(e) => setNewPartner({ ...newPartner, discount_code: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>كمية الحسم</label>
            <input
              type="number"
              min="0"
              value={newPartner.discount_amount}
              onChange={(e) => setNewPartner({ ...newPartner, discount_amount: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>رقم الحساب</label>
          <input
            type="text"
            value={newPartner.account_id}
            onChange={(e) => setNewPartner({ ...newPartner, account_id: e.target.value })}
          />
        </div>

        {submitting && (
          <div style={{ margin: "10px 0" }}>
            <div style={{ height: 8, background: "#eee", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ width: `${uploadProgress}%`, height: "100%", background: "#667eea" }} />
            </div>
            <small>{uploadProgress}%</small>
          </div>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "جارٍ الإضافة..." : "إضافة الشريك"}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};

export default AdminAddPartner;
