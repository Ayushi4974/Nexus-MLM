import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header style={headerStyles.container}>
      <div style={headerStyles.navWrapper}>
        {/* Logo */}
        <Link to="/" style={headerStyles.logo}>
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#logo-grad)" />
            <path d="M8 22V10L16 16L24 10V22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="logo-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <span style={headerStyles.logoText}>NEXUS<span style={{ color: 'var(--secondary)' }}>MLM</span></span>
        </Link>

        {/* Links */}
        <nav style={headerStyles.navbar}>
          <Link to="/" style={isActive('/') ? headerStyles.linkActive : headerStyles.link}>Home</Link>
          <Link to="/about" style={isActive('/about') ? headerStyles.linkActive : headerStyles.link}>About Us</Link>
          <Link to="/compensation" style={isActive('/compensation') ? headerStyles.linkActive : headerStyles.link}>Plan</Link>
          <Link to="/contact" style={isActive('/contact') ? headerStyles.linkActive : headerStyles.link}>Contact</Link>
        </nav>

        {/* Action Buttons */}
        <div style={headerStyles.actions}>
          {user ? (
            <Link to="/dashboard" className="btn-primary" style={{ padding: '8px 20px', borderRadius: '8px' }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" style={headerStyles.loginBtn}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', borderRadius: '8px' }}>
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const headerStyles = {
  container: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(9, 13, 22, 0.8)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border-color)',
  },
  navWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '20px',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '1px',
  },
  logoText: {
    background: 'linear-gradient(135deg, #fff 60%, var(--text-muted))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  link: {
    color: 'var(--text-muted)',
    fontWeight: '500',
    fontSize: '15px',
    transition: 'var(--transition)',
  },
  linkActive: {
    color: 'var(--secondary)',
    fontWeight: '600',
    fontSize: '15px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  loginBtn: {
    color: 'var(--text-main)',
    fontWeight: '600',
    fontSize: '15px',
    padding: '8px 16px',
    transition: 'var(--transition)',
  },
};

export default Header;
