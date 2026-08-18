import React, { createContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('organ_donor_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('organ_donor_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      if (token) {
        try {
          const res = await apiService.getMe();
          if (res && res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('organ_donor_user', JSON.stringify(res.user));
          }
        } catch (e) {
          // Token expired or invalid
        }
      }
      setLoading(false);
    };
    checkLoggedInUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await apiService.login({ email, password });
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('organ_donor_token', res.token);
      localStorage.setItem('organ_donor_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (userData) => {
    const res = await apiService.register(userData);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('organ_donor_token', res.token);
      localStorage.setItem('organ_donor_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('organ_donor_token');
    localStorage.removeItem('organ_donor_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
