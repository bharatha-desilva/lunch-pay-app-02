export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: unknown;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}
