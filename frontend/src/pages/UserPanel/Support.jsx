import React, { useState } from 'react';

const Support = () => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  
  const [success, setSuccess] = useState(false);
  const [tickets, setTickets] = useState([
    { id: 'TKT-8832', subject: 'Binary Points Delay', category: 'commissions', status: 'resolved', date: '2026-05-28' },
    { id: 'TKT-9104', subject: 'IFSC Code Error Alert', category: 'profile', status: 'resolved', date: '2026-05-29' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add simulated ticket
    const newTkt = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject,
      category,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };

    setTickets((prev) => [newTkt, ...prev]);
    setSuccess(true);
    setSubject('');
    setMessage('');
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="animate-fade" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Member Support Center</h1>
        <p style={{ color: 'var(--text-muted)' }}>Submit tickets regarding matching delays, wallet issues, or package upgrades.</p>
      </div>

      {/* Grid */}
      <div style={styles.grid}>
        {/* Form */}
        <div className="glass-card" style={styles.formCard}>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>Create Ticket</h3>

          {success && (
            <div style={styles.success}>
              Support ticket created successfully. Check the status in the history log.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
                style={{ padding: '8px 12px', cursor: 'pointer' }}
              >
                <option value="general">General Inquiry</option>
                <option value="commissions">Commissions & BV matching</option>
                <option value="wallets">Wallets & Fund Transfer</option>
                <option value="withdrawals">Bank Withdrawals</option>
                <option value="profile">Profile & Security Settings</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="E.g., Missing binary payout"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message Details</label>
              <textarea
                required
                rows="4"
                className="form-control"
                placeholder="Describe your issue in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              Submit Ticket
            </button>
          </form>
        </div>

        {/* Ticket List */}
        <div className="glass-card" style={styles.historyCard}>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>Ticket History</h3>
          
          <div style={styles.ticketList}>
            {tickets.map((tkt) => (
              <div key={tkt.id} style={styles.ticketRow}>
                <div style={styles.rowHeader}>
                  <strong style={{ color: 'var(--secondary)' }}>{tkt.id}</strong>
                  <span className={`badge ${tkt.status === 'resolved' ? 'badge-active' : 'badge-pending'}`}>
                    {tkt.status}
                  </span>
                </div>
                <div style={styles.rowSubject}>{tkt.subject}</div>
                <div style={styles.rowMeta}>
                  <span>Category: {tkt.category}</span>
                  <span>Date: {tkt.date}</span>
                </div>
              </div>
            ))}
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
  historyCard: {
    padding: '30px',
  },
  ticketList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  ticketRow: {
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '16px',
  },
  rowHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  rowSubject: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
  },
  rowMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '6px',
  },
  success: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--success)',
    border: '1px solid var(--success)',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '20px',
  },
};

export default Support;
