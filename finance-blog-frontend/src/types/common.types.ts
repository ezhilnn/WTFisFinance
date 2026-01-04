// API Response structure
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Pagination params
export interface PaginationParams {
  page: number;
  limit: number;
}

// Pagination response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Timestamp fields
export interface TimestampFields {
  createdAt: string;
  updatedAt: string;
}

// User role
export type UserRole = 'admin' | 'user';

// Loading state
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}