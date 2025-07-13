import api from '../config/api';

export const authService = {
  async login(email, password) {
    try {
      const { data } = await api.post('/login', { email, password });
      if (data.success) {
        const { token, user } = data.data;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        return { success: true, user, token };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login error',
      };
    }
  },

  async logout() {
    try {
      await api.post('/logout');
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  },

  async getCurrentUser() {
    try {
      const { data } = await api.get('/user');
      return data.success ? data.data : null;
    } catch (e) {
      console.error('Fetch user error:', e);
      return null;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  getUser() {
    const user = localStorage.getItem('user_data');
    return user ? JSON.parse(user) : null;
  },
};
