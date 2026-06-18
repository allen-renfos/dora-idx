import axios, { AxiosInstance } from 'axios';
import { getApiBaseUrl } from '@/helpers/apiBaseUrl';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
});

// Request interceptor to add headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== 'undefined'
        ? window.sessionStorage.getItem('access_token')
        : null;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network Error: Please check your internet connection.'));
    }

    const status = error.response.status;
    const message = (error.response.data as any)?.message || 'Unknown error';

    switch (status) {
      case 400:
        console.error('Bad Request:', message);
        break;
      case 401:
        console.error('Unauthorized:', message);
        // window.location.href='/login'; // Redirect to login page
        // sessionStorage.removeItem('token'); // Clear token
        break;
      case 403:
        console.error('Forbidden:', message);
        break;
      case 404:
        console.error('Not Found:', message);
        break;
      case 500:
        console.error('Internal Server Error:', message);
        break;
      default:
        console.error('Error:', message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
