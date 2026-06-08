import React, { useState } from 'react';
import { api } from '../../services/api';

const AdminBroadcast = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !message) return;

    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await api.admin.broadcastNotification(title, message);
      if (res.success) {
        setFeedback({ type: 'success', text: res.message });
        setTitle('');
        setMessage('');
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to send broadcast' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>System Broadcast</h1>
        <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Transmit warnings, platform upgrades, or direct announcements to the entire user base</p>
      </div>

      {/* Main compose card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
        {/* Form panel */}
        <div className="detail-card">
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 20px 0' }}>Compose Broadcast Announcement</h3>
          
          {feedback && (
            <div style={{
              background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${feedback.type === 'success' ? '#10b981' : '#ef4444'}`,
              padding: '16px 20px',
              borderRadius: '12px',
              color: feedback.type === 'success' ? '#34d399' : '#f87171',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '24px'
            }}>
              <span>{feedback.type === 'success' ? '✅' : '❌'}</span>
              <span style={{ marginLeft: '8px' }}>{feedback.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>
                Notification Title
              </label>
              <input
                type="text"
                placeholder="e.g. Server Maintenance, Welcome New Diamond Members!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="panel-input"
                style={{ width: '100%', margin: 0 }}
                required
              />
            </div>

            {/* Message Body */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>
                Announcement Message
              </label>
              <textarea
                placeholder="Write message content here... All network members will receive this notification instantly in their notifications panel."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="panel-input"
                style={{ width: '100%', margin: 0, height: '180px', resize: 'none', lineHeight: '1.6' }}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="panel-btn-primary"
              style={{
                padding: '14px 0',
                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                borderColor: 'transparent',
                boxShadow: '0 0 20px rgba(139,92,246,0.35)',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: submitting ? 'not-allowed' : 'pointer',
                marginTop: '10px'
              }}
            >
              {submitting ? 'Transmitting...' : 'Send Broadcast Announcement 📢'}
            </button>
          </form>
        </div>

        {/* Live Preview Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0' }}>Live Interactive Preview</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>This is how your broadcast will appear in the user notifications deck</p>

          <div className="detail-card" style={{
            border: '1px dashed rgba(139, 92, 246, 0.3)',
            background: 'rgba(139, 92, 246, 0.02)',
            padding: '24px',
            position: 'relative'
          }}>
            {/* Header placeholder */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>🔔</span>
                <strong style={{ fontSize: '13px', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '1px' }}>SYSTEM NOTICE</strong>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Just Now</span>
            </div>

            {/* Dynamic preview */}
            <h4 style={{
              fontSize: '16px',
              fontWeight: '800',
              margin: '0 0 8px 0',
              color: title ? '#fff' : 'rgba(255,255,255,0.2)'
            }}>
              {title || 'Untitled Composition'}
            </h4>
            
            <p style={{
              fontSize: '13px',
              color: message ? 'var(--text-muted)' : 'rgba(255,255,255,0.1)',
              margin: 0,
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {message || 'Composing announcement message... (Live updates reflected immediately)'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBroadcast;
