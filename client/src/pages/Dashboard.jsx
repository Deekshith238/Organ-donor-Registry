import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';
import { User, Heart, FilePlus, Activity, CheckCircle2, Clock, MapPin, Shield, Bell } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [myPledges, setMyPledges] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserActivities = async () => {
      setLoading(true);
      const donorRes = await apiService.getDonors();
      if (donorRes && donorRes.success && donorRes.donors) {
        // filter pledges for logged in user or show general sample for demo
        const userPledges = donorRes.donors.filter(d =>
          (user && d.email === user.email) || d.fullName === (user ? user.name : '')
        );
        setMyPledges(userPledges.length > 0 ? userPledges : donorRes.donors.slice(0, 1));
      }

      const reqRes = await apiService.getRequests();
      if (reqRes && reqRes.success && reqRes.requests) {
        const userReqs = reqRes.requests.filter(r =>
          (user && r.userId === user.id) || r.patientName.includes(user ? user.name.split(' ')[0] : 'Robert')
        );
        setMyRequests(userReqs.length > 0 ? userReqs : reqRes.requests.slice(0, 2));
      }
      setLoading(false);
    };

    fetchUserActivities();
  }, [user]);

  return (
    <div style={{ padding: '60px 0', minHeight: '90vh' }}>
      <div className="container">
        {/* Welcome Header */}
        <div className="glass-panel" style={{ padding: '32px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              fontSize: '1.8rem',
              fontWeight: 800
            }}>
              {user ? user.name.charAt(0) : 'U'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome, {user ? user.name : 'User'}</h1>
                <span className="badge badge-sky">{user ? user.role : 'Member'}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {user ? user.email : ''} &bull; Blood Group: <strong style={{ color: '#EF4444' }}>{user ? user.bloodGroup : 'O+'}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/register-donor" className="btn-primary btn-sm">
              <Heart size={16} fill="#FFF" /> Pledge Organ
            </Link>
            <Link to="/request-organ" className="btn-secondary btn-sm">
              <FilePlus size={16} /> Request Organ
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          {/* Main Content Col */}
          <div>
            {/* My Donor Pledges */}
            <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={20} color="#EF4444" fill="#EF4444" /> My Organ Donation Pledges
                </h3>
                <span className="badge badge-emerald">{myPledges.length} Active Pledge</span>
              </div>

              {myPledges.length === 0 ? (
                <div style={{ text: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  You haven't registered an organ pledge yet.{' '}
                  <Link to="/register-donor" style={{ color: '#EF4444', fontWeight: 600 }}>Pledge Now</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {myPledges.map(p => (
                    <div key={p._id} className="glass-card" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                          <strong style={{ fontSize: '1.1rem', color: '#FFF' }}>{p.fullName}</strong>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '8px' }}>({p.city})</span>
                        </div>
                        <span className="badge badge-emerald"><CheckCircle2 size={12} /> {p.status || 'Pledged'}</span>
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block' }}>PLEDGED ORGANS:</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                          {p.organsToDonate && p.organsToDonate.map(o => (
                            <span key={o} className="badge badge-red" style={{ fontSize: '0.75rem' }}>{o}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Requests */}
            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={20} color="#38BDF8" /> My Organ Requests & Match Tracker
                </h3>
                <span className="badge badge-sky">{myRequests.length} Requests</span>
              </div>

              {myRequests.length === 0 ? (
                <div style={{ text: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No organ requests submitted.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {myRequests.map(r => (
                    <div key={r._id} className="glass-card" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '1.1rem', color: '#FFF' }}>Patient: {r.patientName}</strong>
                        <span className={`badge ${r.status === 'Matched' ? 'badge-emerald' : 'badge-amber'}`}>
                          {r.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        Required: <strong style={{ color: '#F87171' }}>{r.organType}</strong> ({r.bloodGroup}) &bull; Hospital: {r.hospitalName}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div>
            <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} color="#FBBF24" /> Live Notifications
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <strong style={{ color: '#34D399', display: 'block' }}>Donor Pledge Confirmed</strong>
                  Your pledge certificate is generated and registered on the registry network.
                </div>
                <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <strong style={{ color: '#38BDF8', display: 'block' }}>Matching Engine Active</strong>
                  Automated blood-group & proximity engine scanning for matches 24/7.
                </div>
              </div>
            </div>

            {user && user.role === 'admin' && (
              <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#F87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={18} /> Administrator Privilege
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  You have full admin access to manage organ matching, approve pending requests, and view full analytics.
                </p>
                <Link to="/admin" className="btn-primary btn-sm" style={{ width: '100%' }}>
                  Open Admin Portal
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
