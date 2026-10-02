import axios from 'axios';

/**
 * Base Axios instance prepared for future backend integration.
 * In this setup stage, the frontend operates independently using mock data.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
