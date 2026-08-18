import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, ShieldCheck, Activity, Users, Award, ArrowRight, CheckCircle2, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { apiService } from '../services/api';
import DonorCard from '../components/DonorCard';

const Home = () => {
  const [stats, setStats] = useState({ totalDonors: 482, totalRequests: 129, totalMatches: 84, livesSaved: 84 });
  const [featuredDonors, setFeaturedDonors] = useState([]);
  const [urgentRequests, setUrgentRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const statsRes = await apiService.getStats();
      if (statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
      }

      const donorRes = await apiService.getDonors();
      if (donorRes.success && donorRes.donors) {
        setFeaturedDonors(donorRes.donors.slice(0, 3));
      }

      const reqRes = await apiService.getRequests({ urgency: 'Critical' });
      if (reqRes.success && reqRes.requests) {
        setUrgentRequests(reqRes.requests.slice(0, 3));
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '100px 0 80px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 20%, rgba(239, 68, 68, 0.15) 0%, rgba(11, 15, 25, 1) 70%)'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
            <div className="badge badge-red glow-pulse" style={{ marginBottom: '24px', padding: '8px 18px', fontSize: '0.85rem' }}>
              <Heart size={14} fill="#EF4444" /> Saving Lives Through Organ Donation
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '24px',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Give the Gift of Life.<br />
              <span style={{ background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Match Donors & Save Patients.
              </span>
            </h1>

            <p style={{
              fontSize: '1.2rem',
              color: 'var(--text-muted)',
              marginBottom: '40px',
              lineHeight: 1.7
            }}>
              LifePulse is a secure, HIPAA-compliant national registry connecting willing organ donors with patients in urgent need. Register your pledge or find a compatible match in minutes.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/register-donor" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
                <Heart size={20} fill="#FFF" /> Become an Organ Donor
              </Link>
              <Link to="/donors" className="btn-secondary" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
                <Search size={20} /> Search Donor Directory
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="glass-panel" style={{
            marginTop: '80px',
            padding: '32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ color: '#EF4444', fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                {stats.totalDonors}+
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>REGISTERED DONORS</span>
            </div>
            <div>
              <div style={{ color: '#38BDF8', fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                {stats.totalRequests}
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>ACTIVE PATIENT REQUESTS</span>
            </div>
            <div>
              <div style={{ color: '#10B981', fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                {stats.livesSaved}+
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>TRANSPLANTS MATCHED</span>
            </div>
            <div>
              <div style={{ color: '#FBBF24', fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                98.4%
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>SUCCESSFUL MATCH RATE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Requests Alert Feed */}
      {urgentRequests.length > 0 && (
        <section style={{ padding: '40px 0', background: 'rgba(239, 68, 68, 0.05)', borderY: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge badge-red glow-pulse" style={{ fontSize: '0.8rem' }}>
                  <AlertTriangle size={14} /> CRITICAL PRIORITY
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Urgent Organ Requests Pending Match</h2>
              </div>
              <Link to="/request-organ" style={{ color: '#EF4444', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Submit New Request <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid-3">
              {urgentRequests.map(req => (
                <div key={req._id} className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #EF4444' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span className="badge badge-red">{req.urgencyLevel}</span>
                    <span className="badge badge-sky">{req.bloodGroup}</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{req.patientName} ({req.patientAge} yrs)</h3>
                  <div style={{ fontSize: '0.9rem', color: '#F87171', fontWeight: 700, marginBottom: '8px' }}>
                    Required Organ: {req.organType}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} /> {req.hospitalName}, {req.hospitalCity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it Works Section */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 60px' }}>
            <span className="badge badge-sky" style={{ marginBottom: '12px' }}>SIMPLE 3-STEP PROCESS</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>How LifePulse Registry Works</h2>
            <p style={{ color: 'var(--text-muted)' }}>Transparent, secure, and fast workflow for donors, recipients, and medical centers.</p>
          </div>

          <div className="grid-3">
            <div className="glass-card" style={{ padding: '36px', textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                fontWeight: 800,
                margin: '0 auto 24px'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Register Pledge</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Fill out the donor pledge form specifying blood group, organs you wish to donate, and emergency contact details.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '36px', textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38BDF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                fontWeight: 800,
                margin: '0 auto 24px'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Automated Matching</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Our algorithm matches donor profiles against active hospital organ requests based on blood group compatibility and location.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '36px', textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                fontWeight: 800,
                margin: '0 auto 24px'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Transplant Verification</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Hospital transplant coordinators verify eligibility, contact emergency representatives, and initiate life-saving procedures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Donors Section */}
      {featuredDonors.length > 0 && (
        <section style={{ padding: '80px 0', background: 'rgba(15, 23, 42, 0.6)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>HERO REGISTRY</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Recently Pledged Donors</h2>
              </div>
              <Link to="/donors" className="btn-secondary">
                View All Donors ({stats.totalDonors}) <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid-3">
              {featuredDonors.map(donor => (
                <DonorCard key={donor._id} donor={donor} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
