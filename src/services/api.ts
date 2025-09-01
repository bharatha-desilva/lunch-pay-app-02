import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { QueryParams, BaseEntity } from '../types/api.types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Helper method to extract data from response (handles both wrapped and plain responses)
  private extractData<T>(response: AxiosResponse): T {
    // If response has a data wrapper with success field, use that structure
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data;
    }
    // Otherwise, return the response data directly
    return response.data;
  }

  // Generic CRUD operations
  async getAll<T extends BaseEntity>(
    entityName: string,
    params?: QueryParams
  ): Promise<T[]> {
    try {
      const response = await this.api.get(`/${entityName}`, { params });
      const data = this.extractData<T[]>(response);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById<T extends BaseEntity>(
    entityName: string,
    id: string
  ): Promise<T> {
    try {
      const response = await this.api.get(`/${entityName}/${id}`);
      const data = this.extractData<T>(response);
      if (!data) {
        throw new Error('Resource not found');
      }
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async saveNew<T extends BaseEntity>(
    entityName: string,
    data: Partial<T>
  ): Promise<T> {
    try {
      const response = await this.api.post(`/${entityName}`, data);
      const responseData = this.extractData<T>(response);
      if (!responseData) {
        throw new Error('Failed to create resource');
      }
      return responseData;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update<T extends BaseEntity>(
    entityName: string,
    data: Partial<T> & { id: string }
  ): Promise<T> {
    try {
      const response = await this.api.put(`/${entityName}/${data.id}`, data);
      const responseData = this.extractData<T>(response);
      if (!responseData) {
        throw new Error('Failed to update resource');
      }
      return responseData;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(entityName: string, id: string): Promise<void> {
    try {
      await this.api.delete(`/${entityName}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Custom endpoints
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    try {
      const response = await this.api.post(endpoint, data);
      return this.extractData<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async get<T>(endpoint: string, params?: QueryParams): Promise<T> {
    try {
      const response = await this.api.get(endpoint, { params });
      return this.extractData<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const response = error.response?.data;
      
      // Handle different error response formats
      if (response) {
        // If response has error field (wrapped format)
        if (response.error && response.error.message) {
          return new Error(response.error.message);
        }
        // If response has message field (plain format)
        if (response.message) {
          return new Error(response.message);
        }
        // If response is a plain string
        if (typeof response === 'string') {
          return new Error(response);
        }
      }
      
      // Fallback to axios error message
      return new Error(error.message || 'Network error');
    }
    return new Error('An unexpected error occurred');
  }
}

// Create a singleton instance
const apiService = new ApiService();

// Generic entity API factory
function createEntityApi<T extends BaseEntity>(entityName: string) {
  return {
    getAll: (params?: QueryParams) => apiService.getAll<T>(entityName, params),
    getById: (id: string) => apiService.getById<T>(entityName, id),
    saveNew: (data: Partial<T>) => apiService.saveNew<T>(entityName, data),
    update: (data: Partial<T> & { id: string }) =>
      apiService.update<T>(entityName, data),
    delete: (id: string) => apiService.delete(entityName, id),
  };
}

export { apiService, createEntityApi };
export default apiService;
