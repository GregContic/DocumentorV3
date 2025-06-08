import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
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
  createRequest: (requestData) => api.post('/documents/request', requestData),
  getMyRequests: () => api.get('/documents/my-requests'),
  getRequestById: (id) => api.get(`/documents/request/${id}`),
  // Admin specific endpoints
  getAllRequests: () => api.get('/admin/documents/requests'),
  updateRequestStatus: (requestId, status) => 
    api.patch(`/admin/documents/request/${requestId}/status`, { status }),
  getRequestStats: () => api.get('/admin/documents/stats'),
};

// Inquiry services
export const inquiryService = {
  // Student endpoints
  createInquiry: (inquiryData) => api.post('/inquiries', inquiryData),
  getMyInquiries: () => api.get('/inquiries/my-inquiries'),
  getInquiryById: (id) => api.get(`/inquiries/${id}`),
  
  // Admin endpoints
  getAllInquiries: () => api.get('/admin/inquiries'),
  updateInquiryStatus: (inquiryId, status) => 
    api.patch(`/admin/inquiries/${inquiryId}/status`, { status }),
  replyToInquiry: (inquiryId, message) => 
    api.post(`/admin/inquiries/${inquiryId}/reply`, { message }),
  deleteInquiry: (inquiryId) => api.delete(`/admin/inquiries/${inquiryId}`),
  getInquiryStats: () => api.get('/admin/inquiries/stats'),
};

export default api; 