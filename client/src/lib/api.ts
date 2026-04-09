import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_ENDPOINTS, ERROR_MESSAGES } from './constants';
import type { ApiResponse, LoginRequest, LoginResponse, SignupRequest } from '@/types';

class ApiService {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.VITE_FRONTEND_FORGE_API_URL || '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.token = null;
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string | null) {
    this.token = token;
  }

  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await this.client.post<LoginResponse>(
        API_ENDPOINTS.auth.login,
        data
      );
      this.setToken(response.data.token);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error),
      };
    }
  }

  async signup(data: SignupRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await this.client.post<LoginResponse>(
        API_ENDPOINTS.auth.signup,
        data
      );
      this.setToken(response.data.token);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error),
      };
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      await this.client.post(API_ENDPOINTS.auth.logout);
      this.setToken(null);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error),
      };
    }
  }

  async getProfile(): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get(API_ENDPOINTS.users.profile);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error),
      };
    }
  }

  async trackEvent(eventName: string, properties: Record<string, any>): Promise<void> {
    try {
      await this.client.post(API_ENDPOINTS.analytics.track, {
        name: eventName,
        properties,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  private getErrorMessage(error: any): string {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message || ERROR_MESSAGES.generic;
    }
    return ERROR_MESSAGES.generic;
  }
}

export const apiService = new ApiService();
