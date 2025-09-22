
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CitiesManager = () => {
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    email: '',
    phone: '',
    description: '',
    details: '',
    map_link: '',
    images: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = 'https://api.drisavo.ca/api/api/v1';

  // مدينة افتراضية
  const defaultCity = {
    id: 'default',
    name: 'مدينة افتراضية',
    slug: 'default-city',
    email: 'info@defaultcity.com',
    phone: '+1234567890',
    description: 'هذه مدينة افتراضية تُعرض عند فشل جلب المدن من الـ API.',
    details: 'تفاصيل إضافية عن المدينة الافتراضية: مكان رائع للزيارة!',
    map_link: 'https://share.google/f85ytfhgoqq35EbER',
    images: ['https://example.com/default-city-image.jpg'],
  };

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/cities`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch cities: ${response.status}`);
      }
      const data = await response.json();
      const citiesArray = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      setCities(citiesArray.length > 0 ? citiesArray : [defaultCity]);
    } catch (err) {
      console.error('Error fetching cities:', err);
      setError('فشل في جلب المدن: ' + err.message);
      setCities([defaultCity]);
      toast.error('فشل في جلب المدن: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  // تحقق بسيط قبل الإرسال
  if (!form.name) {
    setError("حقل اسم المدينة مطلوب");
    toast.error("حقل اسم المدينة مطلوب");
    setLoading(false);
    return;
  }
  if (!form.slug) {
    setError("حقل Slug مطلوب");
    toast.error("حقل Slug مطلوب");
    setLoading(false);
    return;
  }

  const method = editingId ? "PUT" : "POST";
  const url = editingId
    ? `${API_BASE_URL}/admin/cities/${editingId}`
    : `${API_BASE_URL}/admin/cities`;

  // اجعل الصور مصفوفة روابط أو ملفات حسب حالتك
  const payload = {
    ...form,
    images: Array.isArray(form.images) ? form.images : [],
  };

  console.log("[CitiesManager] Sending payload:", method, url, payload);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}` || "",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    // لو الاستجابة ناجحة
    if (response.ok) {
      const data = await response.json().catch(() => null);
      console.log("Save success response:", response.status, data);
      await fetchCities();
      setForm({
        name: "",
        slug: "",
        email: "",
        phone: "",
        description: "",
        details: "",
        map_link: "",
        images: [],
      });
      setEditingId(null);
      toast.success(editingId ? "تم تعديل المدينة بنجاح" : "تم إضافة المدينة بنجاح");
      setLoading(false);
      return;
    }

    // لو هنا غير ok -> حاول نقرأ JSON أولاً، وإلا اقرأ النص الخام
    let errMsg = `Failed to save city: ${response.status} ${response.statusText}`;
    try {
      const json = await response.json();
      // إذا الbackend يرسل errors أو message
      if (json) {
        errMsg = json.message || JSON.stringify(json) || errMsg;
      }
    } catch (parseErr) {
      // لم يتمكّن من parse JSON -> اقرأ النص الخام
      const text = await response.text();
      errMsg = text || errMsg;
    }

    console.error("[CitiesManager] Server responded with error:", response.status, errMsg);
    setError(errMsg);
    toast.error(errMsg);
  } catch (err) {
    console.error("[CitiesManager] Network or client error:", err);
    setError("خطأ بالشبكة أو بالعميل: " + (err.message || err));
    toast.error("خطأ بالشبكة أو بالعميل: " + (err.message || err));
  } finally {
    setLoading(false);
  }
};


  const handleEdit = (city) => {
    setForm({
      ...city,
      images: Array.isArray(city.images) ? city.images : [],
    });
    setEditingId(city.id);
    setError('');
  };

  const handleDelete = async (id) => {
    if (id === 'default') return;
    if (!window.confirm('هل أنت متأكد من الحذف؟')) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/cities/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete city: ${response.status}`);
      }
      fetchCities();
      toast.success('تم حذف المدينة بنجاح');
    } catch (err) {
      console.error('Error deleting city:', err);
      setError('فشل في حذف المدينة: ' + err.message);
      toast.error('فشل في حذف المدينة: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cities-manager">
      <h2>إدارة المدن</h2>
      {error && <p className="error-text">{error}</p>}
      {loading && <p>جاري التحميل...</p>}
      <form onSubmit={handleSubmit} className="city-form">
        <input
          placeholder="اسم المدينة"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          disabled={loading}
        />
        <input
          placeholder="Slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          required
          disabled={loading}
        />
        <input
          placeholder="البريد الإلكتروني"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          type="email"
          disabled={loading}
        />
        <input
          placeholder="رقم الهاتف"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          type="tel"
          disabled={loading}
        />
        <textarea
          placeholder="الوصف"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          disabled={loading}
        />
        <textarea
          placeholder="التفاصيل"
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })}
          disabled={loading}
        />
        <input
          placeholder="رابط الخريطة"
          value={form.map_link}
          onChange={(e) => setForm({ ...form, map_link: e.target.value })}
          disabled={loading}
        />
        <input
          placeholder="روابط الصور (مفصولة بفواصل)"
          value={form.images.join(',')}
          onChange={(e) => setForm({ ...form, images: e.target.value.split(',').map(img => img.trim()).filter(img => img) })}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'جاري الحفظ...' : editingId ? 'تعديل المدينة' : 'إضافة مدينة'}
        </button>
      </form>

      <h3>جميع المدن</h3>
      {loading && <p>جاري تحميل المدن...</p>}
      <ul className="cities-list">
        {cities.length > 0 ? (
          cities.map((c) => (
            <li key={c.id} className="city-item">
              {c.name} ({c.slug})
              <button
                onClick={() => handleEdit(c)}
                className="edit-btn"
                disabled={loading || c.id === 'default'}
              >
                تعديل
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="delete-btn"
                disabled={loading || c.id === 'default'}
              >
                حذف
              </button>
            </li>
          ))
        ) : (
          <p>لا توجد مدن متاحة.</p>
        )}
      </ul>
      <ToastContainer />
    </div>
  );
};

export default CitiesManager;