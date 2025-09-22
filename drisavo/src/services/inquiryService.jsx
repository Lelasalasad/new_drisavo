import api from '../config/api';
/*by lelas alasad*/

export const inquiryService = {
  async submitInquiry(payload) {
    const { data } = await api.post('/inquiries', payload);
    return data;
  },

  async getInquiries(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    try {
      const { data } = await api.get(`/admin/inquiries${params ? `?${params}` : ''}`);
      return data.success ? data.data : [];
    } catch (e) {
      console.error('Error fetching inquiries:', e);
      return [];
    }
  },

  async getInquiry(id) {
    const { data } = await api.get(`/admin/inquiries/${id}`);
    return data.success ? data.data : null;
  },

  async updateInquiry(id, payload) {
    const { data } = await api.put(`/admin/inquiries/${id}`, payload);
    return data.data;
  },

  async deleteInquiry(id) {
    await api.delete(`/admin/inquiries/${id}`);
  },

  async bulkUpdate(changes) {
    await api.post('/admin/inquiries/bulk-update', changes);
  },

  async getStatistics() {
    const { data } = await api.get('/admin/inquiries-statistics');
    return data.success ? data.data : null;
  },
};
