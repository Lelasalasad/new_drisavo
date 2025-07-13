import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Filter, Search, RefreshCw } from 'lucide-react';
import { inquiryService } from '../../services/inquiryService';
import { useTranslation } from 'react-i18next';

const InquiriesManager = () => {
  const { t } = useTranslation();
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInquiries();
  }, [filterStatus, searchTerm]);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (filterStatus) filters.status = filterStatus;
      if (searchTerm) filters.search = searchTerm;
      
      const data = await inquiryService.getInquiries(filters);
      setInquiries(data.data || []);
    } catch (error) {
      console.error(t('inquiriesManager.errorLoad'), error);
      setError(t('inquiriesManager.errorLoad'));
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      const result = await inquiryService.updateInquiry(id, { status });
      if (result.success) {
        await loadInquiries();
        setError('');
      } else {
        setError(result.message || t('inquiriesManager.errorUpdate'));
      }
    } catch (error) {
      setError(error.message || t('inquiriesManager.errorUpdate'));
    } finally {
      setUpdating(false);
    }
  };

  const deleteInquiry = async (id) => {
    if (window.confirm(t('inquiriesManager.deleteConfirm'))) {
      try {
        const result = await inquiryService.deleteInquiry(id);
        if (result.success) {
          await loadInquiries();
          setError('');
        } else {
          setError(result.message || t('inquiriesManager.errorDelete'));
        }
      } catch (error) {
        setError(error.message || t('inquiriesManager.errorDelete'));
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return { background: '#dbeafe', color: '#1e40af' };
      case 'in_progress': return { background: '#fef3c7', color: '#d97706' };
      case 'completed': return { background: '#d1fae5', color: '#065f46' };
      case 'cancelled': return { background: '#fef2f2', color: '#dc2626' };
      default: return { background: '#f3f4f6', color: '#374151' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'new': return t('inquiriesManager.statusNew');
      case 'in_progress': return t('inquiriesManager.statusInProgress');
      case 'completed': return t('inquiriesManager.statusCompleted');
      case 'cancelled': return t('inquiriesManager.statusCancelled');
      default: return status;
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">{t('inquiriesManager.pageTitle')}</h1>
          <p className="page-subtitle">{t('inquiriesManager.pageSubtitle')}</p>
        </div>
        <button
          onClick={loadInquiries}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>{t('inquiriesManager.refresh')}</span>
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

      <div className="stat-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', width: '1rem', height: '1rem', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder={t('inquiriesManager.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.5rem', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="#9ca3af" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            >
              <option value="">{t('inquiriesManager.filterAll')}</option>
              <option value="new">{t('inquiriesManager.statusNew')}</option>
              <option value="in_progress">{t('inquiriesManager.statusInProgress')}</option>
              <option value="completed">{t('inquiriesManager.statusCompleted')}</option>
              <option value="cancelled">{t('inquiriesManager.statusCancelled')}</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="stat-card">
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            {t('inquiriesManager.loading')}
          </div>
        </div>
      ) : (
        <div className="table-container">
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>{t('inquiriesManager.contactInfo')}</th>
                  <th>{t('inquiriesManager.service')}</th>
                  <th>{t('inquiriesManager.date')}</th>
                  <th>{t('inquiriesManager.status')}</th>
                  <th>{t('inquiriesManager.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.length > 0 ? inquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: '600' }}>{inquiry.name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{inquiry.email}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{inquiry.phone}</div>
                      </div>
                    </td>
<td>{inquiry.service?.title || t('inquiriesManager.generalService')}</td>
                    <td>{new Date(inquiry.created_at).toLocaleString()}</td>
                    <td>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.375rem',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        ...getStatusColor(inquiry.status)
                      }}>
                        {getStatusText(inquiry.status)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-icon"
                        title={t('inquiriesManager.detailsTitle')}
                        onClick={() => setSelectedInquiry(inquiry)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn-icon"
                        title={t('inquiriesManager.deleteConfirm')}
                        onClick={() => deleteInquiry(inquiry.id)}
                        disabled={updating}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      {t('inquiriesManager.noInquiries')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedInquiry && (
        <div
          className="modal"
          onClick={() => setSelectedInquiry(null)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', padding: '1.5rem', borderRadius: '0.5rem', maxWidth: '500px', width: '90%'
            }}
          >
            <h2>{t('inquiriesManager.detailsTitle')}</h2>
            <p><strong>{t('inquiriesManager.labelName')}:</strong> {selectedInquiry.name}</p>
            <p><strong>{t('inquiriesManager.labelEmail')}:</strong> {selectedInquiry.email}</p>
            <p><strong>{t('inquiriesManager.labelPhone')}:</strong> {selectedInquiry.phone}</p>
<p>
  <strong>{t('inquiriesManager.labelService')}:</strong>{' '}
  {selectedInquiry.service?.title || t('inquiriesManager.generalService')}
</p>
            <p><strong>{t('inquiriesManager.labelMessage')}:</strong> {selectedInquiry.message}</p>
            <p><strong>{t('inquiriesManager.labelDate')}:</strong> {new Date(selectedInquiry.created_at).toLocaleString()}</p>
            <p><strong>{t('inquiriesManager.labelStatus')}:</strong> {getStatusText(selectedInquiry.status)}</p>
            <p><strong>{t('inquiriesManager.labelNotes')}:</strong> {selectedInquiry.notes || '-'}</p>
            <button
              onClick={() => setSelectedInquiry(null)}
              className="btn-primary"
              style={{ marginTop: '1rem' }}
            >
              {t('inquiriesManager.closeBtn')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesManager;
