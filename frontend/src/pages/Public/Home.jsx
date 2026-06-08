import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  TrendingUp, 
  Zap, 
  Shield, 
  Globe, 
  Award, 
  DollarSign, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Users, 
  MessageSquare 
} from 'lucide-react';
import { api } from '../../services/api';
import AnimatedCounter from '../../components/Common/AnimatedCounter';
import FloatingBackground from '../../components/Common/FloatingBackground';

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [faqOpen, setFaqOpen] = useState({});
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.packages.getPackages();
        if (response.success) {
          setPackages(response.data);
        }
      } catch (err) {
        console.error('Failed to load packages:', err);
      }
    };
    fetchPackages();
  }, []);

  const toggleFaq = (index) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSuccess(true);
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setContactSuccess(false), 5000);
  };

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 60, damping: 15 }
    }
  };

  return (
    <div style={styles.container}>
      {/* Dynamic Background Effects */}
      <FloatingBackground />

      {/* 1. HERO SECTION */}
      <section style={styles.hero}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={styles.heroContent}
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={styles.heroBadge}
          >
            <span style={styles.heroBadgePulse} />
            <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
              ✦ MLM Engine v2.0 Live
            </span>
          </motion.div>
          
          <h1 style={styles.heroTitle}>
            Unleash the Power of <br />
            <span className="text-gradient-neon">Genealogy & Binary Rewards</span>
          </h1>
          
          <p style={styles.heroSubtitle}>
            Build your global team, activate high-yielding investment packages, and earn matching commissions through our transparent MERN MLM engine.
          </p>
          
          <div style={styles.heroBtns}>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link to="/register" className="btn-primary" style={styles.heroPrimaryBtn}>
                Get Started Now <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link to="/compensation" className="btn-secondary" style={styles.heroSecondaryBtn}>
                View Compensation Plan
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 2. COMPANY INTRODUCTION */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <div style={styles.grid2Col}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={containerVariants}
            >
              <motion.span variants={itemVariants} style={styles.tag}>
                ABOUT NEXUS
              </motion.span>
              <motion.h2 variants={itemVariants} style={styles.sectionHeading}>
                The Next-Generation Decentralized Networking Ecosystem
              </motion.h2>
              <motion.p variants={itemVariants} style={styles.sectionParagraph}>
                NexusMLM is engineered to deliver unmatched transparency and security in networking systems. We leverage modern real-time placement tracking, automated unilevel level rewards, and binary capping thresholds to safeguard members' earnings.
              </motion.p>
              <motion.p variants={itemVariants} style={styles.sectionParagraph}>
                Our system enables users to manage their wallet balances, perform P2P transfers, view detailed team reports, and withdraw earnings directly to bank accounts.
              </motion.p>
            </motion.div>
            
            {/* Interactive Fintech Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', damping: 20 }}
              style={styles.introIllustration}
            >
              <div style={styles.illusMesh} />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                style={styles.illusOrbiter}
              />
              <motion.div 
                whileHover={{ scale: 1.08 }}
                style={styles.illusCircle}
              >
                <DollarSign size={52} color="#050811" strokeWidth={2.5} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. BENEFITS */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={styles.tag}>BENEFITS</span>
            <h2 style={styles.sectionHeading}>Why Join NexusMLM?</h2>
          </div>
          
          <div style={styles.grid3Col}>
            {/* Benefit Card 1 */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="glassmorphism-card" 
              style={styles.benefitCard}
            >
              <div style={{ ...styles.benefitIcon, background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                <TrendingUp size={24} />
              </div>
              <h3 style={styles.cardHeading}>Instant Binary Income</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                Get rewarded instantly when left and right Business Volume (BV) aligns. Real-time matching calculations.
              </p>
            </motion.div>

            {/* Benefit Card 2 */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="glassmorphism-card" 
              style={styles.benefitCard}
            >
              <div style={{ ...styles.benefitIcon, background: 'var(--secondary-glow)', color: 'var(--secondary)' }}>
                <Zap size={24} />
              </div>
              <h3 style={styles.cardHeading}>Daily ROI Distributions</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                Enjoy passive daily return percentages based on your active package. Fully automated ledger entries.
              </p>
            </motion.div>

            {/* Benefit Card 3 */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="glassmorphism-card" 
              style={styles.benefitCard}
            >
              <div style={{ ...styles.benefitIcon, background: 'rgba(16,185,129,0.15)', color: 'var(--success)' }}>
                <Shield size={24} />
              </div>
              <h3 style={styles.cardHeading}>Secure Wallet Transfers</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                Securely transfer funds peer-to-peer (P2P) directly into any downline user's Recharge Wallet.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. PACKAGES SECTION */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={styles.tag}>INVESTMENT PACKAGES</span>
            <h2 style={styles.sectionHeading}>Activate Your Position</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Select from our premium plans to activate binary matching, level payouts, and daily ROIs.</p>
          </div>
          
          <div style={styles.grid3Col}>
            {packages.map((pkg) => (
              <motion.div 
                key={pkg._id} 
                whileHover={{ y: -8 }}
                className="glassmorphism-card" 
                style={styles.packageCard}
              >
                <div>
                  <h3 style={styles.packageName}>{pkg.name}</h3>
                  <div style={styles.packagePrice}>
                    <span style={{ fontSize: '20px', color: 'var(--primary)', verticalAlign: 'super' }}>$</span>
                    {pkg.price}
                  </div>
                  
                  <ul style={styles.packageList}>
                    <li style={styles.packageListItem}>
                      <Check size={16} color="var(--primary)" />
                      <span>Daily ROI: <strong style={{ color: '#fff' }}>{pkg.roi}%</strong></span>
                    </li>
                    <li style={styles.packageListItem}>
                      <Check size={16} color="var(--primary)" />
                      <span>Business Volume: <strong style={{ color: '#fff' }}>{pkg.bv} BV</strong></span>
                    </li>
                    <li style={styles.packageListItem}>
                      <Check size={16} color="var(--primary)" />
                      <span>Capping Limit: <strong style={{ color: '#fff' }}>${pkg.maxIncome}/day</strong></span>
                    </li>
                    <li style={styles.packageListItem}>
                      <Check size={16} color="var(--primary)" />
                      <span>Validity: <strong style={{ color: '#fff' }}>{pkg.validity} Days</strong></span>
                    </li>
                  </ul>
                </div>
                
                <Link to="/register" className="btn-primary" style={{ width: '100%', marginTop: '24px', borderRadius: '10px' }}>
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BUSINESS STATISTICS WITH COUNTERS */}
      <section style={styles.statsSection}>
        <div style={styles.sectionInner}>
          <div style={styles.grid4Col}>
            <div style={styles.statBox}>
              <div style={styles.statIconContainer}><Users size={24} color="var(--primary)" /></div>
              <div style={styles.statVal}>
                <AnimatedCounter value={120} suffix="K+" />
              </div>
              <div style={styles.statLabel}>Global Members</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statIconContainer}><DollarSign size={24} color="var(--primary)" /></div>
              <div style={styles.statVal}>
                <AnimatedCounter value={48} prefix="$" suffix="M+" />
              </div>
              <div style={styles.statLabel}>Total Payouts</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statIconContainer}><Activity size={24} color="var(--primary)" /></div>
              <div style={styles.statVal}>
                <AnimatedCounter value={99.9} suffix="%" />
              </div>
              <div style={styles.statLabel}>Uptime Reliability</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statIconContainer}><Globe size={24} color="var(--primary)" /></div>
              <div style={styles.statVal}>
                <AnimatedCounter value={150} suffix="+" />
              </div>
              <div style={styles.statLabel}>Supported Nations</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={styles.tag}>REVIEWS</span>
            <h2 style={styles.sectionHeading}>Success Stories From Our Network</h2>
          </div>
          
          <div style={styles.grid3Col}>
            <motion.div whileHover={{ y: -6 }} className="glassmorphism-card" style={styles.testimonialCard}>
              <p style={styles.testimonialText}>
                "NexusMLM changed my financial future. The binary matching income is calculated instantly, and payouts take less than 24 hours to clear to my bank account!"
              </p>
              <div style={styles.testimonialUser}>
                <div style={styles.userAvatar}>AT</div>
                <div>
                  <div style={styles.userName}>Aris Thorne</div>
                  <div style={styles.userRank}>Silver Rank Member</div>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -6 }} className="glassmorphism-card" style={styles.testimonialCard}>
              <p style={styles.testimonialText}>
                "The direct team tracking and clear unilevel logs make planning network goals easy. I've already sponsor-linked 40+ active members in 3 months."
              </p>
              <div style={styles.testimonialUser}>
                <div style={styles.userAvatar}>MD</div>
                <div>
                  <div style={styles.userName}>Marcus Duell</div>
                  <div style={styles.userRank}>Gold Rank Director</div>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -6 }} className="glassmorphism-card" style={styles.testimonialCard}>
              <p style={styles.testimonialText}>
                "The user-friendly dashboard is spectacular. I keep track of my Main, Recharge, and Reward wallets effortlessly across any mobile viewport."
              </p>
              <div style={styles.testimonialUser}>
                <div style={styles.userAvatar}>SL</div>
                <div>
                  <div style={styles.userName}>Sarah Lin</div>
                  <div style={styles.userRank}>Diamond Partner</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={styles.tag}>SUPPORT</span>
            <h2 style={styles.sectionHeading}>Frequently Asked Questions</h2>
          </div>
          
          <div style={styles.faqList}>
            {[
              { q: 'How is the binary tree placement structured?', a: 'When a new user registers, they must specify a Parent ID and their position (Left or Right). If that position is vacant, the placement is successful. Ancestors on that branch receive BV.' },
              { q: 'What is the difference between wallets?', a: 'Main Wallet is for transactions. Income Wallet holds binary/direct referral rewards. Recharge Wallet holds deposits for packages. Reward Wallet holds rank bonuses.' },
              { q: 'What are the charges on withdrawals?', a: 'All bank withdrawal requests carry a 10% administrative and maintenance fee, which is deducted automatically upon processing.' },
            ].map((faq, index) => (
              <div 
                key={index} 
                className="glassmorphism-card" 
                style={{ padding: '20px', cursor: 'pointer', marginBottom: '16px' }} 
                onClick={() => toggleFaq(index)}
              >
                <div style={styles.faqHeader}>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#fff' }}>{faq.q}</h4>
                  <motion.div
                    animate={{ rotate: faqOpen[index] ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: 'var(--primary)' }}
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </div>
                <AnimatePresence initial={false}>
                  {faqOpen[index] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={styles.faqBody}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CONTACT FORM */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <div style={styles.contactWrapper}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glassmorphism-card" 
              style={{ padding: '40px 30px' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={styles.contactIconCircle}>
                  <MessageSquare size={24} color="var(--primary)" />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>Send Us a Message</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>We typically respond within a few hours.</p>
              </div>

              {contactSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={styles.successMsg}
                >
                  Thank you! Your message was submitted successfully.
                </motion.div>
              )}

              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Enter name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="name@email.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    required
                    rows="4"
                    className="form-control"
                    placeholder="Describe your query in detail..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '14px', borderRadius: '10px' }}>
                  Submit Inquiry
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    paddingBottom: '40px',
    backgroundColor: 'var(--bg-dark-main)',
    overflow: 'hidden',
  },
  hero: {
    padding: '160px 24px 100px',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },
  heroContent: {
    maxWidth: '850px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(0, 229, 255, 0.08)',
    border: '1px solid rgba(0, 229, 255, 0.2)',
    padding: '6px 16px',
    borderRadius: '100px',
    color: 'var(--primary)',
    marginBottom: '28px',
  },
  heroBadgePulse: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    boxShadow: '0 0 10px var(--primary)',
    display: 'inline-block',
  },
  heroTitle: {
    fontSize: '54px',
    fontWeight: '800',
    lineHeight: '1.15',
    marginBottom: '24px',
    color: '#fff',
    letterSpacing: '-1px',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'var(--text-muted)',
    marginBottom: '40px',
    lineHeight: '1.65',
    maxWidth: '650px',
  },
  heroBtns: {
    display: 'flex',
    justifyContent: 'center',
    gap: '18px',
    flexWrap: 'wrap',
  },
  heroPrimaryBtn: {
    padding: '16px 36px',
    borderRadius: '12px',
    fontSize: '15px',
    boxShadow: '0 8px 24px rgba(0, 229, 255, 0.35)',
  },
  heroSecondaryBtn: {
    padding: '16px 36px',
    borderRadius: '12px',
    fontSize: '15px',
  },
  section: {
    padding: '100px 24px',
    position: 'relative',
    zIndex: 1,
  },
  sectionInner: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  tag: {
    color: 'var(--primary)',
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '12px',
  },
  sectionHeading: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#fff',
    lineHeight: '1.25',
    letterSpacing: '-0.5px',
  },
  sectionParagraph: {
    color: 'var(--text-muted)',
    fontSize: '16px',
    lineHeight: '1.75',
    marginTop: '20px',
  },
  grid2Col: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '60px',
    alignItems: 'center',
  },
  grid3Col: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
    gap: '30px',
  },
  grid4Col: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '30px',
  },
  introIllustration: {
    height: '350px',
    borderRadius: 'var(--radius-lg)',
    background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.05), rgba(139, 92, 246, 0.03))',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  illusMesh: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundImage: 'radial-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  },
  illusOrbiter: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    border: '1.5px dashed rgba(139, 92, 246, 0.25)',
  },
  illusCircle: {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
    boxShadow: '0 0 40px rgba(0, 229, 255, 0.45), 0 0 15px rgba(139, 92, 246, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    cursor: 'pointer',
  },
  benefitCard: {
    padding: '40px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  benefitIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  cardHeading: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '14px',
  },
  packageCard: {
    padding: '45px 35px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '480px',
  },
  packageName: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  packagePrice: {
    fontSize: '44px',
    fontWeight: '800',
    color: '#fff',
    margin: '18px 0 28px',
    letterSpacing: '-1px',
  },
  packageList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '24px',
  },
  packageListItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'var(--text-muted)',
    fontSize: '14px',
  },
  statsSection: {
    background: 'linear-gradient(180deg, rgba(5,8,17,0.8) 0%, rgba(10,15,30,0.8) 50%, rgba(5,8,17,0.8) 100%)',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '80px 24px',
    position: 'relative',
    zIndex: 1,
  },
  statBox: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statIconContainer: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'rgba(0, 229, 255, 0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    border: '1px solid rgba(0, 229, 255, 0.1)',
  },
  statVal: {
    fontSize: '46px',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '-1px',
    background: 'linear-gradient(135deg, #fff 40%, var(--primary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statLabel: {
    color: 'var(--text-muted)',
    fontSize: '14px',
    fontWeight: '500',
    marginTop: '8px',
  },
  testimonialCard: {
    padding: '36px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '260px',
  },
  testimonialText: {
    color: 'var(--text-muted)',
    fontSize: '14px',
    lineHeight: '1.7',
    marginBottom: '28px',
  },
  testimonialUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  userAvatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#050811',
    fontWeight: '700',
    fontSize: '14px',
  },
  userName: {
    fontWeight: '600',
    color: '#fff',
    fontSize: '14px',
  },
  userRank: {
    fontSize: '12px',
    color: 'var(--primary)',
    marginTop: '2px',
  },
  faqList: {
    maxWidth: '850px',
    margin: '0 auto',
  },
  faqHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqBody: {
    marginTop: '16px',
    color: 'var(--text-muted)',
    fontSize: '14px',
    lineHeight: '1.65',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '16px',
  },
  contactWrapper: {
    maxWidth: '580px',
    margin: '0 auto',
  },
  contactIconCircle: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    background: 'rgba(0, 229, 255, 0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    border: '1px solid rgba(0, 229, 255, 0.1)',
  },
  successMsg: {
    background: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid var(--success)',
    color: 'var(--success)',
    padding: '14px',
    borderRadius: '10px',
    textAlign: 'center',
    marginBottom: '24px',
    fontSize: '14px',
  },
};

export default Home;
