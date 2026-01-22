import axios, { 
  AxiosError, 
  InternalAxiosRequestConfig, 
  AxiosResponse,
  AxiosRequestConfig 
} from 'axios';

import { APP_CONFIG } from '@/config/constants';
import { ApiError } from '@/types/domain';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Create axios instance with default config
export const api = axios.create({
  baseURL: APP_CONFIG.api.baseUrl,
  timeout: APP_CONFIG.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 [API] ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
        params: config.params,
      });
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ [API] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`❌ [API] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        stack: error.stack,
      });
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: number };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      try {
        const token = await refreshToken();
        localStorage.setItem('token', token);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem('token');
        window.location.href = APP_CONFIG.routes.login;
        return Promise.reject(err);
      }
    }

    // Retry failed requests
    if (shouldRetry(error)) {
      return retryRequest(error);
    }

    // Transform error to a consistent format
    const apiError: ApiError = {
      message: error.response?.data?.message ?? 'An unexpected error occurred',
      code: error.response?.data?.code ?? 'UNKNOWN_ERROR',
      status: error.response?.status ?? 500,
      details: error.response?.data?.details,
    };

    return Promise.reject(apiError);
  }
);

function shouldRetry(error: AxiosError): boolean {
  return !error.response || (error.response.status >= 500 && error.response.status <= 599);
}

async function retryRequest(error: AxiosError): Promise<AxiosResponse> {
  const config = error.config as InternalAxiosRequestConfig & { _retry?: number };
  
  if (!config) {
    return Promise.reject(error);
  }
  
  config._retry = (config._retry || 0) + 1;
  
  if (config._retry > MAX_RETRIES) {
    return Promise.reject(error);
  }
  
  // Exponential backoff
  const delay = RETRY_DELAY * Math.pow(2, config._retry - 1);
  
  await new Promise(resolve => setTimeout(resolve, delay));
  
  return api(config);
}

async function refreshToken(): Promise<string> {
  throw new Error('Token refresh not implemented');
}

// Helper functions for common HTTP methods
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