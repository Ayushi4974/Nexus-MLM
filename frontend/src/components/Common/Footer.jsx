import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={footerStyles.container}>
      <div style={footerStyles.content}>
        {/* Company Bio */}
        <div style={footerStyles.column}>
          <h3 style={footerStyles.header}>NEXUS<span style={{ color: 'var(--secondary)' }}>MLM</span></h3>
          <p style={footerStyles.text}>
            NexusMLM is a state-of-the-art decentralized multi-level marketing platform enabling global members to grow networks, achieve ranks, and earn daily passive returns.
          </p>
        </div>

        {/* Quick Links */}
        <div style={footerStyles.column}>
          <h4 style={footerStyles.subHeader}>Quick Links</h4>
          <ul style={footerStyles.list}>
            <li><Link to="/" style={footerStyles.link}>Home</Link></li>
            <li><Link to="/about" style={footerStyles.link}>About Us</Link></li>
            <li><Link to="/compensation" style={footerStyles.link}>Compensation Plan</Link></li>
            <li><Link to="/contact" style={footerStyles.link}>Contact Support</Link></li>
          </ul>
        </div>

        {/* Office & Details */}
        <div style={footerStyles.column}>
          <h4 style={footerStyles.subHeader}>Office Headquarter</h4>
          <p style={footerStyles.text}>
            104, Innovate Tower, Tech Hub District,<br />
            Silicon Avenue, CA 94016<br />
            Email: <span style={{ color: 'var(--secondary)' }}>support@nexusmlm.com</span><br />
            Phone: +1 (555) 234-5678
          </p>
        </div>

        {/* Newsletter / CTA */}
        <div style={footerStyles.column}>
          <h4 style={footerStyles.subHeader}>Stay Connected</h4>
          <p style={footerStyles.text}>Subscribe to get updates on promotions, binary boosts, and system rewards.</p>
          <div style={footerStyles.newsInputWrapper}>
            <input type="email" placeholder="Enter email..." style={footerStyles.input} />
            <button className="btn-primary" style={{ padding: '8px 12px', borderRadius: '6px', fontSize: '14px' }}>Go</button>
          </div>
        </div>
      </div>

      <div style={footerStyles.bottom}>
        <p>© 2026 NexusMLM Inc. All rights reserved. Built with premium grade security & transparency.</p>
      </div>
    </footer>
  );
};

const footerStyles = {
  container: {
    background: '#070a10',
    borderTop: '1px solid var(--border-color)',
    padding: '60px 24px 30px',
    marginTop: '60px',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '40px',
    marginBottom: '40px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  header: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '1px',
  },
  subHeader: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
  },
  text: {
    color: 'var(--text-muted)',
    fontSize: '14px',
    lineHeight: '1.6',
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  link: {
    color: 'var(--text-muted)',
    fontSize: '14px',
    transition: 'var(--transition)',
  },
  newsInputWrapper: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  input: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '14px',
    color: '#fff',
    flexGrow: 1,
  },
  bottom: {
    maxWidth: '1200px',
    margin: '0 auto',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '24px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '13px',
  },
};

export default Footer;
