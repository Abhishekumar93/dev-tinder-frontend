import axios, { type AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true,
});

let isHandlingUnauthorized = false;

apiClient.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isUnauthorizedError(error) && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true;
    }

    return Promise.reject(error);
  }
);

const isUnauthorizedError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error) && error.response?.status === 401;
};

export { apiClient };
