import axios from 'axios';

const apiRequest = axios.create({
  baseURL: 'http://localhost:8800/api',
  withCredentials: true,  // ✅ This ensures cookies are sent and received
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
apiRequest.interceptors.request.use(
  (config) => {
    // Log the request data
    console.log('Request being sent:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiRequest.interceptors.response.use(
  (response) => {
    // Log the response data
    console.log('Response received:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiRequest;
