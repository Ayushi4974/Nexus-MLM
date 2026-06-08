import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

const Wallet = () => {
  const [balances, setBalances] = useState({ main: 0, income: 0, recharge: 0, reward: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchWalletDetails = async () => {
    setLoading(true);
    try {
      const balRes = await api.wallet.getBalances();
      if (balRes.success) setBalances(balRes.data);

      const txRes = await api.wallet.getTransactions({
        type: typeFilter,
        search: search,
      });
      if (txRes.success) setTransactions(txRes.data);
    } catch (err) {
      console.error('Failed to load wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletDetails();
  }, [typeFilter, search]);

  return (
    <div className="animate-fade" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>My Wallets & Accounts</h1>
        <p style={{ color: 'var(--text-muted)' }}>Monitor your balances, rewards payouts, recharge deposits, and ledger statements.</p>
      </div>

      {/* Wallet Cards Grid */}
      <div className="dashboard-grid">
        {/* Main Wallet */}
        <div className="glass-card" style={styles.walletCard}>
          <div>
            <span style={styles.cardLabel}>Main Wallet</span>
            <div style={styles.cardVal}>${balances.main.toFixed(2)}</div>
            <p style={styles.cardDesc}>Available for P2P transfers and activation buybacks.</p>
          </div>
          <div style={{ ...styles.cardIcon, color: 'var(--primary)', background: 'var(--primary-glow)' }}>💳</div>
        </div>

        {/* Income Wallet */}
        <div className="glass-card" style={styles.walletCard}>
          <div>
            <span style={styles.cardLabel}>Income Wallet</span>
            <div style={styles.cardVal}>${balances.income.toFixed(2)}</div>
            <p style={styles.cardDesc}>Referral matching earnings. Ready for bank payouts.</p>
          </div>
          <div style={{ ...styles.cardIcon, color: 'var(--success)', background: 'rgba(16, 185, 129, 0.15)' }}>💰</div>
        </div>

        {/* Recharge Wallet */}
        <div className="glass-card" style={styles.walletCard}>
          <div>
            <span style={styles.cardLabel}>Recharge Wallet</span>
            <div style={styles.cardVal}>${balances.recharge.toFixed(2)}</div>
            <p style={styles.cardDesc}>Preloaded deposits for package purchasing.</p>
          </div>
          <div style={{ ...styles.cardIcon, color: 'var(--secondary)', background: 'var(--secondary-glow)' }}>⚡</div>
        </div>

        {/* Reward Wallet */}
        <div className="glass-card" style={styles.walletCard}>
          <div>
            <span style={styles.cardLabel}>Reward Wallet</span>
            <div style={styles.cardVal}>${balances.reward.toFixed(2)}</div>
            <p style={styles.cardDesc}>Bonuses generated from leader rank advancements.</p>
          </div>
          <div style={{ ...styles.cardIcon, color: 'var(--warning)', background: 'var(--warning-glow)' }}>🏆</div>
        </div>
      </div>

      {/* Transactions Table Section */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ color: '#fff', marginBottom: '20px' }}>Transaction History</h3>

        {/* Filters */}
        <div style={styles.toolbar}>
          <input
            type="text"
            className="form-control"
            placeholder="Search descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '8px 14px', maxWidth: '280px' }}
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-control"
            style={{ padding: '8px 12px', width: '150px', cursor: 'pointer' }}
          >
            <option value="">All Statement Types</option>
            <option value="credit">Credits Only (+)</option>
            <option value="debit">Debits Only (-)</option>
          </select>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading statement history...</div>
        ) : transactions.length === 0 ? (
          <div style={styles.loading}>No transactions found for this search.</div>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: '20px' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tr}>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Statement Type</th>
                  <th style={styles.th}>Income Category</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const isCredit = tx.type === 'credit';
                  return (
                    <tr key={tx._id} style={styles.row}>
                      <td style={styles.td}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td style={{ ...styles.td, textTransform: 'capitalize', fontWeight: '600', color: isCredit ? 'var(--success)' : 'var(--danger)' }}>
                        {tx.type}
                      </td>
                      <td style={styles.td}>{tx.incomeType}</td>
                      <td style={styles.td}>{tx.description}</td>
                      <td style={{ ...styles.td, fontWeight: '700', color: isCredit ? 'var(--success)' : 'var(--danger)' }}>
                        {isCredit ? '+' : '-'}${tx.amount.toFixed(2)}
                      </td>
                      <td style={styles.td}>
                        <span className={`badge ${tx.status === 'success' ? 'badge-active' : tx.status === 'pending' ? 'badge-pending' : 'badge-inactive'}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
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
  walletCard: {
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  cardVal: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#fff',
    margin: '6px 0',
  },
  cardDesc: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    lineHeight: '1.4',
    marginTop: '4px',
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
  toolbar: {
    display: 'flex',
    gap: '16px',
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

export default Wallet;
