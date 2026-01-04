// Common response structure for all APIs
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Timestamp fields for all documents
export interface TimestampFields {
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

// User info for comments (no auth required)
export interface PublicUserInfo {
  name: string;
  email: string; // Not displayed publicly, only stored
}