import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import Sidebar from './Sidebar';
import PageTransition from './PageTransition';

const UserPanelLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Close sidebar on path changes (mobile UX)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Auth gate
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Dynamic notification count fetch
  useEffect(() => {
    if (user) {
      api.user.getNotifications()
        .then((res) => {
          if (res.success) {
            const unread = res.data.filter(n => !n.isRead).length;
            setUnreadCount(unread);
          }
        })
        .catch(err => console.error('Error fetching notifications:', err));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="panel-loader-container">
        <div className="panel-spinner"></div>
        <span style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Loading session...</span>
      </div>
    );
  }

  if (!user) return null;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="panel-container">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && <div onClick={toggleSidebar} className="panel-overlay"></div>}

      {/* Right side content wrapper */}
      <div className="panel-main">
        {/* Top Header */}
        <header className="panel-header">
          {/* Left: Menu Hamburger & Greeting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={toggleSidebar} className="panel-hamburger">
              ☰
            </button>
            <h2 className="header-greeting" style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: 0
            }}>
              Hello, {user.name || 'Darshan Thank'} <span className="wave-hand-emoji">👋</span>
            </h2>
          </div>

          {/* Right: Notifications & Glowing Avatar */}
          <div className="panel-header-right" style={{ gap: '20px' }}>
            {/* Notifications Bell */}
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/notifications')}>
              <span style={{ fontSize: '22px', display: 'inline-block' }}>🔔</span>
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--danger)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  boxShadow: '0 0 8px var(--danger)'
                }}>
                  {unreadCount}
                </span>
              )}
            </div>

            {/* Glowing Avatar */}
            <div className="pulse-glow-ring" style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0A0F1E',
                fontWeight: 'bold',
                fontSize: '15px',
                border: '2px solid rgba(255,255,255,0.1)'
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="panel-body" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>

        {/* Floating Frosted Glass Footer */}
        <footer className="footer-frosted-glass">
          <div>
            <span>© {new Date().getFullYear()} NEXUSMLM Platform. All Rights Reserved.</span>
          </div>
          <div className="footer-nav-links">
            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Active Session</span>
            <span>|</span>
            <span>English (US)</span>
            <span>|</span>
            <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default UserPanelLayout;
