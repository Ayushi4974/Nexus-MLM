import React, { useState } from 'react';

const OTPModal = ({ isOpen, onClose, onVerify, loading, errorMessage }) => {
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(otp);
  };

  return (
    <div style={styles.backdrop}>
      <div className="glass-card" style={styles.modal}>
        <div style={styles.header}>
          <h3 style={{ color: '#fff', margin: 0 }}>Security Verification</h3>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>
        
        <p style={styles.desc}>
          A 6-digit OTP was sent to your email / phone. For testing, please enter the default passcode:
        </p>
        <div style={styles.passcodeCode}>123456</div>

        {errorMessage && <div style={styles.error}>{errorMessage}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group" style={{ alignItems: 'center' }}>
            <input
              type="text"
              required
              maxLength="6"
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // numbers only
              style={styles.otpInput}
            />
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: '8px 16px', flexGrow: 1 }}>
              Cancel
            </button>
            <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary" style={{ padding: '8px 16px', flexGrow: 1 }}>
              {loading ? 'Verifying...' : 'Verify & Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(5, 7, 12, 0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  modal: {
    width: '100%',
    maxWidth: '400px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '12px',
  },
  closeBtn: {
    fontSize: '24px',
    color: 'var(--text-muted)',
    lineHeight: 1,
  },
  desc: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    marginBottom: '16px',
    textAlign: 'center',
  },
  passcodeCode: {
    background: 'var(--bg-dark-hover)',
    border: '1px dashed var(--secondary)',
    color: 'var(--secondary)',
    textAlign: 'center',
    padding: '8px',
    borderRadius: '6px',
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '4px',
    marginBottom: '24px',
    width: 'fit-content',
    margin: '0 auto 24px',
  },
  otpInput: {
    letterSpacing: '10px',
    fontSize: '28px',
    textAlign: 'center',
    padding: '10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    color: '#fff',
    outline: 'none',
    width: '200px',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: 'var(--danger)',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    textAlign: 'center',
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
};

export default OTPModal;
