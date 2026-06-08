import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();

  const navLinkClass = ({ isActive }) =>
    isActive ? 'panel-sidebar-link-active admin-active-override' : 'panel-sidebar-link';

  return (
    <aside className={`panel-sidebar ${isOpen ? 'open' : ''}`} style={{ borderRight: '1px solid rgba(99, 102, 241, 0.15)' }} data-lenis-prevent>
      {/* Brand Logo */}
      <div className="panel-sidebar-brand" style={{ paddingBottom: '10px' }}>
        <Link to="/admin/dashboard" className="panel-sidebar-brand-link">
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="url(#admin-logo-grad)" />
            <path d="M16 6L26 12V20L16 26L6 20V12L16 6Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 12V20" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 16H20" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="admin-logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
          </svg>
          <span className="panel-sidebar-brand-text">
            NEXUS<span style={{ color: '#8b5cf6' }}>ADMIN</span>
          </span>
        </Link>
        <button onClick={toggleSidebar} className="panel-sidebar-close">&times;</button>
      </div>

      <div style={{ padding: '0 24px 16px 24px', textAlign: 'left' }}>
        <span style={{
          fontSize: '11px',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          background: 'linear-gradient(90deg, #8b5cf6, #4f46e5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          padding: '2px 8px',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          Control Suite
        </span>
      </div>

      {/* Menu List */}
      <nav className="panel-sidebar-nav">
        {/* Admin Dashboard */}
        <NavLink to="/admin/dashboard" end className={navLinkClass}>
          <span className="panel-sidebar-icon">📊</span> Overview Stats
        </NavLink>

        {/* User Management */}
        <NavLink to="/admin/users" className={navLinkClass}>
          <span className="panel-sidebar-icon">👥</span> Manage Users
        </NavLink>

        {/* Withdrawal Requests */}
        <NavLink to="/admin/withdrawals" className={navLinkClass}>
          <span className="panel-sidebar-icon">📤</span> Withdrawals
        </NavLink>

        {/* Package CRUD */}
        <NavLink to="/admin/packages" className={navLinkClass}>
          <span className="panel-sidebar-icon">📦</span> Manage Packages
        </NavLink>

        {/* Global Transactions Audit */}
        <NavLink to="/admin/transactions" className={navLinkClass}>
          <span className="panel-sidebar-icon">💸</span> System Logs
        </NavLink>

        {/* Broadcast System Message */}
        <NavLink to="/admin/broadcast" className={navLinkClass}>
          <span className="panel-sidebar-icon">📢</span> Send Broadcast
        </NavLink>

        <div style={{ margin: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}></div>

        {/* Redirect to User Dashboard if Admin also has user role */}
        <Link to="/dashboard" className="panel-sidebar-link" style={{ color: 'var(--text-muted)' }}>
          <span className="panel-sidebar-icon">👤</span> Switch to User Panel
        </Link>

        {/* Logout */}
        <button onClick={logout} className="panel-sidebar-logout" style={{ marginTop: '20px' }}>
          <span className="panel-sidebar-icon">🚪</span> Sign Out
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
