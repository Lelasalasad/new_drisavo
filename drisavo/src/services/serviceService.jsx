
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
    try {
      const { data } = await api.post('/admin/services', payload);
      return { success: true, data: data.data };
    } catch (e) {
      console.error('Error creating service:', e);
      if (e.response?.data?.errors) {
        throw new Error(Object.values(e.response.data.errors).flat().join(', '));
      }
      throw new Error(e.response?.data?.message || 'Failed to create service');
    }
  },

  async updateService(id, payload) {
    try {
      const { data } = await api.put(`/admin/services/${id}`, payload);
      return { success: true, data: data.data };
    } catch (e) {
      console.error('Error updating service:', e);
      if (e.response?.data?.errors) {
        throw new Error(Object.values(e.response.data.errors).flat().join(', '));
      }
      throw new Error(e.response?.data?.message || 'Failed to update service');
    }
  },

  async deleteService(id) {
    try {
      await api.delete(`/admin/services/${id}`);
      return { success: true };
    } catch (e) {
      console.error('Error deleting service:', e);
      throw new Error(e.response?.data?.message || 'Failed to delete service');
    }
  },

  async toggleServiceStatus(id) {
    try {
      await api.post(`/admin/services/${id}/toggle-active`);
      return { success: true };
    } catch (e) {
      console.error('Error toggling service status:', e);
      throw new Error(e.response?.data?.message || 'Failed to toggle service status');
    }
  },

  async updateOrder(orderArray) {
    try {
      await api.post('/admin/services/update-order', { order: orderArray });
      return { success: true };
    } catch (e) {
      console.error('Error updating service order:', e);
      throw new Error(e.response?.data?.message || 'Failed to update service order');
    }
  },
};
