import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Packages = () => {
  const { user, refreshProfile } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyLoading, setBuyLoading] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  const fetchPackages = async () => {
    try {
      const res = await api.packages.getPackages();
      if (res.success) {
        setPackages(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleBuy = async (packageId, packageName) => {
    setFeedback({ type: '', msg: '' });
    
    // Quick confirm check
    const confirmBuy = window.confirm(`Confirm purchase of ${packageName}? The price will be deducted from your Recharge / Main wallet.`);
    if (!confirmBuy) return;

    setBuyLoading(packageId);
    try {
      const res = await api.packages.buyPackage(packageId);
      if (res.success) {
        setFeedback({ type: 'success', msg: res.message });
        await refreshProfile(); // Refresh context user profile state (status active, new package, etc.)
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Purchase failed. Insufficient funds.' });
    } finally {
      setBuyLoading(null);
    }
  };

  return (
    <div className="animate-fade" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Membership & Investment Packages</h1>
        <p style={{ color: 'var(--text-muted)' }}>Purchase a package using Recharge / Main wallet balances to activate binary rewards, daily ROI, and team commissions.</p>
      </div>

      {feedback.msg && (
        <div style={feedback.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {feedback.msg}
        </div>
      )}

      {user?.status === 'active' && (
        <div style={styles.activeNotice}>
          🎉 <strong>Your account is active!</strong> You are currently yielding returns on your package.
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>Loading investment tiers...</div>
      ) : (
        <div style={styles.grid}>
          {packages.map((pkg) => {
            const isCurrent = user?.activePackage === pkg._id;
            return (
              <div key={pkg._id} className="glass-card" style={styles.card}>
                {isCurrent && <span style={styles.activeTag}>Current Plan</span>}
                
                <h3 style={styles.name}>{pkg.name}</h3>
                <div style={styles.price}>${pkg.price}</div>
                
                <ul style={styles.list}>
                  <li>Daily Yield ROI: <strong style={{ color: 'var(--secondary)' }}>{pkg.roi}%</strong></li>
                  <li>Business Volume (BV): <strong>{pkg.bv}</strong></li>
                  <li>Daily Matching Capping: <strong>${pkg.maxIncome}</strong></li>
                  <li>Validity Duration: <strong>{pkg.validity} Days</strong></li>
                </ul>

                <button
                  disabled={buyLoading === pkg._id || user?.status === 'active'}
                  onClick={() => handleBuy(pkg._id, pkg.name)}
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '20px' }}
                >
                  {buyLoading === pkg._id ? 'Activating...' : user?.status === 'active' ? 'Package Active' : 'Buy Now'}
                </button>
              </div>
            );
          })}
        </div>
      )}
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
  },
  card: {
    padding: '36px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
  },
  activeTag: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'rgba(16,185,129,0.15)',
    color: 'var(--success)',
    border: '1px solid var(--success)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '600',
  },
  name: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--secondary)',
  },
  price: {
    fontSize: '38px',
    fontWeight: '800',
    color: '#fff',
    margin: '16px 0',
  },
  list: {
    listStyle: 'none',
    textAlign: 'left',
    padding: '20px 0 0',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    fontSize: '14px',
    color: 'var(--text-muted)',
    flexGrow: 1,
  },
  activeNotice: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--success)',
    border: '1px solid var(--success)',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '14px',
    textAlign: 'center',
  },
  successAlert: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--success)',
    border: '1px solid var(--success)',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    textAlign: 'center',
  },
  errorAlert: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: 'var(--danger)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '14px',
    padding: '40px 0',
  },
};

export default Packages;
