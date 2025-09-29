import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../config/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(API_ENDPOINTS.REFRESH_TOKEN, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          await AsyncStorage.setItem('access_token', access);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        // You might want to dispatch a logout action here
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication Services
export const authService = {
  login: async (username, password) => {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
      username,
      password,
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
  },
};

// User Services
export const userService = {
  getUserProfiles: async () => {
    const response = await apiClient.get(API_ENDPOINTS.USER_PROFILES);
    return response.data;
  },

  getUserProfile: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.USER_PROFILES}${id}/`);
    return response.data;
  },
};

// Patient Services
export const patientService = {
  getPatients: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PATIENTS);
    return response.data;
  },

  getPatient: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.PATIENTS}${id}/`);
    return response.data;
  },

  createPatient: async (patientData) => {
    const response = await apiClient.post(API_ENDPOINTS.PATIENTS, patientData);
    return response.data;
  },

  updatePatient: async (id, patientData) => {
    const response = await apiClient.put(`${API_ENDPOINTS.PATIENTS}${id}/`, patientData);
    return response.data;
  },

  deletePatient: async (id) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.PATIENTS}${id}/`);
    return response.data;
  },

  aiTagPatient: async (id) => {
    const response = await apiClient.post(API_ENDPOINTS.PATIENT_AI_TAG(id));
    return response.data;
  },
};

// Auction Services
export const auctionService = {
  getAuctions: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AUCTIONS);
    return response.data;
  },

  getAuction: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.AUCTIONS}${id}/`);
    return response.data;
  },

  createAuction: async (auctionData) => {
    const response = await apiClient.post(API_ENDPOINTS.AUCTIONS, auctionData);
    return response.data;
  },

  updateAuction: async (id, auctionData) => {
    const response = await apiClient.put(`${API_ENDPOINTS.AUCTIONS}${id}/`, auctionData);
    return response.data;
  },

  deleteAuction: async (id) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.AUCTIONS}${id}/`);
    return response.data;
  },

  aiTagAuction: async (id) => {
    const response = await apiClient.post(API_ENDPOINTS.AUCTION_AI_TAG(id));
    return response.data;
  },

  blockchainLogAuction: async (id) => {
    const response = await apiClient.post(API_ENDPOINTS.AUCTION_BLOCKCHAIN_LOG(id));
    return response.data;
  },
};

// Bid Services
export const bidService = {
  getBids: async () => {
    const response = await apiClient.get(API_ENDPOINTS.BIDS);
    return response.data;
  },

  getBid: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.BIDS}${id}/`);
    return response.data;
  },

  createBid: async (bidData) => {
    const response = await apiClient.post(API_ENDPOINTS.BIDS, bidData);
    return response.data;
  },

  updateBid: async (id, bidData) => {
    const response = await apiClient.put(`${API_ENDPOINTS.BIDS}${id}/`, bidData);
    return response.data;
  },

  deleteBid: async (id) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.BIDS}${id}/`);
    return response.data;
  },
};

// Donation Services
export const donationService = {
  getDonations: async () => {
    const response = await apiClient.get(API_ENDPOINTS.DONATIONS);
    return response.data;
  },

  getDonation: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.DONATIONS}${id}/`);
    return response.data;
  },

  createDonation: async (donationData) => {
    const response = await apiClient.post(API_ENDPOINTS.DONATIONS, donationData);
    return response.data;
  },

  updateDonation: async (id, donationData) => {
    const response = await apiClient.put(`${API_ENDPOINTS.DONATIONS}${id}/`, donationData);
    return response.data;
  },

  deleteDonation: async (id) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.DONATIONS}${id}/`);
    return response.data;
  },

  blockchainLogDonation: async (id) => {
    const response = await apiClient.post(API_ENDPOINTS.DONATION_BLOCKCHAIN_LOG(id));
    return response.data;
  },
};

// Payment Services (GCash)
export const paymentService = {
  createGcashIntent: async ({ amount, currency = 'PHP', description, donation_id }) => {
    const response = await apiClient.post(API_ENDPOINTS.PAYMENT_GCASH_INTENT, {
      amount,
      currency,
      description,
      donation_id,
    });
    return response.data; // { id, checkout_url, qr_image_url }
  },

  getPaymentStatus: async (paymentId) => {
    const response = await apiClient.get(API_ENDPOINTS.PAYMENT_STATUS(paymentId));
    return response.data; // { id, status: 'pending'|'paid'|'failed' }
  },
};

// Transaction Services
export const transactionService = {
  getTransactions: async () => {
    const response = await apiClient.get(API_ENDPOINTS.TRANSACTIONS);
    return response.data;
  },

  getTransaction: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.TRANSACTIONS}${id}/`);
    return response.data;
  },
};

// Recommendation Services
export const recommendationService = {
  getDonorRecommendations: async () => {
    const response = await apiClient.get(API_ENDPOINTS.DONOR_RECOMMENDATIONS);
    return response.data;
  },
};

export default apiClient;
