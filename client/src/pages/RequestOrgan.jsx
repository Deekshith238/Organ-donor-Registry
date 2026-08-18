import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';
import { FilePlus, AlertTriangle, CheckCircle2, AlertCircle, Phone, Building2 } from 'lucide-react';

const RequestOrgan = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientName: user ? user.name : '',
    patientAge: 45,
    organType: 'Kidney',
    bloodGroup: user ? (user.bloodGroup !== 'Not Specified' ? user.bloodGroup : 'A+') : 'A+',
    urgencyLevel: 'Critical',
    hospitalName: 'Mount Sinai Hospital',
    hospitalCity: user ? user.city || 'New York' : 'New York',
    attendingDoctor: 'Dr. Evelyn Reed',
    contactPhone: user ? user.phone || '+1 555-0199' : '+1 555-0199',
    medicalDetails: 'End-stage organ dysfunction, requiring urgent transplant protocol.'
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        patientName: prev.patientName || user.name || '',
        bloodGroup: (user.bloodGroup && user.bloodGroup !== 'Not Specified') ? user.bloodGroup : prev.bloodGroup,
        hospitalCity: prev.hospitalCity || user.city || 'New York',
        contactPhone: prev.contactPhone || user.phone || '+1 555-0199'
      }));
    }
  }, [user]);

  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const organsList = ['Kidney', 'Liver', 'Heart', 'Lungs', 'Cornea', 'Pancreas', 'Intestines', 'Tissue'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await apiService.createRequest(formData);
      if (res && res.success) {
        setMessage({ type: 'success', text: 'Organ request broadcasted to registry network successfully!' });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1800);
      } else {
        setMessage({ type: 'error', text: res ? res.message : 'Failed to submit request' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Submission error. Please check network connection.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '60px 0', minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '760px' }}>
        <div className="glass-panel" style={{ padding: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div className="badge badge-red glow-pulse" style={{ marginBottom: '12px' }}>
              <AlertTriangle size={14} /> RECIPIENT ORGAN REQUEST FORM
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Submit Urgent Organ Request</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>
              Submit recipient patient credentials for immediate cross-matching against active donors.
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Patient Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Patient Age</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.patientAge}
                  onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Organ Needed</label>
                <select
                  className="form-select"
                  value={formData.organType}
                  onChange={(e) => setFormData({ ...formData, organType: e.target.value })}
                >
                  {organsList.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Required Blood Group</label>
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
                <label className="form-label">Urgency Priority</label>
                <select
                  className="form-select"
                  value={formData.urgencyLevel}
                  onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
                >
                  <option value="Critical">Critical (Immediate 24h)</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Standard Queue</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Hospital / Medical Facility</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hospital City</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.hospitalCity}
                  onChange={(e) => setFormData({ ...formData, hospitalCity: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Attending Physician / Doctor</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.attendingDoctor}
                  onChange={(e) => setFormData({ ...formData, attendingDoctor: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Emergency Phone Contact</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Medical Details & Clinical Summary</label>
              <textarea
                className="form-textarea"
                rows="4"
                value={formData.medicalDetails}
                onChange={(e) => setFormData({ ...formData, medicalDetails: e.target.value })}
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              style={{ width: '100%', padding: '16px', fontSize: '1.05rem', marginTop: '12px' }}
            >
              {submitting ? 'Broadcasting Request...' : 'Broadcast Organ Request to Registry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestOrgan;
