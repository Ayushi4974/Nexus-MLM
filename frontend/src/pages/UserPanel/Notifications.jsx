import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAndReadNotifications = async () => {
    try {
      const res = await api.user.getNotifications();
      if (res.success) {
        setNotifications(res.data);
      }
      
      // Mark as read after fetching
      await api.user.readNotifications();
    } catch (err) {
      console.error('Failed to handle notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndReadNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'income': return '💰';
      case 'withdrawal': return '📤';
      case 'rank': return '🏆';
      case 'package': return '📦';
      default: return '🔔';
    }
  };

  return (
    <div className="animate-fade" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>System Alerts & Notifications</h1>
        <p style={{ color: 'var(--text-muted)' }}>Keep track of your referral payouts, placement activations, and team rank promotions.</p>
      </div>

      {/* Main List */}
      <div className="glass-card" style={{ padding: '24px' }}>
        {loading ? (
          <div style={styles.loading}>Loading notification feed...</div>
        ) : notifications.length === 0 ? (
          <div style={styles.loading}>You have no notifications yet.</div>
        ) : (
          <div style={styles.list}>
            {notifications.map((notif) => (
              <div key={notif._id} style={{ ...styles.card, opacity: notif.isRead ? 0.7 : 1 }}>
                <div style={styles.iconWrapper}>{getIcon(notif.type)}</div>
                
                <div style={styles.content}>
                  <div style={styles.cardHeader}>
                    <h4 style={styles.cardTitle}>{notif.title}</h4>
                    <span style={styles.time}>{new Date(notif.createdAt).toLocaleString()}</span>
                  </div>
                  <p style={styles.message}>{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    marginBottom: '8px',
  },
  title: {
    fontSize: '24px',
    color: '#fff',
    fontWeight: '700',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    display: 'flex',
    gap: '16px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '16px 20px',
    alignItems: 'flex-start',
    transition: 'var(--transition)',
  },
  iconWrapper: {
    fontSize: '20px',
    background: 'var(--bg-dark-hover)',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--border-color)',
    flexShrink: 0,
  },
  content: {
    flexGrow: 1,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
  },
  time: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  message: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginTop: '6px',
    lineHeight: '1.4',
  },
  loading: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '14px',
    padding: '40px 0',
  },
};

export default Notifications;
