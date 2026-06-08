import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for Create/Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [targetId, setTargetId] = useState(null);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [roi, setRoi] = useState('');
  const [bv, setBv] = useState('');
  const [validity, setValidity] = useState('');
  const [maxIncome, setMaxIncome] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPackages = async () => {
    try {
      const res = await api.admin.getPackages();
      if (res.success) {
        setPackages(res.data);
      }
    } catch (err) {
      console.error('Error loading packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const openCreateModal = () => {
    setEditMode(false);
    setTargetId(null);
    setName('');
    setPrice('');
    setRoi('');
    setBv('');
    setValidity('360');
    setMaxIncome('');
    setModalOpen(true);
  };

  const openEditModal = (pkg) => {
    setEditMode(true);
    setTargetId(pkg._id || pkg.id);
    setName(pkg.name);
    setPrice(pkg.price);
    setRoi(pkg.roi);
    setBv(pkg.bv);
    setValidity(pkg.validity);
    setMaxIncome(pkg.maxIncome);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name,
      price: parseFloat(price),
      roi: parseFloat(roi),
      bv: parseInt(bv),
      validity: parseInt(validity),
      maxIncome: parseFloat(maxIncome)
    };

    try {
      let res;
      if (editMode) {
        res = await api.admin.updatePackage(targetId, payload);
      } else {
        res = await api.admin.createPackage(payload);
      }

      if (res.success) {
        setModalOpen(false);
        fetchPackages();
      }
    } catch (err) {
      alert(err.message || 'Failed to save package');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to delete this package? This cannot be undone.')) {
      return;
    }

    try {
      const res = await api.admin.deletePackage(id);
      if (res.success) {
        setPackages(prev => prev.filter(p => (p._id !== id && p.id !== id)));
      }
    } catch (err) {
      alert(err.message || 'Failed to delete package');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>Package Management</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Configure, edit, and introduce package yields for investment plans</p>
        </div>

        <button
          onClick={openCreateModal}
          className="panel-btn-primary"
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            background: 'linear-gradient(135deg, #a855f7, #6366f1)',
            borderColor: 'transparent',
            boxShadow: '0 0 15px rgba(139,92,246,0.3)'
          }}
        >
          Add New Package 📦+
        </button>
      </div>

      {/* Packages Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div className="panel-spinner" style={{ margin: '0 auto 16px auto', borderTopColor: '#8b5cf6' }}></div>
          Syncing package catalog...
        </div>
      ) : packages.length === 0 ? (
        <div className="detail-card" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          No packages found. Click "Add New Package" to get started.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {packages.map((pkg) => (
            <div
              key={pkg._id || pkg.id}
              className="detail-card"
              style={{
                position: 'relative',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '20px',
                transition: 'transform 0.2s',
                overflow: 'hidden'
              }}
              className="table-row-hover"
            >
              {/* Glass glowing accent */}
              <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '120px',
                height: '120px',
                background: 'rgba(139, 92, 246, 0.15)',
                borderRadius: '50%',
                filter: 'blur(30px)'
              }}></div>

              <div>
                {/* Header name */}
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '800', color: '#fff' }}>{pkg.name}</h3>
                <span style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  color: '#34d399',
                  display: 'block',
                  margin: '12px 0'
                }}>
                  ${pkg.price.toFixed(2)}
                </span>

                {/* Details list */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  paddingTop: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Daily ROI Yield:</span>
                    <strong style={{ color: '#fff' }}>{pkg.roi.toFixed(1)}%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Business Volume (BV):</span>
                    <strong style={{ color: '#fff' }}>{pkg.bv} BV</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Validity Duration:</span>
                    <strong style={{ color: '#fff' }}>{pkg.validity} Days</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Capping Max Income:</span>
                    <strong style={{ color: '#fbbf24' }}>${pkg.maxIncome.toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: '12px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: '16px',
                marginTop: '10px'
              }}>
                <button
                  onClick={() => openEditModal(pkg)}
                  className="panel-btn-secondary"
                  style={{ flexGrow: 1, padding: '8px 0', fontSize: '13px', cursor: 'pointer' }}
                >
                  Edit details
                </button>
                <button
                  onClick={() => handleDelete(pkg._id || pkg.id)}
                  style={{
                    flexGrow: 1,
                    padding: '8px 0',
                    fontSize: '13px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  className="status-toggle-btn"
                >
                  Delete Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Package Form Modal */}
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
            maxWidth: '500px',
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

            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 4px 0' }}>
              {editMode ? 'Modify Plan Settings' : 'Create Investment Plan'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 24px 0' }}>
              Set costs, ROI percentages, business volumes, and capping ceilings
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Plan Name */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 'bold' }}>
                  Plan Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Starter Pack, Ultimate Pro"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="panel-input"
                  style={{ width: '100%', margin: 0 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Cost */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 'bold' }}>
                    Price Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="100.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="panel-input"
                    style={{ width: '100%', margin: 0 }}
                    required
                  />
                </div>

                {/* Daily ROI */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 'bold' }}>
                    Daily ROI Yield (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="1.5"
                    value={roi}
                    onChange={(e) => setRoi(e.target.value)}
                    className="panel-input"
                    style={{ width: '100%', margin: 0 }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* BV */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 'bold' }}>
                    Business Volume (BV)
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    value={bv}
                    onChange={(e) => setBv(e.target.value)}
                    className="panel-input"
                    style={{ width: '100%', margin: 0 }}
                    required
                  />
                </div>

                {/* Validity */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 'bold' }}>
                    Validity (Days)
                  </label>
                  <input
                    type="number"
                    placeholder="360"
                    value={validity}
                    onChange={(e) => setValidity(e.target.value)}
                    className="panel-input"
                    style={{ width: '100%', margin: 0 }}
                    required
                  />
                </div>
              </div>

              {/* Max Income */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 'bold' }}>
                  Max Lifetime Income Cap ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 250.00"
                  value={maxIncome}
                  onChange={(e) => setMaxIncome(e.target.value)}
                  className="panel-input"
                  style={{ width: '100%', margin: 0 }}
                  required
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
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
                  {submitting ? 'Saving...' : 'Save Plan Settings ⚡'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPackages;
