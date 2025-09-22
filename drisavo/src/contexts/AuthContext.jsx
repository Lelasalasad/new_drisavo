import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
/*by lelas alasad*/

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = authService.getUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            localStorage.setItem('user_data', JSON.stringify(currentUser));
          } else {
            await logout();
          }
        }
      }
    } catch (error) {
      console.error('خطأ في التحقق من حالة المصادقة:', error);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        localStorage.setItem('user_data', JSON.stringify(result.user));
        return { success: true };
      }
      return { success: false, message: result.message };
    } catch (error) {
      return { 
        success: false, 
        message: 'خطأ في تسجيل الدخول' 
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user_data');
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading,
      login, 
      logout, 
      isAdmin,
      checkAuthStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
