import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true,  // This is needed for CSRF cookie handling
  timeout: 10000
});

// Check for saved token and set in headers
const token = localStorage.getItem('auth_token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('Starting API Request:', request.url);
  return request;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('API Response Success:', response.config.url);
    return response;
  },
  error => {
    console.error('API Response Error:', error.config?.url, error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default api;
