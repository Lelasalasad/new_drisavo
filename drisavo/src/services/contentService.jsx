// services/contentService.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.drisavo.ca/api/api/v1",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// interceptor لإضافة التوكن قبل كل طلب
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const contentService = {
  async getAllContent() {
    const { data } = await api.get("/admin/content");
    return data.success ? data.data : [];
  },
 async getOffers() {
    const all = await this.getAllContent();
    return all.filter(item => item.type === "offer"); // فلترة حسب نوع المحتوى
  },
  async addContent(payload) {
    const { data } = await api.post("/admin/content", payload);
    return data;
  },

  async updateContent(id, payload) {
    const { data } = await api.put(`/admin/content/${id}`, payload);
    return data;
  },

  async deleteContent(id) {
    const { data } = await api.delete(`/admin/content/${id}`);
    return data;
  },
};
