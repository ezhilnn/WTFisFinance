import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config/constants';
import { auth } from '../config/firebase';

/**
 * Axios instance with interceptors
 * Automatically adds Firebase auth token to requests
 */

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get current Firebase user
      const currentUser = auth.currentUser;

      if (currentUser) {
        // Get fresh ID token
        const token = await currentUser.getIdToken();

        // Add token to headers
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Return response data directly
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error
      const status = error.response.status;

      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          console.error('Unauthorized: Please log in again');
          // TODO: Dispatch logout action or redirect to login
          break;

        case 403:
          // Forbidden - insufficient permissions
          console.error('Forbidden: Insufficient permissions');
          break;

        case 404:
          // Not found
          console.error('Resource not found');
          break;

        case 500:
          // Server error
          console.error('Server error: Please try again later');
          break;

        default:
          console.error('API Error:', error.response.data);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network error: Please check your connection');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;