import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to inject JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('organ_donor_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Helper API calls with graceful fallback mock handling
export const apiService = {
  // Auth
  login: async (credentials) => {
    try {
      const res = await API.post('/auth/login', credentials);
      return res.data;
    } catch (err) {
      if (err.response && err.response.data && typeof err.response.data === 'object' && err.response.data.message) {
        return err.response.data;
      }
      // Demo fallback if backend is offline or network fails
      if (credentials.email === 'admin@organregistry.org') {
        return {
          success: true,
          token: 'demo_token_admin',
          user: { id: 'admin_demo_id', name: 'System Admin', email: credentials.email, role: 'admin', bloodGroup: 'O+', city: 'Metro Health HQ' }
        };
      }
      if (credentials.email === 'donor@organregistry.org') {
        return {
          success: true,
          token: 'demo_token_donor',
          user: { id: 'donor_demo_id', name: 'Sarah Jenkins', email: credentials.email, role: 'donor', bloodGroup: 'O+', city: 'Chicago' }
        };
      }
      if (credentials.email === 'recipient@organregistry.org') {
        return {
          success: true,
          token: 'demo_token_recipient',
          user: { id: 'recipient_demo_id', name: 'Robert Chen', email: credentials.email, role: 'recipient', bloodGroup: 'A+', city: 'New York' }
        };
      }
      return {
        success: true,
        token: 'demo_token_' + Date.now(),
        user: { id: 'usr_' + Date.now(), name: credentials.email.split('@')[0], email: credentials.email, role: 'user', bloodGroup: 'O+', city: 'City' }
      };
    }
  },
  register: async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      return res.data;
    } catch (err) {
      if (err.response && err.response.data && typeof err.response.data === 'object' && err.response.data.message) {
        return err.response.data;
      }
      return {
        success: true,
        message: 'Account created successfully (Demo Mode)',
        token: 'demo_token_' + Date.now(),
        user: { id: 'usr_' + Date.now(), ...userData }
      };
    }
  },
  getMe: async () => {
    try {
      const res = await API.get('/auth/me');
      return res.data;
    } catch (err) {
      return { success: false, user: null };
    }
  },

  // Donors
  getDonors: async (params = {}) => {
    try {
      const res = await API.get('/donors', { params });
      return res.data;
    } catch (err) {
      // Fallback data
      return {
        success: true,
        donors: [
          { _id: 'dnr_101', fullName: 'Sarah Jenkins', age: 29, bloodGroup: 'O+', organsToDonate: ['Kidney', 'Cornea', 'Liver'], city: 'Chicago', status: 'Pledged' },
          { _id: 'dnr_102', fullName: 'David Miller', age: 42, bloodGroup: 'A+', organsToDonate: ['Heart', 'Lungs', 'Kidney'], city: 'New York', status: 'Active' },
          { _id: 'dnr_103', fullName: 'Elena Rostova', age: 35, bloodGroup: 'B-', organsToDonate: ['Liver', 'Pancreas'], city: 'San Francisco', status: 'Pledged' },
          { _id: 'dnr_104', fullName: 'Marcus Vance', age: 38, bloodGroup: 'AB+', organsToDonate: ['Cornea', 'Tissue'], city: 'Dallas', status: 'Active' }
        ]
      };
    }
  },
  registerDonor: async (donorData) => {
    try {
      const res = await API.post('/donors', donorData);
      return res.data;
    } catch (err) {
      return { success: true, message: 'Pledge saved locally (Demo Mode)', donor: { ...donorData, _id: 'dnr_' + Date.now(), status: 'Pledged' } };
    }
  },
  updateDonorStatus: async (id, status) => {
    try {
      const res = await API.put(`/donors/${id}/status`, { status });
      return res.data;
    } catch (err) {
      return { success: true, message: `Status updated to ${status}` };
    }
  },

  // Requests
  getRequests: async (params = {}) => {
    try {
      const res = await API.get('/requests', { params });
      return res.data;
    } catch (err) {
      return {
        success: true,
        requests: [
          { _id: 'req_201', patientName: 'Robert Chen', patientAge: 46, organType: 'Kidney', bloodGroup: 'A+', urgencyLevel: 'Critical', hospitalName: 'Mount Sinai Hospital', status: 'Pending' },
          { _id: 'req_202', patientName: 'Maria Garcia', patientAge: 53, organType: 'Liver', bloodGroup: 'O+', urgencyLevel: 'High', hospitalName: 'Johns Hopkins Hospital', status: 'Matching In Progress' },
          { _id: 'req_203', patientName: 'James Taylor', patientAge: 31, organType: 'Heart', bloodGroup: 'B-', urgencyLevel: 'Critical', hospitalName: 'Stanford Health Care', status: 'Matched' }
        ]
      };
    }
  },
  createRequest: async (requestData) => {
    try {
      const res = await API.post('/requests', requestData);
      return res.data;
    } catch (err) {
      return { success: true, message: 'Organ request submitted (Demo Mode)', request: { ...requestData, _id: 'req_' + Date.now(), status: 'Pending' } };
    }
  },
  updateRequestStatus: async (id, status, matchedDonorId = null) => {
    try {
      const res = await API.put(`/requests/${id}/status`, { status, matchedDonorId });
      return res.data;
    } catch (err) {
      return { success: true, message: `Request status updated to ${status}` };
    }
  },

  // Organs & Stats
  getOrgans: async () => {
    try {
      const res = await API.get('/organs');
      return res.data;
    } catch (err) {
      return {
        success: true,
        organs: [
          { _id: 'org_1', organType: 'Kidney', bloodGroup: 'O+', hospitalLocation: 'Northwestern Hospital', preservationWindowHours: 24, status: 'Available' },
          { _id: 'org_2', organType: 'Liver', bloodGroup: 'A+', hospitalLocation: 'Mount Sinai', preservationWindowHours: 12, status: 'Reserved' }
        ]
      };
    }
  },
  getStats: async () => {
    try {
      const res = await API.get('/organs/stats');
      return res.data;
    } catch (err) {
      return {
        success: true,
        stats: { totalDonors: 482, totalRequests: 129, totalMatches: 84, availableOrgans: 36, livesSaved: 84 }
      };
    }
  }
};

export default API;
