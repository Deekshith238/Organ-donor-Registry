import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Heart, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const DonorRegistration = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user ? user.name : '',
    email: user ? user.email : '',
    phone: user ? user.phone || '' : '',
    age: 28,
    gender: 'Male',
    bloodGroup: user ? (user.bloodGroup !== 'Not Specified' ? user.bloodGroup : 'O+') : 'O+',
    organsToDonate: ['Kidney', 'Cornea'],
    city: user ? user.city || '' : '',
    state: '',
    hospitalPreference: 'Nearest Certified Medical Center',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyRelationship: 'Spouse',
    medicalHistory: 'No chronic illness. Clean health history.',
    consentAgreed: false
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        bloodGroup: (user.bloodGroup && user.bloodGroup !== 'Not Specified') ? user.bloodGroup : prev.bloodGroup,
        city: prev.city || user.city || ''
      }));
    }
  }, [user]);

  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const availableOrgans = ['Kidney', 'Liver', 'Heart', 'Lungs', 'Cornea', 'Pancreas', 'Intestines', 'Tissue'];

  const handleOrganToggle = (organ) => {
    let updated = [...formData.organsToDonate];
    if (updated.includes(organ)) {
      updated = updated.filter(o => o !== organ);
    } else {
      updated.push(organ);
    }
    setFormData({ ...formData, organsToDonate: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consentAgreed) {
      setMessage({ type: 'error', text: 'You must confirm the legal donor consent declaration.' });
      return;
    }
    if (formData.organsToDonate.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one organ to pledge.' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      age: Number(formData.age),
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      organsToDonate: formData.organsToDonate,
      city: formData.city,
      state: formData.state,
      hospitalPreference: formData.hospitalPreference,
      emergencyContact: {
        name: formData.emergencyContactName,
        relationship: formData.emergencyRelationship,
        phone: formData.emergencyContactPhone
      },
      medicalHistory: formData.medicalHistory
    };

    try {
      const res = await apiService.registerDonor(payload);
      if (res && res.success) {
        setMessage({ type: 'success', text: 'Congratulations! Your Organ Donor Pledge has been registered.' });
        setTimeout(() => {
          navigate('/donors');
        }, 1800);
      } else {
        setMessage({ type: 'error', text: res ? res.message : 'Registration failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to submit pledge. Please check network connection.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '60px 0', minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="glass-panel" style={{ padding: '40px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div className="badge badge-red glow-pulse" style={{ marginBottom: '12px' }}>
              <Heart size={14} fill="#EF4444" /> OFFICIAL ORGAN DONOR REGISTRATION
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Pledge to Save Lives</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>
              Your organ donation pledge can save up to 8 lives and enhance 75 more.
            </p>
          </div>

          {message.text && (
            <div style={{
              padding: '14px 20px',
              borderRadius: '10px',
              background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              color: message.type === 'success' ? '#34D399' : '#F87171',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Donor Personal Info */}
            <h3 style={{ fontSize: '1.15rem', color: '#38BDF8', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              1. Personal & Contact Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-input"
                  min="18"
                  max="90"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  className="form-select"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Step 2: Organs to Pledge */}
            <h3 style={{ fontSize: '1.15rem', color: '#38BDF8', margin: '28px 0 16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              2. Select Organs / Tissues to Pledge
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              {availableOrgans.map(organ => {
                const selected = formData.organsToDonate.includes(organ);
                return (
                  <div
                    key={organ}
                    onClick={() => handleOrganToggle(organ)}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      background: selected ? 'rgba(239, 68, 68, 0.18)' : 'rgba(15, 23, 42, 0.5)',
                      border: `1px solid ${selected ? '#EF4444' : 'var(--border-color)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      border: `2px solid ${selected ? '#EF4444' : 'var(--text-dim)'}`,
                      background: selected ? '#EF4444' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {selected && <CheckCircle2 size={14} color="#FFF" />}
                    </div>
                    <span style={{ color: selected ? '#FFF' : 'var(--text-muted)', fontWeight: selected ? 700 : 500, fontSize: '0.9rem' }}>
                      {organ}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Step 3: Emergency Contact & Medical Declaration */}
            <h3 style={{ fontSize: '1.15rem', color: '#38BDF8', margin: '28px 0 16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              3. Emergency Representative & Medical Notes
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Contact Person Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Relative / Next of Kin"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Relationship</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Spouse, Parent, Sibling"
                  value={formData.emergencyRelationship}
                  onChange={(e) => setFormData({ ...formData, emergencyRelationship: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+1 555-9876"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Medical History / Notes</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Mention any prior medical conditions, blood pressure, diabetes, or health notes..."
                value={formData.medicalHistory}
                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
              ></textarea>
            </div>

            {/* Consent check */}
            <div style={{
              padding: '16px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-color)',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <input
                type="checkbox"
                id="consent"
                style={{ width: '18px', height: '18px', marginTop: '3px', accentColor: '#EF4444', cursor: 'pointer' }}
                checked={formData.consentAgreed}
                onChange={(e) => setFormData({ ...formData, consentAgreed: e.target.checked })}
              />
              <label htmlFor="consent" style={{ fontSize: '0.88rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                I hereby declare my voluntary intention to pledge my organs for humanitarian transplant purposes upon my passing or as legally permitted. I authorize LifePulse registry to share donor availability with certified medical centers.
              </label>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              style={{ width: '100%', padding: '16px', fontSize: '1.05rem' }}
            >
              {submitting ? 'Submitting Pledge...' : 'Submit Organ Donor Pledge'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonorRegistration;
