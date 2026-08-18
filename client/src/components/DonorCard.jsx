import React from 'react';
import { MapPin, Activity, Heart, Calendar, Phone, CheckCircle2 } from 'lucide-react';

const DonorCard = ({ donor, onSelect }) => {
  const getBloodBadgeClass = (group) => {
    switch (group) {
      case 'O+': case 'O-': return 'badge-red';
      case 'A+': case 'A-': return 'badge-sky';
      case 'B+': case 'B-': return 'badge-amber';
      case 'AB+': case 'AB-': return 'badge-purple';
      default: return 'badge-emerald';
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>
            {donor.fullName}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <MapPin size={14} color="#38BDF8" /> {donor.city}{donor.state ? `, ${donor.state}` : ''}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <span className={`badge ${getBloodBadgeClass(donor.bloodGroup)}`} style={{ fontSize: '0.85rem', padding: '4px 12px' }}>
            {donor.bloodGroup}
          </span>
          <span className={`badge ${donor.status === 'Active' ? 'badge-emerald' : 'badge-sky'}`} style={{ fontSize: '0.65rem' }}>
            <CheckCircle2 size={10} /> {donor.status || 'Pledged'}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div style={{
        padding: '12px 16px',
        borderRadius: '10px',
        background: 'rgba(15, 23, 42, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        marginBottom: '16px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        fontSize: '0.85rem'
      }}>
        <div>
          <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>AGE & GENDER</span>
          <strong style={{ color: '#FFF' }}>{donor.age} yrs ({donor.gender || 'Not specified'})</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>PREFERRED CENTER</span>
          <strong style={{ color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
            {donor.hospitalPreference || 'Any Certified'}
          </strong>
        </div>
      </div>

      {/* Organs Pledged */}
      <div style={{ marginBottom: '20px', flex: 1 }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
          ORGANS PLEDGED FOR DONATION:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {donor.organsToDonate && donor.organsToDonate.map((organ, index) => (
            <span key={index} style={{
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#F87171',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Heart size={12} fill="#F87171" /> {organ}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          <Calendar size={13} /> Registered: {new Date(donor.createdAt || Date.now()).toLocaleDateString()}
        </div>
        <button
          onClick={() => onSelect && onSelect(donor)}
          className="btn-secondary btn-sm"
          style={{ fontSize: '0.8rem' }}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default DonorCard;
