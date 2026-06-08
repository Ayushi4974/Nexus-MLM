import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const AdminTransactions = () => {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [incomeType, setIncomeType] = useState('');

  const fetchTxs = async () => {
    try {
      const res = await api.admin.getTransactions({
        type,
        incomeType,
        search
      });
      if (res.success) {
        setTxs(res.data);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTxs();
  }, [type, incomeType, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>System Audit Logs</h1>
        <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Comprehensive registry of commissions, wallet transfers, package purchases, and payouts</p>
      </div>

      {/* Filters Bar */}
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        padding: '16px 24px',
        borderRadius: '16px'
      }}>
        {/* Search */}
        <div style={{ flexGrow: 1, minWidth: '220px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search by username, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="panel-input"
            style={{ width: '100%', margin: 0, paddingLeft: '40px' }}
          />
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
        </div>

        {/* Type select */}
        <div style={{ minWidth: '130px' }}>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="panel-input"
            style={{ width: '100%', margin: 0 }}
          >
            <option value="">All Types</option>
            <option value="credit">Credits (Income)</option>
            <option value="debit">Debits (Expenses)</option>
          </select>
        </div>

        {/* Income Type filter */}
        <div style={{ minWidth: '160px' }}>
          <select
            value={incomeType}
            onChange={(e) => setIncomeType(e.target.value)}
            className="panel-input"
            style={{ width: '100%', margin: 0 }}
          >
            <option value="">All Categories</option>
            <option value="Direct Referral">Direct Referral Commission</option>
            <option value="Binary Income">Binary Matching Income</option>
            <option value="Level Income">Level Referral Income</option>
            <option value="ROI Income">ROI Yield Payouts</option>
            <option value="Reward Income">Reward & Rank Bonus</option>
            <option value="Package Buy">Package Activations</option>
            <option value="Fund Transfer">Wallet Transfers</option>
            <option value="refund">Refund Adjustments</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="detail-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <div className="panel-spinner" style={{ margin: '0 auto 16px auto', borderTopColor: '#8b5cf6' }}></div>
            Querying ledger databases...
          </div>
        ) : txs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>No transactions found matching query.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="genealogy-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Transaction ID</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>User</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Category / Source</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Description Remarks</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Amount</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {txs.map((tx) => (
                  <tr key={tx._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} className="table-row-hover">
                    {/* Tx ID */}
                    <td style={{ padding: '16px 24px', fontSize: '13px', fontFamily: 'monospace', color: 'var(--primary)' }}>
                      #{tx._id.substring(0, 10).toUpperCase()}...
                    </td>

                    {/* Member */}
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ fontWeight: 'bold', display: 'block', fontSize: '14px' }}>
                        {tx.user?.name || 'System / Guest'}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {tx.user?.username || 'MLM000000'}
                      </span>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '16px 24px', fontSize: '13px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: tx.incomeType ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)',
                        color: tx.incomeType ? '#c084fc' : '#fff'
                      }}>
                        {tx.incomeType || tx.type}
                      </span>
                      {tx.fromUser && (
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          From: {tx.fromUser.username}
                        </span>
                      )}
                    </td>

                    {/* Desc */}
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      {tx.description}
                    </td>

                    {/* Amount */}
                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 'bold' }}>
                      <span style={{ color: tx.type === 'debit' ? '#f87171' : '#34d399' }}>
                        {tx.type === 'debit' ? '-' : '+'}${tx.amount.toFixed(2)}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      {new Date(tx.createdAt).toLocaleString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
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

export default AdminTransactions;
