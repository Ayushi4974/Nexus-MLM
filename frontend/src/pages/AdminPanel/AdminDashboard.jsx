import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import AnimatedCounter from '../../components/Common/AnimatedCounter';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cronRunning, setCronRunning] = useState(false);
  const [message, setMessage] = useState('');
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTxs, setRecentTxs] = useState([]);

  const fetchStats = async () => {
    try {
      const statsRes = await api.admin.getStats();
      if (statsRes.success) {
        setStats(statsRes.data);
      }

      const usersRes = await api.admin.getUsers();
      if (usersRes.success) {
        // Sort and take latest 5 users
        const latestUsers = [...usersRes.data]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentUsers(latestUsers);
      }

      const txRes = await api.admin.getTransactions();
      if (txRes.success) {
        // Take latest 5 transactions
        const latestTxs = [...txRes.data].slice(0, 5);
        setRecentTxs(latestTxs);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRunRoi = async () => {
    setCronRunning(true);
    setMessage('');
    try {
      const res = await api.admin.runRoiCron();
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        // Refresh dashboard stats
        fetchStats();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to process ROI cron' });
    } finally {
      setCronRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="panel-loader-container" style={{ minHeight: '60vh' }}>
        <div className="panel-spinner" style={{ borderTopColor: '#8b5cf6' }}></div>
        <span style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Compiling statistics...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Page Title & Interactive Cron Run Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>System Overview</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Real-time telemetry and management controls</p>
        </div>

        {/* Cron trigger box */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          padding: '12px 24px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>Simulate Schedule</span>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#c084fc' }}>Daily ROI Calculation</span>
          </div>
          <button
            onClick={handleRunRoi}
            disabled={cronRunning}
            className="panel-btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              borderColor: 'transparent',
              boxShadow: '0 0 15px rgba(139,92,246,0.3)',
              cursor: cronRunning ? 'not-allowed' : 'pointer'
            }}
          >
            {cronRunning ? 'Calculating...' : 'Run Daily ROI ⚡'}
          </button>
        </div>
      </div>

      {/* Trigger Notification message */}
      {message && (
        <div style={{
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
          padding: '16px 20px',
          borderRadius: '12px',
          color: message.type === 'success' ? '#34d399' : '#f87171',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          <span>{message.type === 'success' ? '✅' : '❌'}</span>
          <span>{message.text}</span>
        </div>
      )}

      {/* Telemetry Cards Grid */}
      <div className="dashboard-grid">
        {/* Total Users */}
        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/users')}>
          <div className="metric-card-header">
            <span className="metric-card-title">Registered Network</span>
            <span className="metric-card-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#a855f7' }}>👥</span>
          </div>
          <div className="metric-card-value">
            <AnimatedCounter to={stats?.totalUsers || 0} />
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '13px' }}>
            <span style={{ color: '#34d399', fontWeight: 'bold' }}>● {stats?.activeUsers} Active</span>
            <span style={{ color: 'var(--text-muted)' }}>● {stats?.inactiveUsers} Inactive</span>
          </div>
        </div>

        {/* Total Sales Revenue */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-card-title">Sales Revenue</span>
            <span className="metric-card-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>💼</span>
          </div>
          <div className="metric-card-value" style={{ color: '#10b981' }}>
            $<AnimatedCounter to={stats?.totalRevenue || 0} decimals={2} />
          </div>
          <p className="metric-card-sub" style={{ margin: '12px 0 0 0' }}>Cumulative package activations</p>
        </div>

        {/* Distributed Commissions */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-card-title">Payouts Distributed</span>
            <span className="metric-card-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>💰</span>
          </div>
          <div className="metric-card-value" style={{ color: '#f59e0b' }}>
            $<AnimatedCounter to={stats?.totalIncomeDistributed || 0} decimals={2} />
          </div>
          <p className="metric-card-sub" style={{ margin: '12px 0 0 0' }}>Direct referral, Level, ROI yields</p>
        </div>

        {/* Pending Payout Requests */}
        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/withdrawals')}>
          <div className="metric-card-header">
            <span className="metric-card-title">Pending Withdrawals</span>
            <span className="metric-card-icon" style={{
              background: stats?.pendingWithdrawalsCount > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)',
              color: stats?.pendingWithdrawalsCount > 0 ? '#ef4444' : 'var(--text-muted)'
            }}>📤</span>
          </div>
          <div className="metric-card-value" style={{ color: stats?.pendingWithdrawalsCount > 0 ? '#f87171' : '#fff' }}>
            <AnimatedCounter to={stats?.pendingWithdrawalsCount || 0} />
          </div>
          <div style={{ marginTop: '12px', fontSize: '13px' }}>
            {stats?.pendingWithdrawalsCount > 0 ? (
              <span style={{ color: '#f87171', fontWeight: 'bold', animation: 'pulse 2s infinite' }}>⚠️ Requires Approval action</span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>Audit queue cleared</span>
            )}
          </div>
        </div>
      </div>

      {/* Dual Activity Grids */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '30px',
        marginTop: '10px'
      }}>
        {/* Recent Registrations */}
        <div className="detail-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Recent Registrations</h3>
            <button onClick={() => navigate('/admin/users')} className="panel-btn-text" style={{ color: '#a855f7' }}>View All</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>No recent signups.</div>
            ) : (
              recentUsers.map(user => (
                <div key={user._id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  padding: '12px 20px',
                  borderRadius: '12px'
                }}>
                  <div>
                    <span style={{ fontWeight: 'bold', display: 'block', fontSize: '14px' }}>{user.name}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.username} • {user.email}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: user.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                      color: user.status === 'active' ? '#34d399' : 'var(--text-muted)'
                    }}>
                      {user.status}
                    </span>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions logs */}
        <div className="detail-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Recent Financial Activity</h3>
            <button onClick={() => navigate('/admin/transactions')} className="panel-btn-text" style={{ color: '#a855f7' }}>View Logs</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentTxs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>No transactions logged.</div>
            ) : (
              recentTxs.map(tx => (
                <div key={tx._id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  padding: '12px 20px',
                  borderRadius: '12px'
                }}>
                  <div>
                    <span style={{ fontWeight: 'bold', display: 'block', fontSize: '14px' }}>
                      {tx.incomeType || tx.type.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {tx.user ? tx.user.username : 'System'} • {tx.description}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontWeight: 'bold',
                      fontSize: '14px',
                      color: tx.type === 'debit' ? '#f87171' : '#34d399'
                    }}>
                      {tx.type === 'debit' ? '-' : '+'}${tx.amount.toFixed(2)}
                    </span>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
