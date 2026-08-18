import React from 'react';
import { Heart, PhoneCall, ShieldCheck, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: '#070A12',
      borderTop: '1px solid var(--border-color)',
      paddingTop: '60px',
      paddingBottom: '30px',
      marginTop: '80px'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Heart size={20} color="#FFF" fill="#FFF" />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#FFF' }}>
                Life<span style={{ color: '#EF4444' }}>Pulse</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Connecting organ donors, recipient patients, and transplant centers nationwide to save lives through real-time matching.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontSize: '0.85rem', fontWeight: 600 }}>
              <ShieldCheck size={18} /> Verified National Organ Donor Registry
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '20px', color: '#FFF' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/donors" style={{ color: 'var(--text-muted)' }}>Find Donors</Link></li>
              <li><Link to="/register-donor" style={{ color: 'var(--text-muted)' }}>Become a Donor</Link></li>
              <li><Link to="/request-organ" style={{ color: 'var(--text-muted)' }}>Request Organ</Link></li>
              <li><Link to="/login" style={{ color: 'var(--text-muted)' }}>User Dashboard</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '20px', color: '#FFF' }}>Organs Pledged</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Kidneys', 'Liver', 'Heart', 'Lungs', 'Cornea', 'Pancreas', 'Tissue', 'Bone Marrow'].map((item, i) => (
                <span key={i} className="badge badge-sky" style={{ fontSize: '0.7rem' }}>{item}</span>
              ))}
            </div>
          </div>

          {/* Col 4 */}
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '20px', color: '#FFF' }}>Emergency Hotline</h4>
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#F87171', fontWeight: 700, fontSize: '1.1rem' }}>
                <PhoneCall size={20} /> 1-800-DONOR-HELP
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                24/7 Organ Matching & Critical Support Desk
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> support@organregistry.org</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> National Health Plaza, Suite 500</span>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.85rem',
          color: 'var(--text-dim)'
        }}>
          <div>&copy; {new Date().getFullYear()} LifePulse Organ Donor Registry. All rights reserved.</div>
          <div>Privacy Policy &bull; Terms of Service &bull; HIPAA Compliant</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
