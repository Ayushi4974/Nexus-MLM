import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [sponsorId, setSponsorId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sponsor verification
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorError, setSponsorError] = useState('');
  const [sponsorVerifying, setSponsorVerifying] = useState(false);

  // Status
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  // Demo Sponsor IDs
  const DEMO_SPONSORS = {
    'MLM000001': 'Admin Root',
    'MLM000002': 'Demo Sponsor Alpha',
    'MLM000003': 'Demo Sponsor Beta',
    'MLM100001': 'Raj Kumar',
    'MLM100002': 'Priya Sharma',
    'MLM888888': 'Admin Root Member',
  };

  // Debounced Sponsor Check
  useEffect(() => {
    if (!sponsorId) {
      setSponsorName('');
      setSponsorError('');
      setSponsorVerifying(false);
      return;
    }

    // Check demo IDs instantly
    const demoName = DEMO_SPONSORS[sponsorId.toUpperCase()];
    if (demoName) {
      setSponsorName(demoName);
      setSponsorError('');
      setSponsorVerifying(false);
      return;
    }

    setSponsorVerifying(true);
    const timer = setTimeout(async () => {
      try {
        const res = await api.auth.verifySponsor(sponsorId);
        if (res.success) { setSponsorName(res.name); setSponsorError(''); }
      } catch {
        setSponsorName('');
        setSponsorError('Sponsor ID not found');
      } finally {
        setSponsorVerifying(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [sponsorId]);

  // Validators
  const isEmailValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isMobileValid = (v) => v.replace(/\D/g, '').length >= 10;
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const getStrength = () => {
    let s = 0;
    if (hasMinLength) s++;
    if (hasUppercase) s++;
    if (hasNumber) s++;
    return s;
  };
  const strength = getStrength();

  const isFormValid =
    name.trim().length > 0 &&
    isEmailValid(email) &&
    isMobileValid(mobile) &&
    strength >= 2 &&
    passwordsMatch &&
    (!sponsorId || !sponsorError);

  // Submit → Register → Redirect to Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    if (strength < 2) {
      setFormError('Please use a stronger password (8+ chars, uppercase, number)');
      return;
    }

    setLoading(true);
    try {
      const res = await register({ name, email, mobile, password, sponsorId });
      if (res && res.success) {
        navigate('/login');
      }
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card} className="animate-fade">

        {/* Logo & Title */}
        <div style={s.header}>
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#rg)" />
            <path d="M8 22V10L16 16L24 10V22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="rg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" /><stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <h1 style={s.title}>Create Member Account</h1>
          <p style={s.subtitle}>Fill your details below to get started</p>
        </div>

        {/* Error Alert */}
        {formError && <div style={s.errorBox}>{formError}</div>}

        <form onSubmit={handleSubmit} style={s.form}>

          {/* Full Name */}
          <div style={s.group}>
            <label style={s.label}>Full Name</label>
            <input
              type="text" required className="form-control"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ ...s.input, borderColor: name ? 'var(--success)' : '' }}
            />
          </div>

          {/* Email */}
          <div style={s.group}>
            <label style={s.label}>Email Address</label>
            <input
              type="email" required className="form-control"
              placeholder="you@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ ...s.input, borderColor: email ? (isEmailValid(email) ? 'var(--success)' : 'var(--danger)') : '' }}
            />
          </div>

          {/* Mobile */}
          <div style={s.group}>
            <label style={s.label}>Mobile Number</label>
            <input
              type="tel" required className="form-control"
              placeholder="+91 9876543210"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              style={{ ...s.input, borderColor: mobile ? (isMobileValid(mobile) ? 'var(--success)' : 'var(--danger)') : '' }}
            />
          </div>

          {/* Sponsor ID */}
          <div style={s.group}>
            <label style={s.label}>Referral / Sponsor ID <span style={s.optional}>(Optional)</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type="text" className="form-control"
                placeholder="e.g. MLM000001"
                value={sponsorId}
                onChange={e => setSponsorId(e.target.value.toUpperCase())}
                style={{ ...s.input, borderColor: sponsorId ? (sponsorError ? 'var(--danger)' : sponsorName ? 'var(--success)' : '') : '', paddingRight: '110px' }}
              />
              {sponsorVerifying && <span style={s.badgeStyle('warning')}>Verifying…</span>}
              {sponsorName && <span style={s.badgeStyle('success')}>✓ {sponsorName}</span>}
              {sponsorError && <span style={s.badgeStyle('danger')}>✗ Invalid</span>}
            </div>
            {/* Demo chips */}
            <div style={s.chipRow}>
              {['MLM000001', 'MLM000002'].map(id => (
                <span key={id} style={s.chip} onClick={() => setSponsorId(id)}>{id}</span>
              ))}
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', alignSelf: 'center' }}>← click to test</span>
            </div>
          </div>

          {/* Password */}
          <div style={s.group}>
            <label style={s.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'} required className="form-control"
                placeholder="Min 8 chars, uppercase & number"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ ...s.input, borderColor: password ? (strength >= 2 ? 'var(--success)' : 'var(--danger)') : '', paddingRight: '50px' }}
              />
              <button type="button" onClick={() => setShowPassword(p => !p)} style={s.eyeBtn}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {/* Strength Bar */}
            {password && (
              <div style={s.strengthRow}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    ...s.strengthBar,
                    background: strength >= i
                      ? (strength === 1 ? 'var(--danger)' : strength === 2 ? 'var(--warning)' : 'var(--success)')
                      : 'rgba(255,255,255,0.08)'
                  }} />
                ))}
                <span style={{ fontSize: '11px', marginLeft: '8px', color: strength === 1 ? 'var(--danger)' : strength === 2 ? 'var(--warning)' : 'var(--success)' }}>
                  {strength === 1 ? 'Weak' : strength === 2 ? 'Medium' : 'Strong'}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div style={s.group}>
            <label style={s.label}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'} required className="form-control"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={{ ...s.input, borderColor: confirmPassword ? (passwordsMatch ? 'var(--success)' : 'var(--danger)') : '', paddingRight: '50px' }}
              />
              <button type="button" onClick={() => setShowConfirmPassword(p => !p)} style={s.eyeBtn}>
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {confirmPassword && (
              <span style={{ fontSize: '11px', color: passwordsMatch ? 'var(--success)' : 'var(--danger)', marginTop: '2px' }}>
                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="btn-primary"
            style={{ ...s.btn, opacity: isFormValid ? 1 : 0.5 }}
          >
            {loading ? '⏳ Creating Account...' : '🚀 Register Now'}
          </button>

          {/* Footer */}
          <div style={s.footer}>
            Already have an account?{' '}
            <Link to="/login" style={s.link}>Sign In</Link>
          </div>
        </form>

      </div>
    </div>
  );
};

// ── Styles ─────────────────────────────────────────────────
const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.12) 0%, transparent 70%)',
  },
  card: {
    width: '100%',
    maxWidth: '460px',
    background: 'rgba(17,24,39,0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '36px 32px',
    boxShadow: '0 24px 48px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.08)',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '24px',
    gap: '6px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#fff',
    marginTop: '10px',
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-main)',
  },
  optional: {
    fontSize: '11px',
    fontWeight: '400',
    color: 'var(--text-muted)',
  },
  input: {
    height: '46px',
    background: 'rgba(255,255,255,0.03)',
    border: '1.5px solid rgba(255,255,255,0.07)',
    borderRadius: '10px',
    padding: '0 14px',
    fontSize: '14px',
    color: '#fff',
    transition: 'all 0.25s ease',
    width: '100%',
    outline: 'none',
  },
  badgeStyle: (type) => ({
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '11px',
    fontWeight: '700',
    color: `var(--${type})`,
    background: type === 'warning' ? 'rgba(245,158,11,0.12)' : type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
    padding: '2px 8px',
    borderRadius: '5px',
    whiteSpace: 'nowrap',
  }),
  chipRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginTop: '4px',
  },
  chip: {
    background: 'rgba(245,158,11,0.1)',
    border: '1px solid rgba(245,158,11,0.25)',
    borderRadius: '5px',
    padding: '3px 8px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#fbbf24',
    cursor: 'pointer',
    userSelect: 'none',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    lineHeight: 1,
    padding: 0,
  },
  strengthRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '4px',
  },
  strengthBar: {
    flex: 1,
    height: '3px',
    borderRadius: '2px',
    transition: 'background 0.3s',
  },
  btn: {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    marginTop: '6px',
    transition: 'all 0.25s',
  },
  footer: {
    textAlign: 'center',
    fontSize: '13px',
    color: 'var(--text-muted)',
    paddingTop: '10px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  link: {
    color: 'var(--secondary)',
    fontWeight: '700',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    color: 'var(--danger)',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '13px',
    textAlign: 'center',
    marginBottom: '4px',
  },
};

export default Register;
