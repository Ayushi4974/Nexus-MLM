import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(loginId, password);
      if (res.success) {
        if (rememberMe) {
          localStorage.setItem('mlm_remember', loginId);
        } else {
          localStorage.removeItem('mlm_remember');
        }
        if (res.data.isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-card animate-fade" style={styles.card}>
        <div style={styles.logoHeader}>
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="url(#login-logo-grad)" />
            <path d="M8 22V10L16 16L24 10V22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="login-logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <h2 style={styles.brandTitle}>Nexus Account Login</h2>
          <p style={styles.subtitle}>Enter your details to manage your dashboard</p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label">Email, Username, or Mobile</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="E.g. MLM100234 or email@domain.com"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={styles.optionsWrapper}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              Remember Me
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password recovery: An administrator can reset details locally."); }} style={styles.forgotLink}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={styles.submitBtn}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.footerText}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--secondary)', fontWeight: '600' }}>
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.08) 0%, rgba(9, 13, 22, 0) 70%)',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    padding: '40px 30px',
  },
  logoHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '32px',
  },
  brandTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff',
    marginTop: '16px',
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginTop: '6px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  errorAlert: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: 'var(--danger)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '20px',
  },
  optionsWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    fontSize: '14px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  checkbox: {
    cursor: 'pointer',
    width: '16px',
    height: '16px',
    accentColor: 'var(--primary)',
  },
  forgotLink: {
    color: 'var(--primary)',
    fontWeight: '500',
  },
  submitBtn: {
    width: '100%',
  },
  footerText: {
    textAlign: 'center',
    fontSize: '14px',
    color: 'var(--text-muted)',
    marginTop: '24px',
  },
};

export default Login;
