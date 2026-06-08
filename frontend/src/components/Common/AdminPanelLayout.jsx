import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import AdminSidebar from './AdminSidebar';
import PageTransition from './PageTransition';

const AdminPanelLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Close sidebar on route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Auth & Admin authorization gate
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else if (!user.isAdmin) {
        // Redirect standard users back to user dashboard
        navigate('/dashboard');
      }
    }
  }, [user, loading, navigate]);

  // Load count of pending withdrawals for admin notifications
  useEffect(() => {
    if (user && user.isAdmin) {
      api.admin.getWithdrawals('pending')
        .then((res) => {
          if (res.success) {
            setPendingCount(res.data.length);
          }
        })
        .catch((err) => console.error('Error fetching admin withdrawals count:', err));
    }
  }, [user, location.pathname]);

  if (loading) {
    return (
      <div className="panel-loader-container">
        <div className="panel-spinner" style={{ borderTopColor: '#8b5cf6' }}></div>
        <span style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Checking authorization...</span>
      </div>
    );
  }

  // Prevent flash of unauthorized child pages
  if (!user || !user.isAdmin) return null;
  console.log("USER DATA:", user);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="panel-container">
      {/* Admin navigation menu */}
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Mobile backdrop */}
      {sidebarOpen && <div onClick={toggleSidebar} className="panel-overlay"></div>}

      {/* Content Scaffolding */}
      <div className="panel-main">
        {/* Top Header */}
        <header className="panel-header" style={{ borderBottom: '1px solid rgba(139, 92, 246, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={toggleSidebar} className="panel-hamburger" style={{ color: '#8b5cf6' }}>
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
              Admin Console <span style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.4)' }}>|</span> <span style={{ color: '#c084fc', fontSize: '15px' }}>{user.name}</span>
            </h2>
          </div>

          <div className="panel-header-right" style={{ gap: '20px' }}>
            {/* Glowing Pending Withdrawals Alert */}
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/admin/withdrawals')}>
              <span style={{ fontSize: '20px', display: 'inline-block' }}>📥</span>
              {pendingCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#a855f7',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  boxShadow: '0 0 10px #a855f7'
                }}>
                  {pendingCount}
                </span>
              )}
            </div>

            {/* Admin Avatar Ring */}
            <div className="pulse-glow-ring" style={{
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(139, 92, 246, 0.4)'
            }} onClick={() => navigate('/profile')}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '15px',
                border: '2px solid rgba(255,255,255,0.1)'
              }}>
                A
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic page contents wrapper */}
        <main className="panel-body" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>

        {/* Frosted glass admin control footer */}
        <footer className="footer-frosted-glass" style={{ borderTop: '1px solid rgba(139, 92, 246, 0.1)' }}>
          <div>
            <span>© {new Date().getFullYear()} NEXUSMLM Platform. Administrator Security Protocol.</span>
          </div>
          <div className="footer-nav-links">
            <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>SYSTEM SECURE</span>
            <span>|</span>
            <span>Mock Database Active</span>
            <span>|</span>
            <span>Session: {new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminPanelLayout;
