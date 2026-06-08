import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal states for Wallet Credit
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [walletType, setWalletType] = useState('main');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.admin.getUsers(search, statusFilter);
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, statusFilter]);

  const handleToggleStatus = async (userId) => {
    try {
      const res = await api.admin.toggleUserStatus(userId);
      if (res.success) {
        // Optimistically toggle user status in UI
        setUsers(prev => prev.map(u => 
          u._id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
        ));
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const openCreditModal = (user) => {
    setSelectedUser(user);
    setWalletType('main');
    setAmount('');
    setDescription('');
    setFeedback('');
    setModalOpen(true);
  };

  const handleCreditSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setFeedback({ type: 'error', text: 'Please enter a valid amount greater than 0' });
      return;
    }
    
    setSubmitting(true);
    setFeedback('');
    try {
      const res = await api.admin.creditUserWallet(
        selectedUser._id,
        walletType,
        parseFloat(amount),
        description
      );

      if (res.success) {
        setFeedback({ type: 'success', text: `Successfully credited $${amount} to ${selectedUser.username}` });
        // Refresh users in background
        fetchUsers();
        // Auto close modal after 1.5 seconds
        setTimeout(() => {
          setModalOpen(false);
        }, 1500);
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to credit wallet' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>User Management</h1>
        <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Supervise registered members, activate accounts, and adjust balances</p>
      </div>

      {/* Filter Bar */}
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
        <div style={{ flexGrow: 1, minWidth: '250px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search by username, name, email, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="panel-input"
            style={{ width: '100%', margin: 0, paddingLeft: '40px' }}
          />
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
        </div>

        {/* Status Filter */}
        <div style={{ minWidth: '150px' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="panel-input"
            style={{ width: '100%', margin: 0 }}
          >
            <option value="">All Statuses</option>
            <option value="active">Active Members</option>
            <option value="inactive">Inactive Members</option>
          </select>
        </div>
      </div>

      {/* Users Table / List */}
      <div className="detail-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <div className="panel-spinner" style={{ margin: '0 auto 16px auto', borderTopColor: '#8b5cf6' }}></div>
            Loading network members...
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>No members found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="genealogy-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Username / Name</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Contact Info</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Sponsor / Parent</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Wallet Balances</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', textAlign: 'center' }}>Account Status</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} className="table-row-hover">
                    {/* User profile */}
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: user.isAdmin ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'rgba(255,255,255,0.03)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          border: user.isAdmin ? '2px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(255,255,255,0.05)'
                        }}>
                          {user.isAdmin ? '👑' : (user.name ? user.name.charAt(0).toUpperCase() : 'U')}
                        </div>
                        <div>
                          <span style={{ fontWeight: 'bold', display: 'block', fontSize: '14px' }}>{user.name}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {user.username} {user.isAdmin && <span style={{ color: '#c084fc', fontWeight: 'bold' }}>(Admin)</span>}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td style={{ padding: '16px 24px', fontSize: '13px' }}>
                      <span style={{ display: 'block' }}>📧 {user.email}</span>
                      <span style={{ display: 'block', color: 'var(--text-muted)', marginTop: '4px' }}>📱 {user.mobile}</span>
                    </td>

                    {/* Hierarchy Placement */}
                    <td style={{ padding: '16px 24px', fontSize: '13px' }}>
                      <span style={{ display: 'block' }}>Sponsor: <strong style={{ color: '#c084fc' }}>{user.sponsorId || 'ROOT'}</strong></span>
                      <span style={{ display: 'block', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Parent: {user.parentId || 'ROOT'} ({user.position})
                      </span>
                    </td>

                    {/* Wallets */}
                    <td style={{ padding: '16px 24px', fontSize: '13px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
                        <span>Main: <strong style={{ color: '#34d399' }}>${user.wallets?.main.toFixed(2)}</strong></span>
                        <span>Recharge: <strong style={{ color: '#60a5fa' }}>${user.wallets?.recharge.toFixed(2)}</strong></span>
                        <span>Income: <strong style={{ color: '#fbbf24' }}>${user.wallets?.income.toFixed(2)}</strong></span>
                        <span>Reward: <strong style={{ color: '#f472b6' }}>${user.wallets?.reward?.toFixed(2) || '0.00'}</strong></span>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleToggleStatus(user._id)}
                        disabled={user.isAdmin}
                        style={{
                          background: user.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          border: `1px solid ${user.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                          color: user.status === 'active' ? '#34d399' : '#f87171',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: user.isAdmin ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          width: '100px'
                        }}
                        className={!user.isAdmin ? 'status-toggle-btn' : ''}
                      >
                        {user.status === 'active' ? 'Active ✓' : 'Inactive ✗'}
                      </button>
                    </td>

                    {/* Action Tools */}
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button
                        onClick={() => openCreditModal(user)}
                        className="panel-btn-primary"
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                          borderColor: 'transparent',
                          borderRadius: '8px',
                          boxShadow: 'none'
                        }}
                      >
                        Credit Funds 💸
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Wallet Credit Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 8, 16, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div className="detail-card" style={{
            width: '100%',
            maxWidth: '480px',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.15)',
            position: 'relative',
            animation: 'fadeInUp 0.3s ease-out'
          }}>
            {/* Close */}
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '24px',
                cursor: 'pointer',
                opacity: 0.5
              }}
            >
              &times;
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0' }}>Manual Wallet Adjustment</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 24px 0' }}>
              Crediting account: <strong style={{ color: '#c084fc' }}>{selectedUser?.name} ({selectedUser?.username})</strong>
            </p>

            {/* Modal alerts */}
            {feedback && (
              <div style={{
                background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${feedback.type === 'success' ? '#10b981' : '#ef4444'}`,
                padding: '12px 16px',
                borderRadius: '8px',
                color: feedback.type === 'success' ? '#34d399' : '#f87171',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '20px'
              }}>
                {feedback.text}
              </div>
            )}

            <form onSubmit={handleCreditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Wallet select */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>
                  Target Wallet
                </label>
                <select
                  value={walletType}
                  onChange={(e) => setWalletType(e.target.value)}
                  className="panel-input"
                  style={{ width: '100%', margin: 0 }}
                  required
                >
                  <option value="main">Main Wallet (Accrued/Available)</option>
                  <option value="recharge">Recharge Wallet (For Packages)</option>
                  <option value="income">Income Wallet (Earned Profits)</option>
                  <option value="reward">Reward Wallet (Rank bonuses)</option>
                </select>
              </div>

              {/* Amount input */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>
                  Credit Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Enter amount to credit (e.g. 100.00)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="panel-input"
                  style={{ width: '100%', margin: 0 }}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>
                  Transaction Remarks
                </label>
                <textarea
                  placeholder="Reason for wallet manual adjustment (e.g. Support adjustment)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="panel-input"
                  style={{ width: '100%', margin: 0, height: '70px', resize: 'none' }}
                  required
                />
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="panel-btn-secondary"
                  style={{ flexGrow: 1, padding: '12px 0', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="panel-btn-primary"
                  style={{
                    flexGrow: 1,
                    padding: '12px 0',
                    background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                    borderColor: 'transparent',
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? 'Crediting...' : 'Confirm Credit ⚡'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
