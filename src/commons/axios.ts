import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';

import { AuthService } from '../data/auth/service';

const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    Accept: 'application/json'
  }
});

const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  const { exp } = jwtDecode(token);
  if (!exp) return false;

  const currentTime = Date.now() / 1000;

  return exp < currentTime;
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(process.env.AUTH_KEY as string);
    if (!token) {
      window.location.href = '/auth/sign-in';
      throw new Error('Unauthorized');
    }

    config.headers['x-auth-token'] = token;

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: any) => response,
  async (err: any) => {
    const originalRequest = err.config;

    const error: AxiosError = err;
    const { response } = error;

    if (!response) return Promise.reject(error);
    if (response.status === 401) {
      const token = localStorage.getItem(process.env.AUTH_KEY as string) || '';

      if (isTokenExpired(token)) {
        const { status, data } = await AuthService.refreshToken();
        if (!status) return Promise.reject(error);

        localStorage.setItem(process.env.AUTH_KEY as string, data?.token || '');

        return axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
