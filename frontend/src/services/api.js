import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Ensure API_URL doesn't end with a slash
const normalizedURL = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

const api = axios.create({
  baseURL: normalizedURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
  },
};

// Document request services
export const documentService = {
  createRequest: (requestData) => api.post('/api/documents/request', requestData),
  getMyRequests: () => api.get('/api/documents/my-requests'),
  getRequestById: (id) => api.get(`/api/documents/request/${id}`),
  // Admin specific endpoints
  getAllRequests: () => api.get('/api/documents/admin/documents/requests'),
  updateRequestStatus: (requestId, status) => 
    api.patch(`/api/documents/admin/documents/request/${requestId}/status`, { status }),
  getRequestStats: () => api.get('/api/documents/admin/documents/stats'),
};

// Inquiry services
export const inquiryService = {
  // Student endpoints
  createInquiry: (inquiryData) => api.post('/api/inquiries', inquiryData),
  getMyInquiries: () => api.get('/api/inquiries/my-inquiries'),
  getInquiryById: (id) => api.get(`/api/inquiries/${id}`),
  
  // Admin endpoints
  getAllInquiries: () => api.get('/api/inquiries/admin/inquiries'),
  updateInquiryStatus: (inquiryId, status) => 
    api.patch(`/api/inquiries/admin/inquiries/${inquiryId}/status`, { status }),
  replyToInquiry: (inquiryId, message) => 
    api.post(`/api/inquiries/admin/inquiries/${inquiryId}/reply`, { message }),
  deleteInquiry: (inquiryId) => api.delete(`/api/inquiries/admin/inquiries/${inquiryId}`),
  getInquiryStats: () => api.get('/api/inquiries/admin/stats'),
  // Inquiry archive methods
  getArchivedInquiries: () => 
    api.get('/api/inquiries/admin/archived-inquiries'),
  archiveInquiry: (inquiryId) =>
    api.patch(`/api/inquiries/admin/inquiries/${inquiryId}/archive`),
};

export default api;