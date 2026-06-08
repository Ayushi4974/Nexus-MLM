import React from 'react';

const About = () => {
  return (
    <div className="animate-fade" style={styles.container}>
      {/* 1. Header Banner */}
      <section style={styles.banner}>
        <div style={styles.bannerContent}>
          <span style={styles.tag}>WHO WE ARE</span>
          <h1 style={styles.title}>About NexusMLM</h1>
          <p style={styles.subtitle}>Empowering networkers worldwide with automated placement structures, secure wallet transfers, and transparent ROI yields.</p>
        </div>
      </section>

      {/* 2. Company Overview */}
      <section style={styles.section}>
        <div style={styles.inner}>
          <div style={styles.grid2Col}>
            <div>
              <h2 style={styles.heading}>Decentralized Network Foundations</h2>
              <p style={styles.paragraph}>
                NexusMLM was established in 2026 by a team of software developers and financial experts who recognized the deficiencies of legacy MLM systems. Traditional platforms suffer from manual tracking bugs, obscure commission distributions, and slow, friction-filled payouts.
              </p>
              <p style={styles.paragraph}>
                We designed a fully responsive MERN MLM engine that computes direct referral rewards, multilevel matching levels, and binary volumes immediately. Every single dollar flowing in is logged in our databases, ensuring zero error calculations.
              </p>
            </div>
            <div style={styles.overviewBox}>
              <div style={styles.cardHighlight}>
                <span style={styles.cardHighlightVal}>100%</span>
                <span style={styles.cardHighlightLbl}>Automated Ledger Distribution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section style={{ ...styles.section, background: 'rgba(255,255,255,0.01)' }}>
        <div style={styles.inner}>
          <div style={styles.grid2Col}>
            <div className="glass-card" style={styles.mvCard}>
              <div style={styles.icon}>🎯</div>
              <h3>Our Mission</h3>
              <p style={styles.cardText}>
                To democratize global network marketing by equipping leaders and users with the fastest P2P wallets, instant placement checking tools, and transparent, error-free downline reporting.
              </p>
            </div>
            <div className="glass-card" style={styles.mvCard}>
              <div style={styles.icon}>👁</div>
              <h3>Our Vision</h3>
              <p style={styles.cardText}>
                To build the most trusted network marketing software engine, incorporating clean UI components, robust security practices, and reliable, high-yield packages for millions of network partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Achievements */}
      <section style={styles.section}>
        <div style={styles.inner}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={styles.tag}>MILESTONES</span>
            <h2 style={styles.heading}>Our Key Achievements</h2>
          </div>
          <div style={styles.grid3Col}>
            <div className="glass-card" style={styles.statBox}>
              <div style={styles.statNum}>$48 Million</div>
              <p style={styles.statDesc}>Total binary matching and referral commissions paid out to worldwide partners since launch.</p>
            </div>
            <div className="glass-card" style={styles.statBox}>
              <div style={styles.statNum}>120,000+</div>
              <p style={styles.statDesc}>Registered members actively expanding binary genealogies and upgrading package ranks.</p>
            </div>
            <div className="glass-card" style={styles.statBox}>
              <div style={styles.statNum}>99.98%</div>
              <p style={styles.statDesc}>Server transaction database accuracy, ensuring all commissions distribute perfectly up the sponsor chains.</p>
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
    padding: '80px 24px',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '16px',
  },
  paragraph: {
    color: 'var(--text-muted)',
    fontSize: '15px',
    lineHeight: '1.7',
    marginBottom: '16px',
  },
  grid2Col: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '40px',
    alignItems: 'center',
  },
  grid3Col: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  overviewBox: {
    height: '240px',
    borderRadius: 'var(--radius-lg)',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.03))',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHighlight: {
    textAlign: 'center',
  },
  cardHighlightVal: {
    fontSize: '56px',
    fontWeight: '800',
    color: 'var(--secondary)',
    display: 'block',
    textShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
  },
  cardHighlightLbl: {
    color: 'var(--text-main)',
    fontSize: '14px',
    fontWeight: '500',
  },
  mvCard: {
    padding: '40px 30px',
  },
  icon: {
    fontSize: '32px',
    marginBottom: '16px',
  },
  cardText: {
    color: 'var(--text-muted)',
    fontSize: '14px',
    lineHeight: '1.6',
    marginTop: '12px',
  },
  statBox: {
    textAlign: 'center',
    padding: '30px',
  },
  statNum: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '12px',
  },
  statDesc: {
    color: 'var(--text-muted)',
    fontSize: '14px',
    lineHeight: '1.6',
  },
};

export default About;
