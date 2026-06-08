import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const FundTransfer = () => {
  const [mainBalance, setMainBalance] = useState(0);
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');

  // Verification states
  const [recipientName, setRecipientName] = useState('');
  const [recipientError, setRecipientError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formError, setFormError] = useState('');

  const fetchBalance = async () => {
    try {
      const res = await api.wallet.getBalances();
      if (res.success) {
        setMainBalance(res.data.main);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  // Verify recipient ID when typing finishes
  useEffect(() => {
    if (!recipientId) {
      setRecipientName('');
      setRecipientError('');
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await api.auth.verifySponsor(recipientId);
        if (res.success) {
          setRecipientName(res.name);
          setRecipientError('');
        }
      } catch (err) {
        setRecipientName('');
        setRecipientError(err.message || 'Recipient not found');
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [recipientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (recipientError || !recipientName) {
      setFormError('Please resolve recipient validation error first');
      return;
    }

    if (Number(amount) > mainBalance) {
      setFormError('Insufficient balance in Main Wallet');
      return;
    }

    setLoading(true);
    try {
      const res = await api.wallet.transferFunds({
        recipientId,
        amount: Number(amount),
        remarks,
      });

      if (res.success) {
        setSuccessMsg(res.message);
        setMainBalance(res.data.newBalance);
        setRecipientId('');
        setAmount('');
        setRemarks('');
        setRecipientName('');
      }
    } catch (err) {
      setFormError(err.message || 'Fund transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Internal P2P Fund Transfer</h1>
        <p style={{ color: 'var(--text-muted)' }}>Send wallet funds to another member's Recharge Wallet instantly. No transaction fees.</p>
      </div>

      {/* Grid */}
      <div style={styles.grid}>
        {/* Left side: Form */}
        <div className="glass-card" style={styles.formCard}>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>Transfer Request</h3>

          {formError && <div style={styles.errorAlert}>{formError}</div>}
          {successMsg && <div style={styles.successAlert}>{successMsg}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Recipient User ID</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="E.g., MLM100432"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value.toUpperCase())}
              />
              {recipientName && <span style={styles.successText}>✓ Recipient: {recipientName}</span>}
              {recipientError && <span style={styles.errorText}>✗ {recipientError}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Transfer Amount ($)</label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                className="form-control"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Remarks / Description</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter memo/note..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading || !amount || recipientError} className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              {loading ? 'Processing Transfer...' : 'Confirm Transfer'}
            </button>
          </form>
        </div>

        {/* Right side: Quick Info */}
        <div style={styles.infoWrapper}>
          <div className="glass-card" style={styles.balanceCard}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sender Wallet Balance</span>
            <div style={styles.balanceVal}>${mainBalance.toFixed(2)}</div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Only funds residing in your <strong>Main Wallet</strong> can be transferred.
            </p>
          </div>

          <div className="glass-card" style={styles.infoCard}>
            <h4 style={{ color: '#fff', marginBottom: '12px' }}>Transfer Policy</h4>
            <ul style={styles.list}>
              <li>Transfers are processed in real-time.</li>
              <li>Recipient will receive funds directly in their <strong>Recharge Wallet</strong>.</li>
              <li>P2P transfers are final and cannot be reversed by members.</li>
            </ul>
          </div>
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
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },
  formCard: {
    padding: '30px',
  },
  infoWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  balanceCard: {
    padding: '24px',
    background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.05))',
  },
  balanceVal: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#fff',
    marginTop: '4px',
  },
  infoCard: {
    padding: '24px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    fontSize: '13px',
    color: 'var(--text-muted)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
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
  successText: {
    color: 'var(--success)',
    fontSize: '12px',
    fontWeight: '600',
    marginTop: '4px',
    display: 'block',
  },
  errorText: {
    color: 'var(--danger)',
    fontSize: '12px',
    fontWeight: '600',
    marginTop: '4px',
    display: 'block',
  },
};

export default FundTransfer;
