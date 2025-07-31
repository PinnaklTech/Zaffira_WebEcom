// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api';
// // const API_BASE_URL = 'http://192.168.0.3:5000/api';



// // Create axios instance with base configuration
// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('auth_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
    
//     // Handle unauthorized requests
//     if (error.response?.status === 401) {
//       localStorage.removeItem('auth_token');
//       // Don't redirect here to avoid infinite loops
//       // Let the component handle the redirect
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default api;



import axios from 'axios';

// Dynamically detect environment
let API_BASE_URL: string;

if (window.location.hostname === 'localhost') {
  API_BASE_URL = 'http://localhost:5000/api';
} else {
  API_BASE_URL = 'http://192.168.0.10:5000/api'; // Replace with your machine's LAN IP
}

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);

export default api;
