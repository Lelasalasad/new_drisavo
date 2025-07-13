import React, { useState, useEffect } from 'react';
import { Save, Edit2, RefreshCw } from 'lucide-react';
import { contentService } from '../../services/contentService';
import { useTranslation } from 'react-i18next';

const ContentManager = () => {
  const { t } = useTranslation();

  const [contents, setContents] = useState([]);
  const [editingContent, setEditingContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await contentService.getAllContent();
      setContents(data);
    } catch (error) {
      console.error(t('contentManager.loadError'), error);
      setError(t('contentManager.loadFail'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (content) => {
    setEditingContent({ ...content });
    setError('');
    setSuccess('');
  };

  const handleSave = async (updatedContent) => {
    setSaving(true);
    setError('');

    try {
      const result = await contentService.updateContent(updatedContent.id, {
        title: updatedContent.title,
        content: updatedContent.content,
        type: updatedContent.type,
        is_active: updatedContent.is_active !== false
      });

      if (result.success) {
        await loadContent();
        setEditingContent(null);
        setSuccess(t('contentManager.updateSuccess'));
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || t('contentManager.saveFail'));
      }
    } catch (error) {
      setError(error.message || t('contentManager.saveFail'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingContent(null);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">{t('contentManager.title')}</h1>
          <p className="page-subtitle">{t('contentManager.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">{t('contentManager.title')}</h1>
          <p className="page-subtitle">{t('contentManager.subtitle')}</p>
        </div>
        <button
          onClick={loadContent}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>{t('contentManager.refresh')}</span>
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

      {success && (
        <div style={{
          background: '#d1fae5',
          border: '1px solid #a7f3d0',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1rem',
          color: '#065f46'
        }}>
          {success}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {contents.map((content) => (
          <div key={content.id} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>{content.title}</h3>
              <button
                onClick={() => handleEdit(content)}
                style={{ background: 'none', border: 'none', color: '#1e40af', cursor: 'pointer' }}
              >
                <Edit2 size={16} />
              </button>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                background: content.type === 'text' ? '#dbeafe' : 
                           content.type === 'html' ? '#fef3c7' : '#d1fae5',
                color: content.type === 'text' ? '#1e40af' : 
                       content.type === 'html' ? '#d97706' : '#065f46'
              }}>
                {content.type === 'text' ? t('contentManager.types.text') : 
                 content.type === 'html' ? t('contentManager.types.html') : 
                 content.type === 'image' ? t('contentManager.types.image') : t('contentManager.types.json')}
              </span>
            </div>
            
            <div style={{ color: '#6b7280' }}>
              {content.type === 'text' ? (
                <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {content.content.length > 150 
                    ? content.content.substring(0, 150) + '...' 
                    : content.content}
                </p>
              ) : content.type === 'html' ? (
                <div style={{ fontSize: '0.875rem', fontFamily: 'monospace', background: '#f9fafb', padding: '0.5rem', borderRadius: '0.25rem' }}>
                  {content.content.length > 100 
                    ? content.content.substring(0, 100) + '...' 
                    : content.content}
                </div>
              ) : (
                <p style={{ wordBreak: 'break-all' }}>
                  {content.content.length > 100 
                    ? content.content.substring(0, 100) + '...' 
                    : content.content}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {editingContent && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '600px' }}>
            <h2 className="modal-header">{t('contentManager.editTitle')}</h2>
            
            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                marginBottom: '1rem',
                color: '#dc2626',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>{t('contentManager.fields.title')}</label>
                <input
                  type="text"
                  value={editingContent.title}
                  onChange={(e) => setEditingContent({...editingContent, title: e.target.value})}
                  disabled={saving}
                />
              </div>
              
              <div className="form-group">
                <label>{t('contentManager.fields.content')}</label>
                <textarea
                  value={editingContent.content}
                  onChange={(e) => setEditingContent({...editingContent, content: e.target.value})}
                  rows={editingContent.type === 'text' ? 4 : 8}
                  disabled={saving}
                  style={{ fontFamily: editingContent.type === 'html' ? 'monospace' : 'inherit' }}
                />
              </div>
              
              <div className="form-group">
                <label>{t('contentManager.fields.type')}</label>
                <select
                  value={editingContent.type}
                  onChange={(e) => setEditingContent({...editingContent, type: e.target.value})}
                  disabled={saving}
                >
                  <option value="text">{t('contentManager.types.text')}</option>
                  <option value="html">{t('contentManager.types.html')}</option>
                  <option value="image">{t('contentManager.types.image')}</option>
                  <option value="json">{t('contentManager.types.json')}</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={editingContent.is_active}
                    onChange={(e) => setEditingContent({...editingContent, is_active: e.target.checked})}
                    disabled={saving}
                  />
                  {t('contentManager.fields.active')}
                </label>
              </div>
            </div>
            
            <div className="modal-buttons">
              <button 
                onClick={() => handleSave(editingContent)} 
                className="btn-save"
                disabled={saving}
              >
                <Save size={16} />
                <span>{saving ? t('contentManager.saving') : t('contentManager.saveChanges')}</span>
              </button>
              <button 
                onClick={handleCancel} 
                className="btn-cancel"
                disabled={saving}
              >
                {t('contentManager.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ContentManager;
