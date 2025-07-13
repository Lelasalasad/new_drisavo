import api from '../config/api';

export const contentService = {
  async getPublicContent() {
    const { data } = await api.get('/content/public');
    return data.success ? data.data : {};
  },

  async getContentByKey(key) {
    const { data } = await api.get(`/content/${key}`);
    return data.success ? data.data : null;
  },

  async getAllContent() {
    const { data } = await api.get('/admin/content');
    return data.success ? data.data : [];
  },

  async updateContent(id, payload) {
    const { data } = await api.put(`/admin/content/${id}`, payload);
    return data.data;
  },

  async updateContentByKey(key, payload) {
    const { data } = await api.put(`/admin/content/key/${key}`, { content: payload });
    return data.data;
  },

  async createContent(payload) {
    const { data } = await api.post('/admin/content', payload);
    return data.data;
  },

  async deleteContent(id) {
    await api.delete(`/admin/content/${id}`);
  },

  async bulkUpdate(items) {
    await api.post('/admin/content/bulk-update', items);
  },
};
