import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, Heart, MapPin, Phone, ShieldCheck, X } from 'lucide-react';
import { apiService } from '../services/api';
import DonorCard from '../components/DonorCard';

const DonorList = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchCity, setSearchCity] = useState('');
  const [selectedOrgan, setSelectedOrgan] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Selected donor modal
  const [activeDonor, setActiveDonor] = useState(null);

  const organsList = ['Kidney', 'Liver', 'Heart', 'Lungs', 'Cornea', 'Pancreas', 'Tissue'];
  const bloodGroupsList = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  const fetchDonors = async () => {
    setLoading(true);
    const params = {};
    if (searchCity) params.city = searchCity;
    if (selectedOrgan) params.organ = selectedOrgan;
    if (selectedBloodGroup) params.bloodGroup = selectedBloodGroup;
    if (selectedStatus) params.status = selectedStatus;

    const res = await apiService.getDonors(params);
    if (res && res.success && res.donors) {
      setDonors(res.donors);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDonors();
  }, [selectedOrgan, selectedBloodGroup, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDonors();
  };

  const handleResetFilters = () => {
    setSearchCity('');
    setSelectedOrgan('');
    setSelectedBloodGroup('');
    setSelectedStatus('');
  };

  return (
    <div style={{ padding: '60px 0', minHeight: '90vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <span className="badge badge-sky" style={{ marginBottom: '8px' }}>NATIONAL DONOR DIRECTORY</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Search Registered Donors</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Browse active organ pledges and search compatible donors by blood group, organ type, and location.
          </p>
        </div>

        {/* Filter Panel */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '40px' }}>
          <form onSubmit={handleSearchSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              alignItems: 'end'
            }}>
              {/* City Search */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Search Location / City</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. New York, Chicago"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                  />
                  <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', right: '12px', top: '12px' }} />
                </div>
              </div>

              {/* Organ Filter */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Organ Type</label>
                <select
                  className="form-select"
                  value={selectedOrgan}
                  onChange={(e) => setSelectedOrgan(e.target.value)}
                >
                  <option value="">All Organ Types</option>
                  {organsList.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              {/* Blood Group Filter */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Blood Group</label>
                <select
                  className="form-select"
                  value={selectedBloodGroup}
                  onChange={(e) => setSelectedBloodGroup(e.target.value)}
                >
                  <option value="">All Blood Types</option>
                  {bloodGroupsList.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Donor Status</label>
                <select
                  className="form-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="Pledged">Pledged</option>
                  <option value="Active">Active</option>
                  <option value="Matched">Matched</option>
                </select>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn-primary btn-sm" style={{ height: '44px', flex: 1 }}>
                  Filter Donors
                </button>
                <button type="button" onClick={handleResetFilters} className="btn-secondary btn-sm" style={{ height: '44px' }}>
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Loading registered donors list...
          </div>
        ) : donors.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
            <Heart size={48} color="var(--text-dim)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No Donors Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              No donor records matched your search filters. Try adjusting location or blood type.
            </p>
            <button onClick={handleResetFilters} className="btn-secondary">Clear All Filters</button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Showing <strong>{donors.length}</strong> verified donor pledges
            </div>
            <div className="grid-3">
              {donors.map(donor => (
                <DonorCard key={donor._id} donor={donor} onSelect={(d) => setActiveDonor(d)} />
              ))}
            </div>
          </div>
        )}

        {/* Donor Detail Modal */}
        {activeDonor && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '580px', padding: '32px', position: 'relative' }}>
              <button
                onClick={() => setActiveDonor(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <X size={24} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#EF4444',
                  fontSize: '1.4rem',
                  fontWeight: 800
                }}>
                  {activeDonor.bloodGroup}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{activeDonor.fullName}</h2>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#38BDF8" /> {activeDonor.city} &bull; Age {activeDonor.age} ({activeDonor.gender})
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', fontSize: '0.9rem' }}>
                <div className="glass-card" style={{ padding: '16px' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', display: 'block' }}>DONOR STATUS</span>
                  <span className="badge badge-emerald" style={{ marginTop: '4px' }}>{activeDonor.status || 'Pledged'}</span>
                </div>
                <div className="glass-card" style={{ padding: '16px' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', display: 'block' }}>PREFERRED HOSPITAL</span>
                  <strong style={{ color: '#FFF' }}>{activeDonor.hospitalPreference || 'Any Certified Center'}</strong>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  PLEDGED ORGANS:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {activeDonor.organsToDonate && activeDonor.organsToDonate.map(o => (
                    <span key={o} className="badge badge-red" style={{ fontSize: '0.85rem' }}>
                      <Heart size={12} fill="#F87171" /> {o}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '16px', marginBottom: '24px', fontSize: '0.88rem' }}>
                <div style={{ color: '#38BDF8', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} /> Medical Notes & Eligibility
                </div>
                <p style={{ color: 'var(--text-muted)' }}>{activeDonor.medicalHistory || 'Clean medical history declared.'}</p>
              </div>

              <button onClick={() => setActiveDonor(null)} className="btn-primary" style={{ width: '100%' }}>
                Close Donor Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorList;
