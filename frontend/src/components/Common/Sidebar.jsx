import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  
  // Collapse/Expand state for submenus
  const [submenus, setSubmenus] = useState({
    team: false,
    income: false,
    wallet: false,
  });

  const toggleSubmenu = (menu) => {
    setSubmenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? 'panel-sidebar-link-active' : 'panel-sidebar-link';

  const submenuLinkClass = ({ isActive }) =>
    isActive ? 'panel-sidebar-sublink-active' : 'panel-sidebar-sublink';

  return (
    <aside className={`panel-sidebar ${isOpen ? 'open' : ''}`} data-lenis-prevent>
      {/* Brand Logo */}
      <div className="panel-sidebar-brand">
        <Link to="/" className="panel-sidebar-brand-link">
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="url(#side-logo-grad)" />
            <path d="M8 22V10L16 16L24 10V22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="side-logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <span className="panel-sidebar-brand-text">NEXUS<span style={{ color: 'var(--secondary)' }}>MLM</span></span>
        </Link>
        <button onClick={toggleSidebar} className="panel-sidebar-close">&times;</button>
      </div>

      {/* Menu List */}
      <nav className="panel-sidebar-nav">
        {/* Dashboard */}
        <NavLink to="/dashboard" end className={navLinkClass}>
          <span className="panel-sidebar-icon">🏠</span> Dashboard
        </NavLink>

        {/* My Team Submenu */}
        <div>
          <button onClick={() => toggleSubmenu('team')} className="panel-sidebar-toggle">
            <span className="panel-sidebar-icon">👥</span> My Team
            <span className="panel-sidebar-arrow">{submenus.team ? '▲' : '▼'}</span>
          </button>
          {submenus.team && (
            <div className="panel-sidebar-sublist">
              <NavLink to="/team/direct" className={submenuLinkClass}>
                Direct Team
              </NavLink>
              <NavLink to="/team/genealogy" className={submenuLinkClass}>
                Genealogy Tree
              </NavLink>
            </div>
          )}
        </div>

        {/* Income Submenu */}
        <div>
          <button onClick={() => toggleSubmenu('income')} className="panel-sidebar-toggle">
            <span className="panel-sidebar-icon">💰</span> Income
            <span className="panel-sidebar-arrow">{submenus.income ? '▲' : '▼'}</span>
          </button>
          {submenus.income && (
            <div className="panel-sidebar-sublist">
              <NavLink to="/income/direct" className={submenuLinkClass}>Direct Income</NavLink>
              <NavLink to="/income/binary" className={submenuLinkClass}>Binary Income</NavLink>
              <NavLink to="/income/level" className={submenuLinkClass}>Level Income</NavLink>
              <NavLink to="/income/roi" className={submenuLinkClass}>ROI Income</NavLink>
              <NavLink to="/income/reward" className={submenuLinkClass}>Reward Income</NavLink>
            </div>
          )}
        </div>

        {/* Wallet Submenu */}
        <div>
          <button onClick={() => toggleSubmenu('wallet')} className="panel-sidebar-toggle">
            <span className="panel-sidebar-icon">💳</span> Wallet
            <span className="panel-sidebar-arrow">{submenus.wallet ? '▲' : '▼'}</span>
          </button>
          {submenus.wallet && (
            <div className="panel-sidebar-sublist">
              <NavLink to="/wallet/overview" className={submenuLinkClass}>Wallet Overview</NavLink>
              <NavLink to="/wallet/transfer" className={submenuLinkClass}>Fund Transfer</NavLink>
              <NavLink to="/wallet/history" className={submenuLinkClass}>Transaction History</NavLink>
            </div>
          )}
        </div>

        {/* Packages */}
        <NavLink to="/packages" className={navLinkClass}>
          <span className="panel-sidebar-icon">📦</span> Packages
        </NavLink>

        {/* Withdrawals */}
        <NavLink to="/withdrawals" className={navLinkClass}>
          <span className="panel-sidebar-icon">📤</span> Withdrawals
        </NavLink>

        {/* Notifications */}
        <NavLink to="/notifications" className={navLinkClass}>
          <span className="panel-sidebar-icon">🔔</span> Notifications
        </NavLink>

        {/* Profile */}
        <NavLink to="/profile" className={navLinkClass}>
          <span className="panel-sidebar-icon">👤</span> Profile
        </NavLink>

        {/* Support */}
        <NavLink to="/support" className={navLinkClass}>
          <span className="panel-sidebar-icon">💬</span> Support
        </NavLink>

        <button onClick={logout} className="panel-sidebar-logout">
          <span className="panel-sidebar-icon">🚪</span> Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
