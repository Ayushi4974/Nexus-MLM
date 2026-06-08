import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../../services/api';

const Incomes = () => {
  const location = useLocation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Map pathnames to incomeType filters in the database
  const getIncomeParams = () => {
    const path = location.pathname;
    if (path.includes('/income/direct')) {
      return { type: 'Direct Referral', label: 'Direct Referral Income' };
    }
    if (path.includes('/income/binary')) {
      return { type: 'Binary Matching', label: 'Binary Matching Income' };
    }
    if (path.includes('/income/level')) {
      return { type: 'Level Income', label: 'Level Override Income' };
    }
    if (path.includes('/income/roi')) {
      return { type: 'ROI Daily', label: 'ROI Daily Income' };
    }
    if (path.includes('/income/reward')) {
      return { type: 'Reward', label: 'Reward & Ranks Bonuses' };
    }
    return { type: '', label: 'General Income' };
  };

  const { type, label } = getIncomeParams();

  useEffect(() => {
    const fetchIncomeTransactions = async () => {
      setLoading(true);
      try {
        const res = await api.wallet.getTransactions({
          type: 'credit',
          incomeType: type,
          search: search,
        });
        if (res.success) {
          setTransactions(res.data);
        }
      } catch (err) {
        console.error('Error fetching income transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncomeTransactions();
  }, [location.pathname, search]); // Re-fetch on route change or search trigger

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2);

  return (
    <div className="animate-fade" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>{label}</h1>
        <p style={{ color: 'var(--text-muted)' }}>Detailed logs of credits generated under your account profile.</p>
      </div>

      {/* Overview Card */}
      <div className="glass-card" style={styles.summaryCard}>
        <div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Accumulated</span>
          <div style={styles.totalVal}>${totalAmount}</div>
        </div>
        <div style={styles.badge}>Active Active-Yield</div>
      </div>

      {/* Filter and Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '10px 14px', maxWidth: '300px' }}
          />
        </form>

        {loading ? (
          <div style={styles.loading}>Loading transactional records...</div>
        ) : transactions.length === 0 ? (
          <div style={styles.loading}>No transactions found for {label}.</div>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: '20px' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tr}>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>From Partner</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id} style={styles.row}>
                    <td style={styles.td}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td style={styles.td}>{tx.incomeType}</td>
                    <td style={{ ...styles.td, fontWeight: '500' }}>
                      {tx.fromUser ? `${tx.fromUser.name} (${tx.fromUser.username})` : 'System / Auto'}
                    </td>
                    <td style={styles.td}>{tx.description}</td>
                    <td style={{ ...styles.td, color: 'var(--success)', fontWeight: 'bold' }}>+${tx.amount.toFixed(2)}</td>
                    <td style={styles.td}>
                      <span className="badge badge-active">{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
  summaryCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.05))',
  },
  totalVal: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#fff',
    marginTop: '4px',
  },
  badge: {
    background: 'rgba(6, 182, 212, 0.15)',
    color: 'var(--secondary)',
    border: '1px solid rgba(6, 182, 212, 0.25)',
    borderRadius: '4px',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: '600',
  },
  searchForm: {
    display: 'flex',
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
    fontSize: '14px',
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
  },
  th: {
    textAlign: 'left',
    padding: '16px 12px',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  row: {
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  },
  td: {
    padding: '16px 12px',
    color: 'var(--text-main)',
  },
};

export default Incomes;
