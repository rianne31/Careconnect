// API Configuration for CareConnect
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// For production, change this to your deployed backend URL
// const API_BASE_URL = 'https://your-backend-domain.com/api';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/token/`,
  REFRESH_TOKEN: `${API_BASE_URL}/token/refresh/`,
  REGISTER: `${API_BASE_URL}/register/`,
  
  // User Management
  USER_PROFILES: `${API_BASE_URL}/user-profiles/`,
  
  // Patient Management
  PATIENTS: `${API_BASE_URL}/patients/`,
  PATIENT_AI_TAG: (id) => `${API_BASE_URL}/patients/${id}/ai-tag/`,
  
  // Auctions
  AUCTIONS: `${API_BASE_URL}/auctions/`,
  AUCTION_AI_TAG: (id) => `${API_BASE_URL}/auctions/${id}/ai-tag/`,
  AUCTION_BLOCKCHAIN_LOG: (id) => `${API_BASE_URL}/auctions/${id}/blockchain-log/`,
  
  // Bids
  BIDS: `${API_BASE_URL}/bids/`,
  
  // Donations
  DONATIONS: `${API_BASE_URL}/donations/`,
  DONATION_BLOCKCHAIN_LOG: (id) => `${API_BASE_URL}/donations/${id}/blockchain-log/`,

  // Payments - GCash
  PAYMENT_GCASH_INTENT: `${API_BASE_URL}/payments/gcash/intent/`,
  PAYMENT_STATUS: (paymentId) => `${API_BASE_URL}/payments/status/${paymentId}/`,
  
  // Donor Tiers
  DONOR_TIERS: `${API_BASE_URL}/donor-tiers/`,
  
  // Transactions
  TRANSACTIONS: `${API_BASE_URL}/transactions/`,
  
  // Recommendations
  RECOMMENDATIONS: `${API_BASE_URL}/recommendations/`,
  DONOR_RECOMMENDATIONS: `${API_BASE_URL}/recommendations/donor/`,
};

export default API_BASE_URL;
