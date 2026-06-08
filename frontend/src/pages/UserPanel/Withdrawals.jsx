import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

const Withdrawals = () => {
  const [incomeBalance, setIncomeBalance] = useState(0);
  const [bankDetails, setBankDetails] = useState({ accountNumber: '', ifsc: '', bankName: '', holderName: '' });
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form input
  const [amount, setAmount] = useState('');
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchWithdrawalData = async () => {
    setLoading(true);
    try {
      const balRes = await api.wallet.getBalances();
      if (balRes.success) setIncomeBalance(balRes.data.income);

      const profileRes = await api.user.getProfile();
      if (profileRes.success) setBankDetails(profileRes.data.bankDetails);

      const historyRes = await api.wallet.getWithdrawals();
      if (historyRes.success) setWithdrawals(historyRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalData();
  }, []);

  const hasBankDetails = bankDetails.accountNumber && bankDetails.ifsc && bankDetails.bankName && bankDetails.holderName;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!hasBankDetails) {
      setFormError('Please configure your bank details in Profile settings first');
      return;
    }

    if (Number(amount) < 10) {
      setFormError('Minimum withdrawal amount is $10');
      return;
    }

    if (Number(amount) > incomeBalance) {
      setFormError('Insufficient balance in Income Wallet');
      return;
    }

    setSubmitLoading(true);
    try {
      const res = await api.wallet.requestWithdrawal(Number(amount));
      if (res.success) {
        setSuccessMsg(res.message);
        setIncomeBalance(incomeBalance - Number(amount));
        setAmount('');
        // Refresh history
        const historyRes = await api.wallet.getWithdrawals();
        if (historyRes.success) setWithdrawals(historyRes.data);
      }
    } catch (err) {
      setFormError(err.message || 'Withdrawal request failed');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="animate-fade" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Withdraw Network Earnings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Request payouts directly to your linked bank account. Processing carries a 10% fee.</p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-grid">
        {/* Available Balance */}
        <div className="glass-card" style={styles.statCard}>
          <div>
            <span style={styles.cardLabel}>Available Balance</span>
            <div style={styles.cardVal}>${incomeBalance.toFixed(2)}</div>
          </div>
          <div style={{ ...styles.cardIcon, color: 'var(--success)', background: 'rgba(16, 185, 129, 0.15)' }}>💰</div>
        </div>

        {/* Min Withdrawal */}
        <div className="glass-card" style={styles.statCard}>
          <div>
            <span style={styles.cardLabel}>Minimum Withdrawal Limit</span>
            <div style={styles.cardVal}>$10.00</div>
          </div>
          <div style={{ ...styles.cardIcon, color: 'var(--secondary)', background: 'var(--secondary-glow)' }}>🔒</div>
        </div>

        {/* Charges */}
        <div className="glass-card" style={styles.statCard}>
          <div>
            <span style={styles.cardLabel}>Admin & TDS Fee</span>
            <div style={styles.cardVal}>10% Flat</div>
          </div>
          <div style={{ ...styles.cardIcon, color: 'var(--danger)', background: 'var(--danger-glow)' }}>🛡</div>
        </div>
      </div>

      {/* Grid */}
      <div style={styles.grid}>
        {/* Left side: Form */}
        <div className="glass-card" style={styles.formCard}>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>Payout Form</h3>

          {formError && <div style={styles.errorAlert}>{formError}</div>}
          {successMsg && <div style={styles.successAlert}>{successMsg}</div>}

          {!hasBankDetails && (
            <div style={styles.bankWarning}>
              ⚠️ <strong>Bank details incomplete.</strong> Go to the <a href="/profile" style={{ color: 'var(--secondary)', textDecoration: 'underline' }}>Profile Page</a> to link bank parameters before trying to withdraw.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Withdrawal Amount ($)</label>
              <input
                type="number"
                required
                min="10"
                step="0.01"
                className="form-control"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!hasBankDetails}
              />
              {amount && (
                <div style={styles.estimates}>
                  <div>Processing Fee (10%): <span style={{ color: 'var(--danger)' }}>-${(amount * 0.1).toFixed(2)}</span></div>
                  <div style={{ fontWeight: '600', color: '#fff', marginTop: '4px' }}>Net Payable Amount: <span style={{ color: 'var(--success)' }}>${(amount * 0.9).toFixed(2)}</span></div>
                </div>
              )}
            </div>

            {hasBankDetails && (
              <div style={styles.bankPreview}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Payout Target Account:</span>
                <div style={{ color: '#fff', fontSize: '13px', fontWeight: '500', marginTop: '4px' }}>
                  {bankDetails.bankName} - A/C: ****{bankDetails.accountNumber.slice(-4)}
                </div>
              </div>
            )}

            <button type="submit" disabled={submitLoading || !amount || !hasBankDetails} className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              {submitLoading ? 'Submitting request...' : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* Right side: History */}
        <div className="glass-card" style={styles.historyCard}>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>Withdrawal Log</h3>

          {loading ? (
            <div style={styles.loading}>Loading logs...</div>
          ) : withdrawals.length === 0 ? (
            <div style={styles.loading}>No withdrawals requested yet.</div>
          ) : (
            <div style={{ overflowY: 'auto', maxHeight: '340px' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tr}>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Requested</th>
                    <th style={styles.th}>Net Payout</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((wt) => (
                    <tr key={wt._id} style={styles.row}>
                      <td style={styles.td}>{new Date(wt.createdAt).toLocaleDateString()}</td>
                      <td style={styles.td}>${wt.amount.toFixed(2)}</td>
                      <td style={{ ...styles.td, color: 'var(--success)' }}>${wt.payableAmount.toFixed(2)}</td>
                      <td style={styles.td}>
                        <span className={`badge ${wt.status === 'approved' ? 'badge-active' : wt.status === 'pending' ? 'badge-pending' : 'badge-inactive'}`}>
                          {wt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
  statCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px',
  },
  cardLabel: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  cardVal: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#fff',
    marginTop: '6px',
  },
  cardIcon: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },
  formCard: {
    padding: '30px',
  },
  historyCard: {
    padding: '30px',
  },
  estimates: {
    marginTop: '12px',
    background: 'rgba(255,255,255,0.02)',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
  bankPreview: {
    margin: '16px 0',
    border: '1px solid var(--border-color)',
    padding: '12px',
    borderRadius: '6px',
  },
  bankWarning: {
    background: 'rgba(245, 158, 11, 0.08)',
    border: '1px solid var(--warning)',
    color: 'var(--warning)',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '13px',
    lineHeight: '1.5',
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
  loading: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '14px',
    padding: '40px 0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
  },
  th: {
    textAlign: 'left',
    padding: '12px 6px',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  row: {
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  },
  td: {
    padding: '12px 6px',
    color: 'var(--text-main)',
  },
};

export default Withdrawals;
