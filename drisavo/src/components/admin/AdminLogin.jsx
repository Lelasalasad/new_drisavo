import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
/*by lelas alasad*/

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.message || t('admin_Login.invalidCredentials'));
      }
    } catch (err) {
      setError(t('admin_Login.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <div className="login-header">
            <h1>{t('admin_Login.loading')}</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login">
      <div className="login-card">
        <div className="login-header">
          <h1>{t('admin_Login.title')}</h1>
          <p>{t('admin_Login.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">{t('admin_Login.email')}</label>
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('admin_Login.emailPlaceholder')}
              required
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">{t('admin_Login.password')}</label>
            <Lock className="input-icon" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('admin_Login.passwordPlaceholder')}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? t('admin_Login.loggingIn') : t('admin_Login.login')}
          </button>
        </form>

        <button
          type="button"
          onClick={handleBack}
          className="back-button"
          style={{ marginTop: '15px', backgroundColor: '#ccc', padding: '8px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
        >
          {t('admin_Login.back')}
        </button>

        <div className="demo-credentials" style={{ marginTop: '20px' }}>
          <p>{t('admin_Login.demo')}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
