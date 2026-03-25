import { BACKEND_URL } from '@/lib/constants';
import axios from 'axios';

const http = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  timeout: 300000, // 5 minutes — large archive uploads can be slow
});

http.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  },
);

export default http;
