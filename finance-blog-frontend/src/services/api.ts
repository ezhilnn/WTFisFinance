import axiosInstance from './axios.config';
import type { ApiResponse } from '../types/common.types';

/**
 * Generic API service
 * Provides type-safe API calls with error handling
 */

// Generic GET request
export const get = async <T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<T>>(endpoint, { params });
    return response.data;
  } catch (error: any) {
    // Return error in ApiResponse format
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Request failed',
      error: error.response?.data?.error || error.message,
    };
  }
};

// Generic POST request
export const post = async <T>(
  endpoint: string,
  data?: any
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<T>>(endpoint, data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Request failed',
      error: error.response?.data?.error || error.message,
    };
  }
};

// Generic PUT request
export const put = async <T>(
  endpoint: string,
  data?: any
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance.put<ApiResponse<T>>(endpoint, data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Request failed',
      error: error.response?.data?.error || error.message,
    };
  }
};

// Generic DELETE request
export const del = async <T>(
  endpoint: string
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<T>>(endpoint);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Request failed',
      error: error.response?.data?.error || error.message,
    };
  }
};

// Export all methods
export const api = {
  get,
  post,
  put,
  delete: del,
};