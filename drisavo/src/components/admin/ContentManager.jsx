import React, { useState, useEffect } from "react";
import { Save, Edit2, Trash2, RefreshCw, Plus } from "lucide-react";
import { contentService } from "../../services/contentService";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContentManager = () => {
  const { t } = useTranslation();
  const [contents, setContents] = useState([]);
  const [editingContent, setEditingContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
  try {
    setLoading(true);
    const data = await contentService.getAllContent();
    console.log(data); // تحقق من البيانات هنا
    if (data && Array.isArray(data)) {
      setContents(data);
    } else {
      throw new Error("Invalid data format");
    }
  } catch (error) {
    console.error(t("contentManager.loadError"), error);
    setError(t("contentManager.loadFail") + ": " + error.message);
    toast.error(t("contentManager.loadFail") + ": " + error.message);
  } finally {
    setLoading(false);
  }
};

  const handleAdd = () => {
    setEditingContent({
      id: null,
      title: "",
      content: {
        type: "offer",
        price: "",
        original_price: "",
        details: [],
        text: "",
        author: "",
        date: "",
        image: "",
      },
      type: "offer",
      is_active: true,
    });
    setIsModalOpen(true);
    setError("");
    setSuccess("");
  };

  const handleEdit = (content) => {
  setEditingContent({
    ...content,
    content: {
      type: content.type,
      price: content.content?.price || "",
      original_price: content.content?.original_price || "",
      details: Array.isArray(content.content?.details) ? content.content.details : [],
      text: content.content?.text || "",
      author: content.content?.author || "",
      date: content.content?.date || "",
      image: content.content?.image || "",
    },
  });

  // افتح المودال بعد إعداد البيانات
  setIsModalOpen(true);
};

  const handleDelete = async (id) => {
    if (window.confirm(t("contentManager.deleteConfirm"))) {
      try {
        await contentService.deleteContent(id);
        toast.success(t("contentManager.deleteSuccess"));
        await loadContent();
      } catch (error) {
        console.error(t("contentManager.deleteError"), error);
        setError(error.message || t("contentManager.deleteFail"));
        toast.error(error.message || t("contentManager.deleteFail"));
      }
    }
  };

  const handleSave = async (updatedContent) => {
    setSaving(true);
    setError("");

    try {
      const payload = {
              key: updatedContent.key || updatedContent.title.toLowerCase().replace(/\s+/g, "_"),
        title: updatedContent.title,
        content: updatedContent.content,
        type: updatedContent.type,
        is_active: updatedContent.is_active !== false,
      };
console.log("Payload to send:", payload);
      const result = updatedContent.id
        ? await contentService.updateContent(updatedContent.id, payload)
        : await contentService.createContent(payload);

      if (result.success) {
        await loadContent();
        setIsModalOpen(false);
        setEditingContent(null);
        setSuccess(t("contentManager.updateSuccess"));
        toast.success(t("contentManager.updateSuccess"));
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.message || t("contentManager.saveFail"));
        toast.error(result.message || t("contentManager.saveFail"));
      }
    } catch (error) {
      setError(error.message || t("contentManager.saveFail"));
      toast.error(error.message || t("contentManager.saveFail"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">{t("contentManager.title")}</h1>
          <p className="page-subtitle">{t("contentManager.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 className="page-title">{t("contentManager.title")}</h1>
          <p className="page-subtitle">{t("contentManager.subtitle")}</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={loadContent}
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>{t("contentManager.refresh")}</span>
          </button>
          <button
            onClick={handleAdd}
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            disabled={loading}
          >
            <Plus size={16} />
            <span>{t("contentManager.addContent")}</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginBottom: "1rem",
            color: "#dc2626",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            background: "#d1fae5",
            border: "1px solid #a7f3d0",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginBottom: "1rem",
            color: "#065f46",
          }}
        >
          {success}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {contents.map((content) => (
          <div key={content.id} className="stat-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                {content.title}
              </h3>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => handleEdit(content)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#1e40af",
                    cursor: "pointer",
                  }}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(content.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#dc2626",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.25rem",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  background: content.type === "offer" ? "#dbeafe" : "#fef3c7",
                  color: content.type === "offer" ? "#1e40af" : "#d97706",
                }}
              >
                {content.type === "offer"
                  ? t("contentManager.types.offer")
                  : t("contentManager.types.review")}
              </span>
            </div>

            <div style={{ color: "#6b7280" }}>
              {content.type === "offer" ? (
                <>
                  <p>
                    <strong>{t("contentManager.fields.price")}:</strong>{" "}
                    {content.content?.price || "-"}
                  </p>
                  <p>
                    <strong>{t("contentManager.fields.originalPrice")}:</strong>{" "}
                    {content.content?.original_price || "-"}
                  </p>
                  <p>
                    <strong>{t("contentManager.fields.details")}:</strong>
                  </p>
                  <ul style={{ marginLeft: "1.5rem", listStyle: "disc" }}>
                    {content.content?.details &&
                    content.content.details.length > 0 ? (
                      content.content.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))
                    ) : (
                      <li>{t("contentManager.noDetails")}</li>
                    )}
                  </ul>
                </>
              ) : (
                <>
                  <p>
                    <strong>{t("contentManager.fields.text")}:</strong>
                    {content.content?.text?.substring(0, 100) +
                      (content.content?.text?.length > 100 ? "..." : "") || "-"}
                  </p>
                  <p>
                    <strong>{t("contentManager.fields.author")}:</strong>{" "}
                    {content.content?.author || "-"}
                  </p>
                  <p>
                    <strong>{t("contentManager.fields.date")}:</strong>{" "}
                    {content.content?.date || "-"}
                  </p>
                  <p>
                    <strong>{t("contentManager.fields.image")}:</strong>{" "}
                    {content.content?.image || "-"}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingContent && (
        <ContentModal
          content={editingContent}
          onClose={() => {
            setIsModalOpen(false);
            setEditingContent(null);
            setError("");
          }}
          onSave={handleSave}
          saving={saving}
          error={error}
          t={t}
        />
      )}
    </div>
  );
};

const ContentModal = ({ content, onClose, onSave, saving, error, t }) => {
  const [title, setTitle] = useState(content.title || "");
  const [type, setType] = useState(content.type || "offer");
  const [isActive, setIsActive] = useState(content.is_active !== false);
  const [price, setPrice] = useState(content.content.price || "");
  const [originalPrice, setOriginalPrice] = useState(
    content.content.original_price || ""
  );
  const [detailsText, setDetailsText] = useState(
    content.content.details?.join("\n") || ""
  );
  const [text, setText] = useState(content.content.text || "");
  const [author, setAuthor] = useState(content.content.author || "");
  const [date, setDate] = useState(content.content.date || "");
  const [image, setImage] = useState(content.content.image || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      setError(t("contentManager.titleRequired"));
      toast.error(t("contentManager.titleRequired"));
      return;
    }
    if (type === "offer" && !price) {
      setError(t("contentManager.priceRequired"));
      toast.error(t("contentManager.priceRequired"));
      return;
    }
    if (type === "review" && (!text || !author || !date)) {
      setError(t("contentManager.reviewFieldsRequired"));
      toast.error(t("contentManager.reviewFieldsRequired"));
      return;
    }

    onSave({
      ...content,
      title,
      content: {
        type,
        price: type === "offer" ? price : "",
        original_price: type === "offer" ? originalPrice : "",
        details:
          type === "offer"
            ? detailsText
                .split("\n")
                .map((d) => d.trim())
                .filter((d) => d !== "")
            : [],
        text: type === "review" ? text : "",
        author: type === "review" ? author : "",
        date: type === "review" ? date : "",
        image: type === "review" ? image : "",
      },
      type,
      is_active: isActive,
    });
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal"
        style={{
          backgroundColor: "white",
          borderRadius: "0.5rem",
          padding: "1.5rem",
          width: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2>
          {content.id
            ? t("contentManager.editTitle")
            : t("contentManager.addTitle")}
        </h2>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "0.5rem",
              padding: "0.75rem",
              marginBottom: "1rem",
              color: "#dc2626",
              fontSize: "0.875rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t("contentManager.fields.title")}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label>{t("contentManager.fields.type")}</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={saving}
            >
              <option value="offer">{t("contentManager.types.offer")}</option>
              <option value="review">{t("contentManager.types.review")}</option>
            </select>
          </div>

          {type === "offer" && (
            <>
              <div className="form-group">
                <label>{t("contentManager.fields.price")}</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  disabled={saving}
                />
              </div>
              <div className="form-group">
                <label>{t("contentManager.fields.originalPrice")}</label>
                <input
                  type="text"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="form-group">
                <label>{t("contentManager.fields.details")}</label>
                <textarea
                  value={detailsText}
                  onChange={(e) => setDetailsText(e.target.value)}
                  rows={4}
                  placeholder={t("contentManager.detailsPlaceholder")}
                  disabled={saving}
                />
              </div>
            </>
          )}

          {type === "review" && (
            <>
              <div className="form-group">
                <label>{t("contentManager.fields.text")}</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  required
                  disabled={saving}
                />
              </div>
              <div className="form-group">
                <label>{t("contentManager.fields.author")}</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  disabled={saving}
                />
              </div>
              <div className="form-group">
                <label>{t("contentManager.fields.date")}</label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  disabled={saving}
                />
              </div>
              <div className="form-group">
                <label>{t("contentManager.fields.image")}</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  disabled={saving}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={saving}
              />
              {t("contentManager.fields.active")}
            </label>
          </div>

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="btn-cancel"
            >
              {t("contentManager.cancel")}
            </button>
            <button type="submit" disabled={saving} className="btn-save">
              <Save size={16} />
              <span>
                {saving
                  ? t("contentManager.saving")
                  : t("contentManager.saveChanges")}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentManager;
