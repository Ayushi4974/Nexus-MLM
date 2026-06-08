import React from 'react';

const CompensationPlan = () => {
  return (
    <div className="animate-fade" style={styles.container}>
      {/* Banner */}
      <section style={styles.banner}>
        <div style={styles.bannerContent}>
          <span style={styles.tag}>EARNING MODES</span>
          <h1 style={styles.title}>Compensation Structure</h1>
          <p style={styles.subtitle}>Explore the 5 distinct reward streams engineered to pay out maximum commissions as your binary team scales.</p>
        </div>
      </section>

      {/* Plan Details Grid */}
      <section style={styles.section}>
        <div style={styles.inner}>
          <div style={styles.planContainer}>
            {/* 1. Direct Referral */}
            <div className="glass-card" style={styles.planCard}>
              <div style={styles.cardHeader}>
                <div style={styles.iconBox}>🤝</div>
                <div>
                  <h3 style={styles.cardTitle}>1. Direct Referral Income</h3>
                  <span style={styles.cardValue}>10% Commission</span>
                </div>
              </div>
              <p style={styles.cardDesc}>
                Earn an immediate 10% commission whenever a member registers using your unique Sponsor ID and purchases any active investment package. There is no limit on direct sponsorships—you can sponsor unlimited users to build your level width.
              </p>
            </div>

            {/* 2. Binary Income */}
            <div className="glass-card" style={styles.planCard}>
              <div style={styles.cardHeader}>
                <div style={styles.iconBox}>⛓</div>
                <div>
                  <h3 style={styles.cardTitle}>2. Binary Matching Income</h3>
                  <span style={styles.cardValue}>10% Matching on BV</span>
                </div>
              </div>
              <p style={styles.cardDesc}>
                Our system tracks the total Business Volume (BV) accumulated under your left and right placement branches. At the moment package activations occur, the system matches left and right BV. You earn 10% of the matched volume. Matched volume is deducted, and remaining BV carries forward.
              </p>
            </div>

            {/* 3. Level Income */}
            <div className="glass-card" style={styles.planCard}>
              <div style={styles.cardHeader}>
                <div style={styles.iconBox}>📊</div>
                <div>
                  <h3 style={styles.cardTitle}>3. Unilevel Level Income</h3>
                  <span style={styles.cardValue}>5 Levels Deep (12% Total)</span>
                </div>
              </div>
              <p style={styles.cardDesc}>
                Earn passive overrides from purchases throughout your sponsor tree up to 5 generations deep:
              </p>
              <ul style={styles.levelList}>
                <li><span style={styles.levelBold}>Level 1 (Directs):</span> 5% of package price</li>
                <li><span style={styles.levelBold}>Level 2:</span> 3% of package price</li>
                <li><span style={styles.levelBold}>Level 3:</span> 2% of package price</li>
                <li><span style={styles.levelBold}>Level 4:</span> 1% of package price</li>
                <li><span style={styles.levelBold}>Level 5:</span> 1% of package price</li>
              </ul>
            </div>

            {/* 4. ROI Income */}
            <div className="glass-card" style={styles.planCard}>
              <div style={styles.cardHeader}>
                <div style={styles.iconBox}>📈</div>
                <div>
                  <h3 style={styles.cardTitle}>4. Return on Investment (ROI)</h3>
                  <span style={styles.cardValue}>1.0% to 2.0% Daily</span>
                </div>
              </div>
              <p style={styles.cardDesc}>
                Each package provides a consistent passive daily return directly to your ROI wallet for 360 days:
              </p>
              <ul style={styles.levelList}>
                <li><span style={styles.levelBold}>Starter Package ($100):</span> 1.0% Daily</li>
                <li><span style={styles.levelBold}>Premium Package ($500):</span> 1.2% Daily</li>
                <li><span style={styles.levelBold}>Elite Package ($1000):</span> 1.5% Daily</li>
                <li><span style={styles.levelBold}>VIP Package ($5000):</span> 2.0% Daily</li>
              </ul>
            </div>

            {/* 5. Reward Income */}
            <div className="glass-card" style={styles.planCard}>
              <div style={styles.cardHeader}>
                <div style={styles.iconBox}>🏆</div>
                <div>
                  <h3 style={styles.cardTitle}>5. Leadership Rank Rewards</h3>
                  <span style={styles.cardValue}>Rank Achievements</span>
                </div>
              </div>
              <p style={styles.cardDesc}>
                Scale your network placement counts to unlock higher ranks, matching capping ceilings, and reward bonuses:
              </p>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableRow}>
                    <th style={styles.th}>Rank Name</th>
                    <th style={styles.th}>Required Left/Right Count</th>
                    <th style={styles.th}>Daily Capping Limit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={styles.td}>Bronze</td>
                    <td style={styles.td}>10 / 10 Active Members</td>
                    <td style={styles.td}>$500 / day</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Silver</td>
                    <td style={styles.td}>50 / 50 Active Members</td>
                    <td style={styles.td}>$1,500 / day</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Gold</td>
                    <td style={styles.td}>200 / 200 Active Members</td>
                    <td style={styles.td}>$5,000 / day</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Diamond</td>
                    <td style={styles.td}>1000 / 1000 Active Members</td>
                    <td style={styles.td}>$25,000 / day</td>
                  </tr>
                </tbody>
              </table>
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
    background: 'radial-gradient(ellipse at bottom, rgba(6, 182, 212, 0.1) 0%, rgba(9, 13, 22, 0) 60%)',
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
    maxWidth: '900px',
    margin: '0 auto',
  },
  planContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  planCard: {
    padding: '30px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '16px',
  },
  iconBox: {
    fontSize: '32px',
    background: 'rgba(255, 255, 255, 0.03)',
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--border-color)',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
  },
  cardValue: {
    color: 'var(--secondary)',
    fontSize: '14px',
    fontWeight: '600',
  },
  cardDesc: {
    color: 'var(--text-muted)',
    fontSize: '15px',
    lineHeight: '1.7',
  },
  levelList: {
    marginTop: '12px',
    color: 'var(--text-muted)',
    paddingLeft: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '14px',
  },
  levelBold: {
    color: '#fff',
    fontWeight: '600',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    fontSize: '14px',
  },
  tableRow: {
    borderBottom: '1px solid var(--border-color)',
  },
  th: {
    textAlign: 'left',
    padding: '12px 8px',
    color: '#fff',
    fontWeight: '600',
  },
  td: {
    padding: '12px 8px',
    color: 'var(--text-muted)',
  },
};

export default CompensationPlan;
