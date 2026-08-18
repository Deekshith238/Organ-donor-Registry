import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Heart, User, LogOut, Menu, X, Shield, Search, FilePlus, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
          }}>
            <Heart size={24} color="#FFF" fill="#FFF" />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#FFF', letterSpacing: '-0.02em' }}>
              Life<span style={{ color: '#EF4444' }}>Pulse</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '-3px' }}>
              Organ Donor Registry
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-menu">
          <Link to="/" style={{
            padding: '8px 16px',
            borderRadius: '8px',
            color: isActive('/') ? '#EF4444' : 'var(--text-main)',
            fontWeight: isActive('/') ? 700 : 500,
            fontSize: '0.95rem',
            transition: 'all 0.2s'
          }}>
            Home
          </Link>

          <Link to="/donors" style={{
            padding: '8px 16px',
            borderRadius: '8px',
            color: isActive('/donors') ? '#EF4444' : 'var(--text-main)',
            fontWeight: isActive('/donors') ? 700 : 500,
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Search size={16} /> Find Donors
          </Link>

          <Link to="/register-donor" style={{
            padding: '8px 16px',
            borderRadius: '8px',
            color: isActive('/register-donor') ? '#EF4444' : 'var(--text-main)',
            fontWeight: isActive('/register-donor') ? 700 : 500,
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Heart size={16} /> Donate Organ
          </Link>

          <Link to="/request-organ" style={{
            padding: '8px 16px',
            borderRadius: '8px',
            color: isActive('/request-organ') ? '#EF4444' : 'var(--text-main)',
            fontWeight: isActive('/request-organ') ? 700 : 500,
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <FilePlus size={16} /> Request Organ
          </Link>
        </div>

        {/* User / Auth Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/dashboard" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                fontSize: '0.9rem',
                color: '#FFF'
              }}>
                <LayoutDashboard size={16} color="#38BDF8" />
                <span>Dashboard</span>
                {user.role === 'admin' && (
                  <span className="badge badge-red" style={{ fontSize: '0.65rem' }}>ADMIN</span>
                )}
              </Link>

              {user.role === 'admin' && (
                <Link to="/admin" style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#F87171',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Shield size={16} /> Admin Portal
                </Link>
              )}

              <button onClick={handleLogout} className="btn-secondary btn-sm" title="Log out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
