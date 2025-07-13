import api from '../config/api';

export const serviceService = {
  async getServices() {
    try {
      const { data } = await api.get('/services?active=1');
      return data.success ? data.data : [];
    } catch (e) {
      console.error('Error fetching services:', e);
      return [];
    }
  },

  async getService(id) {
    try {
      const { data } = await api.get(`/services/${id}`);
      return data.success ? data.data : null;
    } catch (e) {
      console.error('Error fetching service:', e);
      return null;
    }
  },

  async getAllServices() {
    try {
      const { data } = await api.get('/admin/services');
      return data.success ? data.data : [];
    } catch (e) {
      console.error('Error fetching all services:', e);
      return [];
    }
  },

  async createService(payload) {
    const { data } = await api.post('/admin/services', payload);
    return data.data;
  },

  async updateService(id, payload) {
    const { data } = await api.put(`/admin/services/${id}`, payload);
    return data.data;
  },

  async deleteService(id) {
    await api.delete(`/admin/services/${id}`);
  },

  async toggleServiceStatus(id) {
    await api.post(`/admin/services/${id}/toggle-active`);
  },

  async updateOrder(orderArray) {
    await api.post('/admin/services/update-order', { order: orderArray });
  },
};
