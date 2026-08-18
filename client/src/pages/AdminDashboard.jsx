import React, { useState, useEffect } from 'react';
import { Shield, Users, Heart, Activity, CheckCircle2, Clock, XCircle, Search, RefreshCw, AlertTriangle, Zap } from 'lucide-react';
import { apiService } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalDonors: 482, totalRequests: 129, totalMatches: 84, availableOrgans: 36 });
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'donors' | 'matching'
  const [actionMessage, setActionMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    const statsRes = await apiService.getStats();
    if (statsRes.success && statsRes.stats) setStats(statsRes.stats);

    const donorRes = await apiService.getDonors();
    if (donorRes.success && donorRes.donors) setDonors(donorRes.donors);

    const reqRes = await apiService.getRequests();
    if (reqRes.success && reqRes.requests) setRequests(reqRes.requests);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateRequestStatus = async (id, newStatus, matchedDonorId = null) => {
    const res = await apiService.updateRequestStatus(id, newStatus, matchedDonorId);
    if (res.success) {
      setActionMessage(`Request updated to "${newStatus}"`);
      setTimeout(() => setActionMessage(''), 3000);
      loadData();
    }
  };

  const handleUpdateDonorStatus = async (id, newStatus) => {
    const res = await apiService.updateDonorStatus(id, newStatus);
    if (res.success) {
      setActionMessage(`Donor status updated to "${newStatus}"`);
      setTimeout(() => setActionMessage(''), 3000);
      loadData();
    }
  };

  return (
    <div style={{ padding: '60px 0', minHeight: '90vh' }}>
      <div className="container">
        {/* Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="badge badge-red" style={{ marginBottom: '8px' }}>
              <Shield size={14} /> ADMINISTRATOR CONTROL PANEL
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>National Registry Management</h1>
          </div>
          <button onClick={loadData} className="btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={16} /> Refresh Data
          </button>
        </div>

        {actionMessage && (
          <div style={{
            padding: '12px 20px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34D399',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <CheckCircle2 size={18} /> {actionMessage}
          </div>
        )}

        {/* Analytics Summary Bar */}
        <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '40px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>TOTAL DONORS PLEDGED</span>
              <Heart size={20} color="#EF4444" fill="#EF4444" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF' }}>{donors.length || stats.totalDonors}</div>
            <span style={{ fontSize: '0.78rem', color: '#10B981' }}>+12% from last month</span>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>ORGAN REQUESTS</span>
              <Activity size={20} color="#38BDF8" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF' }}>{requests.length || stats.totalRequests}</div>
            <span style={{ fontSize: '0.78rem', color: '#F87171' }}>Critical: {requests.filter(r => r.urgencyLevel === 'Critical').length}</span>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>MATCHED TRANSPLANTS</span>
              <CheckCircle2 size={20} color="#10B981" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF' }}>{stats.totalMatches}</div>
            <span style={{ fontSize: '0.78rem', color: '#38BDF8' }}>Verified Life Matches</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '32px' }}>
          <button
            onClick={() => setActiveTab('requests')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'requests' ? '3px solid #EF4444' : '3px solid transparent',
              color: activeTab === 'requests' ? '#FFF' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Organ Requests ({requests.length})
          </button>

          <button
            onClick={() => setActiveTab('donors')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'donors' ? '3px solid #EF4444' : '3px solid transparent',
              color: activeTab === 'donors' ? '#FFF' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Donor Directory ({donors.length})
          </button>

          <button
            onClick={() => setActiveTab('matching')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'matching' ? '3px solid #EF4444' : '3px solid transparent',
              color: activeTab === 'matching' ? '#FFF' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Zap size={16} color="#FBBF24" /> Auto Match Engine
          </button>
        </div>

        {/* Tab 1: Requests Table */}
        {activeTab === 'requests' && (
          <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>PATIENT</th>
                  <th style={{ padding: '12px' }}>ORGAN</th>
                  <th style={{ padding: '12px' }}>BLOOD</th>
                  <th style={{ padding: '12px' }}>URGENCY</th>
                  <th style={{ padding: '12px' }}>HOSPITAL</th>
                  <th style={{ padding: '12px' }}>STATUS</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '16px 12px' }}>
                      <strong style={{ color: '#FFF' }}>{req.patientName}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Age {req.patientAge}</div>
                    </td>
                    <td style={{ padding: '16px 12px', color: '#F87171', fontWeight: 700 }}>{req.organType}</td>
                    <td style={{ padding: '16px 12px' }}><span className="badge badge-sky">{req.bloodGroup}</span></td>
                    <td style={{ padding: '16px 12px' }}>
                      <span className={`badge ${req.urgencyLevel === 'Critical' ? 'badge-red' : 'badge-amber'}`}>
                        {req.urgencyLevel}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px' }}>{req.hospitalName}</td>
                    <td style={{ padding: '16px 12px' }}>
                      <span className={`badge ${req.status === 'Matched' ? 'badge-emerald' : 'badge-sky'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleUpdateRequestStatus(req._id, 'Matched')}
                          className="btn-emerald btn-sm"
                          style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                        >
                          Approve Match
                        </button>
                        <button
                          onClick={() => handleUpdateRequestStatus(req._id, 'Matching In Progress')}
                          className="btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                        >
                          Process
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Donors Table */}
        {activeTab === 'donors' && (
          <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>DONOR NAME</th>
                  <th style={{ padding: '12px' }}>BLOOD</th>
                  <th style={{ padding: '12px' }}>PLEDGED ORGANS</th>
                  <th style={{ padding: '12px' }}>CITY</th>
                  <th style={{ padding: '12px' }}>STATUS</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {donors.map(donor => (
                  <tr key={donor._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '16px 12px' }}>
                      <strong style={{ color: '#FFF' }}>{donor.fullName}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{donor.email}</div>
                    </td>
                    <td style={{ padding: '16px 12px' }}><span className="badge badge-red">{donor.bloodGroup}</span></td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {donor.organsToDonate && donor.organsToDonate.map(o => (
                          <span key={o} style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', borderRadius: '4px' }}>
                            {o}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px' }}>{donor.city}</td>
                    <td style={{ padding: '16px 12px' }}>
                      <span className="badge badge-emerald">{donor.status || 'Pledged'}</span>
                    </td>
                    <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleUpdateDonorStatus(donor._id, 'Active')}
                        className="btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        Set Active
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Matching Engine Overview */}
        {activeTab === 'matching' && (
          <div className="glass-panel" style={{ padding: '36px' }}>
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 32px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                background: 'rgba(251, 191, 36, 0.15)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                color: '#FBBF24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Zap size={28} />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Automated Cross-Match Simulator</h2>
              <p style={{ color: 'var(--text-muted)' }}>
                Scans blood compatibility matrix and organ tissue constraints across active patient requests.
              </p>
            </div>

            <div className="grid-2">
              {requests.map(req => {
                const compatibleDonors = donors.filter(d =>
                  d.bloodGroup === req.bloodGroup &&
                  d.organsToDonate && d.organsToDonate.includes(req.organType)
                );

                return (
                  <div key={req._id} className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #FBBF24' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <strong style={{ fontSize: '1.1rem', color: '#FFF' }}>{req.patientName}</strong>
                      <span className="badge badge-amber">{req.bloodGroup} &bull; {req.organType}</span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      Hospital: {req.hospitalName} ({req.hospitalCity})
                    </div>

                    <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.7)', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}>
                        COMPATIBLE MATCHES FOUND ({compatibleDonors.length}):
                      </span>
                      {compatibleDonors.length === 0 ? (
                        <span style={{ color: 'var(--text-muted)' }}>No exact blood/organ match in current queue.</span>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {compatibleDonors.map(cd => (
                            <div key={cd._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>&bull; {cd.fullName} ({cd.city})</span>
                              <button
                                onClick={() => handleUpdateRequestStatus(req._id, 'Matched', cd._id)}
                                className="btn-emerald btn-sm"
                                style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                              >
                                Pair Match
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
