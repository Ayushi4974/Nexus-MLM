import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // pending or processed

  // Action remarks states
  const [processingId, setProcessingId] = useState(null);
  const [actionType, setActionType] = useState(''); // approve or reject
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      // Fetch withdrawals. status filter is passed to endpoint
      const statusFilter = activeTab === 'pending' ? 'pending' : '';
      const res = await api.admin.getWithdrawals(statusFilter);
      if (res.success) {
        let list = res.data;
        if (activeTab === 'processed') {
          // Filter out pending
          list = list.filter(w => w.status !== 'pending');
        }
        setWithdrawals(list);
      }
    } catch (err) {
      console.error('Error fetching withdrawals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [activeTab]);

  const startAction = (id, type) => {
    setProcessingId(id);
    setActionType(type);
    setRemarks(type === 'approve' ? 'Payout disbursed successfully' : 'Invalid bank details / account inactive');
  };

  const cancelAction = () => {
    setProcessingId(null);
    setActionType('');
    setRemarks('');
  };

  const handleProcessAction = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let res;
      if (actionType === 'approve') {
        res = await api.admin.approveWithdrawal(processingId, remarks);
      } else {
        res = await api.admin.rejectWithdrawal(processingId, remarks);
      }

      if (res.success) {
        // Remove from current list optimistically or refetch
        setWithdrawals(prev => prev.filter(w => w._id !== processingId));
        cancelAction();
        fetchWithdrawals();
      }
    } catch (err) {
      alert(err.message || 'Failed to process request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>Payout Management</h1>
        <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Review withdrawal requests, check banking coordinates, and disburse yields</p>
      </div>

      {/* Tabs bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        gap: '24px'
      }}>
        <button
          onClick={() => { setActiveTab('pending'); cancelAction(); }}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: `2px solid ${activeTab === 'pending' ? '#8b5cf6' : 'transparent'}`,
            color: activeTab === 'pending' ? '#fff' : 'var(--text-muted)',
            padding: '12px 8px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          📥 Pending Requests ({withdrawals.filter(w => w.status === 'pending').length + (activeTab !== 'pending' ? '...' : '')})
        </button>
        <button
          onClick={() => { setActiveTab('processed'); cancelAction(); }}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: `2px solid ${activeTab === 'processed' ? '#8b5cf6' : 'transparent'}`,
            color: activeTab === 'processed' ? '#fff' : 'var(--text-muted)',
            padding: '12px 8px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          ✓ Processed History
        </button>
      </div>

      {/* Main List */}
      <div className="detail-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <div className="panel-spinner" style={{ margin: '0 auto 16px auto', borderTopColor: '#8b5cf6' }}></div>
            Loading withdrawal requests...
          </div>
        ) : withdrawals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            No {activeTab} withdrawals found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="genealogy-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Requestor Info</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Amounts Breakdown</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Bank Coordinates</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Request Date</th>
                  {activeTab === 'processed' && <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Outcome Details</th>}
                  {activeTab === 'pending' && <th style={{ padding: '16px 24px', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((wth) => (
                  <tr key={wth._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} className="table-row-hover">
                    {/* User profile */}
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ fontWeight: 'bold', display: 'block', fontSize: '14px' }}>
                        {wth.user?.name || 'Network Member'}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {wth.user?.username || 'MLM000000'}
                      </span>
                    </td>

                    {/* Amounts */}
                    <td style={{ padding: '16px 24px', fontSize: '13px' }}>
                      <span>Gross Request: <strong>${wth.amount.toFixed(2)}</strong></span>
                      <span style={{ display: 'block', color: '#f87171', marginTop: '4px' }}>Fee (10%): -${wth.charges.toFixed(2)}</span>
                      <span style={{ display: 'block', color: '#34d399', fontWeight: 'bold', marginTop: '4px' }}>
                        Payable: ${wth.payableAmount.toFixed(2)}
                      </span>
                    </td>

                    {/* Bank Coordinates */}
                    <td style={{ padding: '16px 24px', fontSize: '13px' }}>
                      <strong style={{ color: '#fff' }}>{wth.bankDetails?.holderName}</strong>
                      <span style={{ display: 'block', color: 'var(--text-muted)', marginTop: '4px' }}>
                        🏦 {wth.bankDetails?.bankName} (IFSC: {wth.bankDetails?.ifsc})
                      </span>
                      <span style={{ display: 'block', color: 'var(--text-muted)', marginTop: '2px' }}>
                        💳 Account: {wth.bankDetails?.accountNumber}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      {new Date(wth.createdAt).toLocaleString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>

                    {/* Outcome or Action Column */}
                    {activeTab === 'processed' && (
                      <td style={{ padding: '16px 24px', fontSize: '13px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: wth.status === 'approved' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                          color: wth.status === 'approved' ? '#34d399' : '#f87171',
                          display: 'inline-block'
                        }}>
                          {wth.status}
                        </span>
                        {wth.remarks && (
                          <span style={{ display: 'block', color: 'var(--text-muted)', marginTop: '6px', fontStyle: 'italic' }}>
                            Remarks: "{wth.remarks}"
                          </span>
                        )}
                      </td>
                    )}

                    {activeTab === 'pending' && (
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        {processingId === wth._id ? (
                          /* Inline Action Form */
                          <form onSubmit={handleProcessAction} style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '220px', marginLeft: 'auto' }}>
                            <span style={{ fontSize: '11px', color: actionType === 'approve' ? '#34d399' : '#f87171', fontWeight: 'bold', textAlign: 'left' }}>
                              Confirming {actionType === 'approve' ? 'Approval' : 'Rejection'}...
                            </span>
                            <input
                              type="text"
                              value={remarks}
                              onChange={(e) => setRemarks(e.target.value)}
                              placeholder="Enter audit remarks..."
                              className="panel-input"
                              style={{ margin: 0, padding: '4px 8px', fontSize: '12px' }}
                              required
                            />
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={cancelAction}
                                className="panel-btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '11px', flexGrow: 1 }}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={submitting}
                                className="panel-btn-primary"
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '11px',
                                  flexGrow: 1,
                                  background: actionType === 'approve' ? '#10b981' : '#ef4444',
                                  borderColor: 'transparent'
                                }}
                              >
                                {submitting ? 'Saving...' : 'Submit ✓'}
                              </button>
                            </div>
                          </form>
                        ) : (
                          /* Standard Approve/Reject Triggers */
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => startAction(wth._id, 'approve')}
                              style={{
                                padding: '6px 12px',
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                color: '#34d399',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              className="status-toggle-btn"
                            >
                              Approve 🟢
                            </button>
                            <button
                              onClick={() => startAction(wth._id, 'reject')}
                              style={{
                                padding: '6px 12px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                color: '#f87171',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              className="status-toggle-btn"
                            >
                              Reject 🔴
                            </button>
                          </div>
                        )}
                      </td>
                    )}
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

export default AdminWithdrawals;
