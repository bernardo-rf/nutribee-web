import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios';

import { APP_CONFIG } from '@/config/constants';
import { ApiError } from '@/types/api';
import { logger } from '@/utils/logger';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const api = axios.create({
  baseURL: APP_CONFIG.api.baseUrl,
  timeout: APP_CONFIG.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    logger.apiRequest(config.method?.toUpperCase() || 'UNKNOWN', config.url || '', {
      headers: config.headers,
      data: config.data,
      params: config.params,
    });
    return config;
  },
  (error: AxiosError) => {
    logger.error('Request error:', error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.apiResponse(
      response.config.method?.toUpperCase() || 'UNKNOWN',
      response.config.url || '',
      response.status,
      response.data,
    );
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    logger.apiError(
      error.config?.method?.toUpperCase() || 'UNKNOWN',
      error.config?.url || '',
      error.response?.status,
      {
        data: error.response?.data,
        message: error.message,
        stack: error.stack,
      },
    );

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: number };

    if (error.response?.status === 401 && !originalRequest._retry) {
      const isTokenRefreshEnabled = import.meta.env.VITE_ENABLE_TOKEN_REFRESH === 'true';

      if (isTokenRefreshEnabled) {
        try {
          const token = await refreshToken();
          localStorage.setItem('token', token);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        } catch (err) {
          localStorage.removeItem('token');
          globalThis.location.href = APP_CONFIG.routes.login;
          throw err;
        }
      } else {
        localStorage.removeItem('token');
        globalThis.location.href = APP_CONFIG.routes.login;
        throw error;
      }
    }

    if (shouldRetry(error)) {
      return retryRequest(error);
    }

    const apiError: ApiError = {
      message: error.response?.data?.message ?? 'An unexpected error occurred',
      code: error.response?.data?.code ?? 'UNKNOWN_ERROR',
      status: error.response?.status ?? 500,
      details: error.response?.data?.details,
    };

    throw apiError;
  },
);

function shouldRetry(error: AxiosError): boolean {
  return !error.response || (error.response.status >= 500 && error.response.status <= 599);
}

async function retryRequest(error: AxiosError): Promise<AxiosResponse> {
  const config = error.config as InternalAxiosRequestConfig & { _retry?: number };

  if (!config) {
    throw error;
  }

  config._retry = (config._retry || 0) + 1;

  if (config._retry > MAX_RETRIES) {
    throw error;
  }

  const delay = RETRY_DELAY * Math.pow(2, config._retry - 1);

  await new Promise((resolve) => setTimeout(resolve, delay));

  return api(config);
}

async function refreshToken(): Promise<string> {
  // TODO: Implement token refresh logic when backend supports it
  throw new Error('Token refresh not implemented. Please implement authentication refresh logic.');
}

export const get = <T>(url: string, config?: AxiosRequestConfig) =>
  api.get<T, AxiosResponse<T>>(url, config);

export const post = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  api.post<T, AxiosResponse<T>>(url, data, config);

export const put = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  api.put<T, AxiosResponse<T>>(url, data, config);

export const patch = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  api.patch<T, AxiosResponse<T>>(url, data, config);

export const del = <T>(url: string, config?: AxiosRequestConfig) =>
  api.delete<T, AxiosResponse<T>>(url, config);
