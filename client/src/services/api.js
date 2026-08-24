import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// =====================================================
// JWT INTERCEPTOR
// =====================================================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('organ_donor_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If backend returns 401, remove invalid token
    if (error.response?.status === 401) {
      localStorage.removeItem('organ_donor_token');
      localStorage.removeItem('organ_donor_user');
    }

    return Promise.reject(error);
  }
);

// =====================================================
// API SERVICE
// MongoDB + Backend are the ONLY source of data
// No mock/demo fallback data
// =====================================================

export const apiService = {

  // ===================================================
  // AUTH
  // ===================================================

  login: async (credentials) => {
    try {
      const res = await API.post('/auth/login', credentials);

      if (res.data?.token) {
        localStorage.setItem(
          'organ_donor_token',
          res.data.token
        );
      }

      if (res.data?.user) {
        localStorage.setItem(
          'organ_donor_user',
          JSON.stringify(res.data.user)
        );
      }

      return res.data;

    } catch (err) {
      console.error(
        'Login Error:',
        err.response?.data || err.message
      );

      return {
        success: false,
        message:
          err.response?.data?.message ||
          'Login failed. Please check your backend server.'
      };
    }
  },


  // ===================================================
  // REGISTER
  // ===================================================

  register: async (userData) => {
    try {
      const res = await API.post(
        '/auth/register',
        userData
      );

      if (res.data?.token) {
        localStorage.setItem(
          'organ_donor_token',
          res.data.token
        );
      }

      if (res.data?.user) {
        localStorage.setItem(
          'organ_donor_user',
          JSON.stringify(res.data.user)
        );
      }

      return res.data;

    } catch (err) {
      console.error(
        'Register Error:',
        err.response?.data || err.message
      );

      return {
        success: false,
        message:
          err.response?.data?.message ||
          'Registration failed. Please try again.'
      };
    }
  },


  // ===================================================
  // GET CURRENT USER
  // ===================================================

  getMe: async () => {
    try {
      const res = await API.get('/auth/me');

      return res.data;

    } catch (err) {
      console.error(
        'Get Me Error:',
        err.response?.data || err.message
      );

      return {
        success: false,
        user: null,
        message:
          err.response?.data?.message ||
          'Unable to fetch user information.'
      };
    }
  },


  // ===================================================
  // LOGOUT
  // ===================================================

  logout: () => {
    localStorage.removeItem('organ_donor_token');
    localStorage.removeItem('organ_donor_user');

    return {
      success: true,
      message: 'Logged out successfully'
    };
  },


  // ===================================================
  // DONORS
  // ===================================================

  getDonors: async (params = {}) => {
    try {
      const res = await API.get(
        '/donors',
        {
          params
        }
      );

      return res.data;

    } catch (err) {
      console.error(
        'Get Donors Error:',
        err.response?.data || err.message
      );

      return {
        success: false,
        count: 0,
        donors: [],
        message:
          err.response?.data?.message ||
          'Unable to fetch donors from server.'
      };
    }
  },


  // ===================================================
  // REGISTER DONOR
  // ===================================================

  registerDonor: async (donorData) => {
    try {
      const res = await API.post(
        '/donors',
        donorData
      );

      return res.data;

    } catch (err) {
      console.error(
        'Register Donor Error:',
        err.response?.data || err.message
      );

      return {
        success: false,
        message:
          err.response?.data?.message ||
          'Unable to register donor.'
      };
    }
  },


  // ===================================================
  // UPDATE DONOR STATUS
  // ===================================================

  updateDonorStatus: async (id, status) => {
    try {
      const res = await API.put(
        `/donors/${id}/status`,
        {
          status
        }
      );

      return res.data;

    } catch (err) {
      console.error(
        'Update Donor Status Error:',
        err.response?.data || err.message
      );

      return {
        success: false,
        message:
          err.response?.data?.message ||
          'Unable to update donor status.'
      };
    }
  },


  // ===================================================
  // ORGAN REQUESTS
  // ===================================================

  getRequests: async (params = {}) => {
    try {
      const res = await API.get(
        '/requests',
        {
          params
        }
      );

      return res.data;

    } catch (err) {
      console.error(
        'Get Requests Error:',
        err.response?.data || err.message
      );

      return {
        success: false,
        count: 0,
        requests: [],
        message:
          err.response?.data?.message ||
          'Unable to fetch organ requests from server.'
      };
    }
  },


  // ===================================================
  // CREATE ORGAN REQUEST
  // ===================================================

  createRequest: async (requestData) => {
    try {
      const res = await API.post(
        '/requests',
        requestData
      );

      return res.data;

    } catch (err) {
      console.error(
        'Create Request Error:',
        err.response?.data || err.message
      );

      return {
        success: false,
        message:
          err.response?.data?.message ||
          'Unable to submit organ request.'
      };
    }
  },


  // ===================================================
  // UPDATE ORGAN REQUEST STATUS
  // ===================================================

  updateRequestStatus: async (
    id,
    status,
    matchedDonorId = null
  ) => {
    try {
      const res = await API.put(
        `/requests/${id}/status`,
        {
          status,
          matchedDonorId
        }
      );

      return res.data;

    } catch (err) {
      console.error(
        'Update Request Status Error:',
        err.response?.data || err.message
      );

      return {
        success: false,
        message:
          err.response?.data?.message ||
          'Unable to update request status.'
      };
    }
  },


  // ===================================================
  // ORGANS
  // ===================================================

  getOrgans: async () => {
    try {
      const res = await API.get(
        '/organs'
      );

      return res.data;

    } catch (err) {
      console.error(
        'Get Organs Error:',
        err.response?.data || err.message
      );

      return {
        success: false,
        count: 0,
        organs: [],
        message:
          err.response?.data?.message ||
          'Unable to fetch organs from server.'
      };
    }
  },


  // ===================================================
  // ORGAN STATISTICS
  // ===================================================

  getStats: async () => {
    try {
      const res = await API.get(
        '/organs/stats'
      );

      return res.data;

    } catch (err) {
      console.error(
        'Get Stats Error:',
        err.response?.data || err.message
      );

      return {
        success: false,
        stats: {
          totalDonors: 0,
          totalRequests: 0,
          totalMatches: 0,
          availableOrgans: 0,
          livesSaved: 0
        },
        message:
          err.response?.data?.message ||
          'Unable to fetch statistics from server.'
      };
    }
  }

};


// =====================================================
// EXPORT AXIOS INSTANCE
// =====================================================

export default API;