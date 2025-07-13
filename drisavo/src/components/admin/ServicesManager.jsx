import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { serviceService } from '../../services/serviceService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

const ServicesManager = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await serviceService.getAllServices();
      setServices(data);
    } catch (error) {
      console.error(t('servicesManager.errorLoading'), error);
      setError(t('servicesManager.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService({
      ...service,
      features: service.features || []
    });
    setIsModalOpen(true);
    setError('');
  };

  const handleSave = async (updatedService) => {
    setSaving(true);
    setError('');

    try {
      let result;
      if (updatedService.id && services.find(s => s.id === updatedService.id)) {
        result = await serviceService.updateService(updatedService.id, {
          title: updatedService.title,
          description: updatedService.description,
          price: updatedService.price,
          features: updatedService.features,
          icon: updatedService.icon || 'car',
          is_active: updatedService.is_active !== false
        });
      } else {
        result = await serviceService.createService({
          title: updatedService.title,
          description: updatedService.description,
          price: updatedService.price,
          features: updatedService.features,
          icon: updatedService.icon || 'car',
          is_active: updatedService.is_active !== false
        });
      }

      if (result.success) {
        toast.success(t('servicesManager.saveSuccess'));
        await loadServices();
        setIsModalOpen(false);
        setEditingService(null);
      } else {
        setError(result.message || t('servicesManager.errorSaving'));
      }
    } catch (error) {
      console.error(t('servicesManager.errorSaving'), error);

      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError(t('servicesManager.errorSaving'));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('servicesManager.deleteConfirm'))) {
      try {
        const result = await serviceService.deleteService(id);
        if (result.success) {
          toast.success(t('servicesManager.deleteSuccess'));
          await loadServices();
        } else {
          setError(result.message || t('servicesManager.errorDeleting'));
        }
      } catch (error) {
        setError(error.message || t('servicesManager.errorDeleting'));
      }
    }
  };

  const toggleActive = async (id) => {
    try {
      const result = await serviceService.toggleServiceStatus(id);
      if (result.success) {
        toast.success(t('servicesManager.toggleSuccess'));
        await loadServices();
      } else {
        setError(result.message || t('servicesManager.errorToggle'));
      }
    } catch (error) {
      setError(error.message || t('servicesManager.errorToggle'));
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">{t('servicesManager.pageTitle')}</h1>
          <p className="page-subtitle">{t('servicesManager.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">{t('servicesManager.pageTitle')}</h1>
          <p className="page-subtitle">{t('servicesManager.pageSubtitle')}</p>
        </div>
        <button
          onClick={() => {
            setEditingService({
              id: null,
              title: '',
              description: '',
              price: '',
              features: [],
              icon: 'car',
              is_active: true
            });
            setIsModalOpen(true);
            setError('');
          }}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={16} />
          <span>{t('servicesManager.addService')}</span>
        </button>
      </div>

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1rem',
          color: '#dc2626'
        }}>
          {error}
        </div>
      )}

      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3 className="service-title">{service.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={service.is_active}
                    onChange={() => toggleActive(service.id)}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    width: '2.75rem',
                    height: '1.5rem',
                    background: service.is_active ? '#1e40af' : '#d1d5db',
                    borderRadius: '9999px',
                    position: 'relative',
                    transition: 'background 0.3s'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: service.is_active ? '1.25rem' : '2px',
                      width: '1.25rem',
                      height: '1.25rem',
                      background: 'white',
                      borderRadius: '50%',
                      transition: 'left 0.3s'
                    }} />
                  </div>
                </label>
                {service.is_active ? <Eye size={16} color="#10b981" title={t('servicesManager.active')} /> : <EyeOff size={16} color="#6b7280" title={t('servicesManager.inactive')} />}
              </div>
            </div>

            <p className="service-description">{service.description}</p>
            <p className="service-price">{t('servicesManager.priceLabel')} {service.price}</p>

            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>{t('servicesManager.featuresLabel')}</h4>
              <ul className="service-features">
                {service.features && service.features.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                className="btn-icon"
                title={t('servicesManager.edit')}
                onClick={() => handleEdit(service)}
              >
                <Edit2 size={16} />
              </button>
              <button
                className="btn-icon btn-danger"
                title={t('servicesManager.delete')}
                onClick={() => handleDelete(service.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingService && (
        <ServiceModal
          service={editingService}
          onClose={() => {
            setIsModalOpen(false);
            setEditingService(null);
            setError('');
          }}
          onSave={handleSave}
          saving={saving}
          error={error}
          t={t}
        />
      )}
    </div>
  );
};

const ServiceModal = ({ service, onClose, onSave, saving, error, t }) => {
  const [title, setTitle] = useState(service.title || '');
  const [description, setDescription] = useState(service.description || '');
  const [price, setPrice] = useState(service.price || '');
  const [featuresText, setFeaturesText] = useState(service.features ? service.features.join('\n') : '');
  const [icon, setIcon] = useState(service.icon || 'car');
  const [isActive, setIsActive] = useState(service.is_active !== false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...service,
      title,
      description,
      price,
      features: featuresText.split('\n').map(f => f.trim()).filter(f => f !== ''),
      icon,
      is_active: isActive
    });
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="modal" style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        width: '400px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2>{service.id ? t('servicesManager.editService') : t('servicesManager.addNewService')}</h2>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1rem',
            color: '#dc2626'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('servicesManager.title')}</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label>{t('servicesManager.description')}</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label>{t('servicesManager.price')}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label>{t('servicesManager.features')}</label>
            <textarea
              value={featuresText}
              onChange={e => setFeaturesText(e.target.value)}
              placeholder={t('servicesManager.features')}
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label>{t('servicesManager.icon')}</label>
            <input
              type="text"
              value={icon}
              onChange={e => setIcon(e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>
              <input
                type="checkbox"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                disabled={saving}
              />
              {' '}
              {t('servicesManager.active')}
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" onClick={onClose} disabled={saving}>
              {t('servicesManager.cancel')}
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? t('servicesManager.saving') : t('servicesManager.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicesManager;
