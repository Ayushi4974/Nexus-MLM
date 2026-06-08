import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="animate-fade" style={styles.container}>
      {/* Banner */}
      <section style={styles.banner}>
        <div style={styles.bannerContent}>
          <span style={styles.tag}>CONNECT WITH US</span>
          <h1 style={styles.title}>Contact Nexus Support</h1>
          <p style={styles.subtitle}>Have inquiries about placements, withdrawal fees, or package benefits? Reach out and our team will assist you within 12 hours.</p>
        </div>
      </section>

      {/* Main Content */}
      <section style={styles.section}>
        <div style={styles.inner}>
          <div style={styles.grid2Col}>
            {/* Form */}
            <div className="glass-card" style={{ padding: '30px' }}>
              <h3 style={styles.formTitle}>Submit a Ticket</h3>
              {submitted && (
                <div style={styles.success}>
                  Your message has been sent successfully. A support agent will contact you soon.
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="E.g., Placement check, Withdrawal delay"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Your Message</label>
                  <textarea
                    required
                    rows="4"
                    className="form-control"
                    placeholder="Describe details here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                  Send Message
                </button>
              </form>
            </div>

            {/* Info and Map */}
            <div style={styles.infoWrapper}>
              <div className="glass-card" style={styles.infoCard}>
                <h4 style={{ color: '#fff', marginBottom: '12px' }}>Customer Support</h4>
                <p style={styles.infoText}>Available Monday to Friday, 9:00 AM - 6:00 PM EST.</p>
                <p style={styles.infoText}>Email: <strong>support@nexusmlm.com</strong></p>
                <p style={styles.infoText}>Hotline: <strong>+1 (555) 234-5678</strong></p>
              </div>

              <div className="glass-card" style={styles.infoCard}>
                <h4 style={{ color: '#fff', marginBottom: '12px' }}>Corporate Headquarters</h4>
                <p style={styles.infoText}>104, Innovate Tower, Tech Hub District,</p>
                <p style={styles.infoText}>Silicon Avenue, CA 94016</p>
              </div>

              {/* Map Placeholder */}
              <div style={styles.mapPlaceholder}>
                <div style={styles.mapInner}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--secondary)', marginBottom: '10px' }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Interactive Google Map Placeholder</span>
                  <span style={{ fontSize: '12px', color: '#fff', fontWeight: '600', marginTop: '4px' }}>CA 94016, USA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    paddingBottom: '40px',
  },
  banner: {
    padding: '80px 24px 60px',
    background: 'radial-gradient(ellipse at bottom, rgba(99, 102, 241, 0.1) 0%, rgba(9, 13, 22, 0) 60%)',
    textAlign: 'center',
    borderBottom: '1px solid var(--border-color)',
  },
  bannerContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  tag: {
    color: 'var(--secondary)',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '2px',
    display: 'block',
    marginBottom: '8px',
  },
  title: {
    fontSize: '38px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '16px',
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
  },
  section: {
    padding: '60px 24px',
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  grid2Col: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '40px',
  },
  formTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '20px',
  },
  success: {
    background: 'rgba(16,185,129,0.1)',
    border: '1px solid var(--success)',
    color: 'var(--success)',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '14px',
  },
  infoWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  infoCard: {
    padding: '20px',
  },
  infoText: {
    color: 'var(--text-muted)',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: '4px 0',
  },
  mapPlaceholder: {
    height: '220px',
    borderRadius: 'var(--radius-lg)',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.04))',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  mapInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

export default Contact;
