import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const GenealogyTree = () => {
  const { user: currentUser } = useAuth();
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [currentRootId, setCurrentRootId] = useState('');
  const [error, setError] = useState('');

  const fetchTree = async (username = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await api.team.getGenealogyTree(username);
      if (res.success) {
        setTreeData(res.data);
        if (!username) {
          setCurrentRootId(res.data.username);
        } else {
          setCurrentRootId(username);
        }
      }
    } catch (err) {
      setError(err.message || 'Error loading genealogy tree');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchId) return;
    fetchTree(searchId.toUpperCase());
  };

  const handleNodeClick = (username) => {
    if (!username) return; // vacant node
    fetchTree(username);
  };

  const handleReset = () => {
    setSearchId('');
    fetchTree();
  };

  // Render a single node card in the tree
  const renderNode = (node, isRoot = false) => {
    if (!node) return null;

    if (node.vacant) {
      return (
        <div style={treeStyles.vacantCard}>
          <div style={treeStyles.vacantIcon}>+</div>
          <div style={treeStyles.vacantTitle}>Vacant Spot</div>
          <div style={treeStyles.vacantSide}>{node.position.toUpperCase()} Side</div>
          <div style={treeStyles.vacantParent}>Upline: {node.parentId}</div>
        </div>
      );
    }

    const isActive = node.status === 'active';

    return (
      <div
        onClick={() => handleNodeClick(node.username)}
        style={{
          ...treeStyles.nodeCard,
          borderColor: isRoot ? 'var(--primary)' : isActive ? 'var(--success)' : 'var(--danger)',
        }}
      >
        <span className={`badge ${isActive ? 'badge-active' : 'badge-inactive'}`} style={treeStyles.nodeBadge}>
          {node.status.toUpperCase()}
        </span>
        <div style={treeStyles.nodeUsername}>{node.username}</div>
        <div style={treeStyles.nodeName}>{node.name}</div>
        <div style={treeStyles.nodePackage}>Pkg: {node.activePackage}</div>
        
        {/* Counts & BV Grid */}
        <div style={treeStyles.nodeStatsGrid}>
          <div style={treeStyles.statHalf}>
            <div style={treeStyles.statLbl}>L: {node.leftCount}</div>
            <div style={treeStyles.statLbl}>L-BV: {node.leftBV}</div>
          </div>
          <div style={treeStyles.statDivider}></div>
          <div style={treeStyles.statHalf}>
            <div style={treeStyles.statLbl}>R: {node.rightCount}</div>
            <div style={treeStyles.statLbl}>R-BV: {node.rightBV}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade" style={treeStyles.container}>
      {/* Header */}
      <div style={treeStyles.header}>
        <h1 style={treeStyles.title}>Interactive Genealogy Tree</h1>
        <p style={{ color: 'var(--text-muted)' }}>Visualize downline networks. Click on any occupied node to traverse down their tree branch.</p>
      </div>

      {/* Toolbar */}
      <div className="glass-card" style={treeStyles.toolbar}>
        <form onSubmit={handleSearchSubmit} style={treeStyles.searchForm}>
          <input
            type="text"
            className="form-control"
            placeholder="Search User ID in downline..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{ padding: '10px 14px', maxWidth: '240px' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '10px 18px', fontSize: '14px' }}>
            Search
          </button>
          {currentRootId !== currentUser?.username && (
            <button type="button" onClick={handleReset} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '14px' }}>
              Reset to Me
            </button>
          )}
        </form>

        {currentRootId !== currentUser?.username && (
          <div style={treeStyles.breadcrumbs}>
            Viewing: <strong style={{ color: 'var(--secondary)' }}>{currentRootId}</strong> branch
          </div>
        )}
      </div>

      {error && <div style={treeStyles.errorAlert}>{error}</div>}

      {/* Tree Visual Wrapper */}
      <div className="glass-card" style={treeStyles.canvas}>
        {loading ? (
          <div style={treeStyles.canvasLoading}>Loading binary genealogy canvas...</div>
        ) : !treeData ? (
          <div style={treeStyles.canvasLoading}>No tree data loaded.</div>
        ) : (
          <div style={treeStyles.treeWrapper}>
            
            {/* Level 0: Root */}
            <div style={treeStyles.row}>
              {renderNode(treeData, true)}
            </div>

            {/* Connector Line Root -> Level 1 */}
            <div style={treeStyles.connectorLineVertical}></div>

            {/* Level 1: Left / Right Children */}
            <div style={treeStyles.row}>
              <div style={treeStyles.branchCol}>
                {renderNode(treeData.left)}
                <div style={treeStyles.connectorLineVertical}></div>
                {/* Level 2: Grandchildren Left Side */}
                <div style={treeStyles.row}>
                  <div style={treeStyles.subCol}>{renderNode(treeData.left?.left)}</div>
                  <div style={treeStyles.subCol}>{renderNode(treeData.left?.right)}</div>
                </div>
              </div>

              <div style={treeStyles.branchCol}>
                {renderNode(treeData.right)}
                <div style={treeStyles.connectorLineVertical}></div>
                {/* Level 2: Grandchildren Right Side */}
                <div style={treeStyles.row}>
                  <div style={treeStyles.subCol}>{renderNode(treeData.right?.left)}</div>
                  <div style={treeStyles.subCol}>{renderNode(treeData.right?.right)}</div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

const treeStyles = {
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
  breadcrumbs: {
    fontSize: '14px',
    color: 'var(--text-muted)',
  },
  errorAlert: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: 'var(--danger)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    textAlign: 'center',
  },
  canvas: {
    padding: '60px 24px',
    overflowX: 'auto',
    display: 'flex',
    justifyContent: 'center',
    background: '#070a11',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
  },
  canvasLoading: {
    padding: '60px 0',
    color: 'var(--text-muted)',
    fontSize: '14px',
    textAlign: 'center',
  },
  treeWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '780px',
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    width: '100%',
    position: 'relative',
  },
  branchCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: '1 1 50%',
  },
  subCol: {
    flex: '1 1 50%',
    display: 'flex',
    justifyContent: 'center',
  },
  connectorLineVertical: {
    width: '1px',
    height: '30px',
    background: 'rgba(255,255,255,0.1)',
    margin: '10px 0',
  },
  nodeCard: {
    width: '180px',
    background: 'rgba(17, 24, 39, 0.9)',
    border: '2px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '16px 12px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'var(--transition)',
    position: 'relative',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    userSelect: 'none',
  },
  nodeBadge: {
    position: 'absolute',
    top: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '9px',
    padding: '2px 8px',
  },
  nodeUsername: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
    marginTop: '4px',
  },
  nodeName: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    margin: '4px 0',
  },
  nodePackage: {
    fontSize: '10px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '4px',
    padding: '2px 6px',
    display: 'inline-block',
    color: 'var(--secondary)',
    marginBottom: '8px',
    fontWeight: '500',
  },
  nodeStatsGrid: {
    display: 'flex',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '8px',
    marginTop: '4px',
  },
  statHalf: {
    flex: '1 1 50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statDivider: {
    width: '1px',
    background: 'var(--border-color)',
  },
  statLbl: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    lineHeight: '1.3',
  },

  // Vacant spots styling
  vacantCard: {
    width: '180px',
    background: 'transparent',
    border: '1px dashed rgba(255,255,255,0.15)',
    borderRadius: 'var(--radius-md)',
    padding: '18px 12px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    opacity: 0.6,
  },
  vacantIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '1px dashed rgba(255,255,255,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 8px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  vacantTitle: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-muted)',
  },
  vacantSide: {
    fontSize: '9px',
    color: 'var(--secondary)',
    fontWeight: '700',
    marginTop: '2px',
  },
  vacantParent: {
    fontSize: '9px',
    marginTop: '6px',
    color: 'var(--text-muted)',
  },
};

export default GenealogyTree;
