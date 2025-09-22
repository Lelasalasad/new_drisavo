import api from '../config/api';
/*by lelas alasad*/

export const dashboardService = {
  async getDashboardStats() {
    try {
      const { data } = await api.get('/admin/dashboard');
      return data.success ? data.data : null;
    } catch (e) {
      // اطبعي كامل الجسم والـ headers
      console.error('Dashboard stats error status:', e.response?.status);
      console.error('Dashboard stats error data:', e.response?.data);
      throw e;
    }
  },
  async getQuickStats() {
    try {
      const { data } = await api.get('/admin/dashboard/quick-stats');
      return data.success ? data.data : [];
    } catch (e) {
      console.error('Quick stats error status:', e.response?.status);
      console.error('Quick stats error data:', e.response?.data);
      throw e;
    }
  },
  async getSystemHealth() {
    try {
      const { data } = await api.get('/admin/dashboard/system-health');
      return data.success ? data.data : null;
    } catch (e) {
      console.error('System health error status:', e.response?.status);
      console.error('System health error data:', e.response?.data);
      throw e;
    }
  },
};
