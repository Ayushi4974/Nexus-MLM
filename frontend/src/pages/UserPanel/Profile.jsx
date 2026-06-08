import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const Profile = () => {
  const { user, refreshProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  // Tab 1: Personal
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  // Tab 2: Bank
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [bankName, setBankName] = useState('');
  const [holderName, setHolderName] = useState('');

  // Tab 3: Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load user data on render
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setMobile(user.mobile || '');
      
      const bank = user.bankDetails || {};
      setAccountNumber(bank.accountNumber || '');
      setIfsc(bank.ifsc || '');
      setBankName(bank.bankName || '');
      setHolderName(bank.holderName || '');
    }
  }, [user]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFeedback({ type: '', msg: '' });
  };

  const handlePersonalUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', msg: '' });

    try {
      const res = await api.user.updateProfile({ name, email, mobile });
      if (res.success) {
        setFeedback({ type: 'success', msg: res.message });
        await refreshProfile();
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleBankUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', msg: '' });

    try {
      const res = await api.user.updateProfile({
        bankDetails: { accountNumber, ifsc, bankName, holderName },
      });
      if (res.success) {
        setFeedback({ type: 'success', msg: res.message });
        await refreshProfile();
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Failed to update bank details' });
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityUpdate = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', msg: '' });

    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', msg: 'New passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.user.changePassword({ currentPassword, newPassword });
      if (res.success) {
        setFeedback({ type: 'success', msg: res.message });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Account Configurations</h1>
        <p style={{ color: 'var(--text-muted)' }}>Configure contact profiles, bank routing numbers, and password keys.</p>
      </div>

      {/* Main Grid */}
      <div style={styles.grid}>
        {/* Navigation Tabs */}
        <div className="glass-card" style={styles.tabPanel}>
          <button
            onClick={() => handleTabChange('personal')}
            style={activeTab === 'personal' ? styles.tabBtnActive : styles.tabBtn}
          >
            👤 Personal Details
          </button>
          <button
            onClick={() => handleTabChange('bank')}
            style={activeTab === 'bank' ? styles.tabBtnActive : styles.tabBtn}
          >
            🏦 Bank Credentials
          </button>
          <button
            onClick={() => handleTabChange('security')}
            style={activeTab === 'security' ? styles.tabBtnActive : styles.tabBtn}
          >
            🔒 Account Security
          </button>
        </div>

        {/* Content Form */}
        <div className="glass-card" style={styles.formPanel}>
          {feedback.msg && (
            <div style={feedback.type === 'success' ? styles.successAlert : styles.errorAlert}>
              {feedback.msg}
            </div>
          )}

          {/* 1. Personal Info Tab */}
          {activeTab === 'personal' && (
            <form onSubmit={handlePersonalUpdate}>
              <h3 style={styles.formTitle}>Contact Details</h3>
              
              <div className="form-group">
                <label className="form-label">System Username</label>
                <input
                  type="text"
                  disabled
                  className="form-control"
                  value={user?.username || ''}
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  required
                  className="form-control"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '10px' }}>
                {loading ? 'Saving...' : 'Update Details'}
              </button>
            </form>
          )}

          {/* 2. Bank Details Tab */}
          {activeTab === 'bank' && (
            <form onSubmit={handleBankUpdate}>
              <h3 style={styles.formTitle}>linked bank account</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Provide correct information. System payouts generate directly to this configuration.
              </p>

              <div className="form-group">
                <label className="form-label">Account Holder Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bank Institution Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="E.g., Chase Bank, Wells Fargo"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Account Number</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))} // numbers only
                />
              </div>

              <div className="form-group">
                <label className="form-label">IFSC / Routing Code</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="IFSC or ABA routing number"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '10px' }}>
                {loading ? 'Saving...' : 'Link Bank Details'}
              </button>
            </form>
          )}

          {/* 3. Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handleSecurityUpdate}>
              <h3 style={styles.formTitle}>Change Password</h3>

              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '10px' }}>
                {loading ? 'Changing...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
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
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '24px',
    alignItems: 'flex-start',
  },
  tabPanel: {
    flex: '1 1 240px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '16px',
  },
  tabBtn: {
    textAlign: 'left',
    padding: '14px 18px',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-muted)',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'var(--transition)',
    cursor: 'pointer',
  },
  tabBtnActive: {
    textAlign: 'left',
    padding: '14px 18px',
    borderRadius: 'var(--radius-sm)',
    color: '#fff',
    background: 'var(--bg-dark-hover)',
    borderLeft: '3px solid var(--secondary)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  formPanel: {
    flex: '2 1 500px',
    padding: '40px 30px',
  },
  formTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '20px',
    textTransform: 'capitalize',
  },
  successAlert: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--success)',
    border: '1px solid var(--success)',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '20px',
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
};

export default Profile;
