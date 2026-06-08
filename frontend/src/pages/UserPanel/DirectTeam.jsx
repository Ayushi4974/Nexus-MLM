import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

const DirectTeam = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchDirects = async () => {
    setLoading(true);
    try {
      const res = await api.team.getDirectTeam(page, 10, search);
      if (res.success) {
        setMembers(res.data);
        setTotalPages(res.pagination.pages || 1);
      }
    } catch (err) {
      console.error('Failed to load direct team:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirects();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDirects();
  };

  const filteredMembers = members.filter((member) => {
    if (statusFilter === 'all') return true;
    return member.status === statusFilter;
  });

  return (
    <div className="animate-fade" style={styles.container}>
      {/* Title */}
      <div style={styles.header}>
        <h1 style={styles.title}>Direct Sponsors Team</h1>
        <p style={{ color: 'var(--text-muted)' }}>View and search all partners registered directly under your Sponsor ID.</p>
      </div>

      {/* Toolbar */}
      <div className="glass-card" style={styles.toolbar}>
        <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by User ID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '10px 14px', maxWidth: '300px' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
            Search
          </button>
        </form>

        <div style={styles.filters}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-control"
            style={{ padding: '8px 12px', width: '130px', cursor: 'pointer' }}
          >
            <option value="all">All Members</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            Loading team reports...
          </div>
        ) : filteredMembers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            No matching direct team members found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tr}>
                  <th style={styles.th}>User ID</th>
                  <th style={styles.th}>Full Name</th>
                  <th style={styles.th}>Activated Package</th>
                  <th style={styles.th}>Tree Side</th>
                  <th style={styles.th}>Joining Date</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member._id} style={styles.row}>
                    <td style={{ ...styles.td, fontWeight: '600', color: '#fff' }}>{member.username}</td>
                    <td style={styles.td}>{member.name}</td>
                    <td style={styles.td}>
                      {member.activePackage ? member.activePackage.name : 'None'}
                    </td>
                    <td style={{ ...styles.td, textTransform: 'capitalize' }}>{member.position}</td>
                    <td style={styles.td}>{new Date(member.createdAt).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <span className={`badge ${member.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '13px' }}
            >
              ◀ Prev
            </button>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '13px' }}
            >
              Next ▶
            </button>
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
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    padding: '16px 24px',
  },
  searchForm: {
    display: 'flex',
    gap: '12px',
    flexGrow: 1,
  },
  filters: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
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
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '24px',
  },
};

export default DirectTeam;
