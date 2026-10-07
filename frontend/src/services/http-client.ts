/**
 * HTTP Client
 * Base class for making API requests with error handling, retries, and caching
 */

import { API_CONFIG, DEFAULT_HEADERS } from './api-config';

// Local error response interface
interface ApiErrorResponse {
  error?: string;
  message?: string;
  status?: number;
}

export class HttpClientError extends Error {
  status: number;
  response: any;

  constructor(status: number, response: any, message: string) {
    super(message);
    this.status = status;
    this.response = response;
    this.name = 'HttpClientError';
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

/**
 * Simple in-memory cache with TTL support
 */
class SimpleCache {
  private cache: Map<string, { data: any; expires: number }> = new Map();

  set(key: string, data: any, ttlMs: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttlMs,
    });
  }

  get(key: string): any {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }
}

/**
 * HTTP Client with retry logic, caching, and error handling
 */
export class HttpClient {
  private cache: SimpleCache;
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_CONFIG.BASE_URL;
    this.cache = new SimpleCache();
  }

  /**
   * Make HTTP request with retry and caching
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      body,
      headers = {},
      timeout = 10000,
      retries = API_CONFIG.RETRY.maxAttempts,
      cache = true,
    } = options;

    const url = this.buildUrl(endpoint);
    const cacheKey = `${method}:${url}`;

    // Check cache for GET requests
    if (method === 'GET' && cache && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Retry logic with exponential backoff
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const data = await this.fetch<T>(url, {
          method,
          body,
          headers,
          timeout,
        });

        // Cache successful GET responses
        if (method === 'GET' && cache) {
          const ttl = this.getCacheTtl(endpoint);
          this.cache.set(cacheKey, data, ttl);
        }

        return data;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx)
        if (error instanceof HttpClientError && error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Wait before retry with exponential backoff
        if (attempt < retries) {
          const delay = Math.pow(
            API_CONFIG.RETRY.backoffMultiplier,
            attempt - 1
          ) * API_CONFIG.RETRY.delayMs;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Build full URL from endpoint
   */
  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    return `${this.baseUrl}${endpoint}`;
  }

  /**
   * Perform actual fetch with timeout
   */
  private async fetch<T>(
    url: string,
    options: {
      method: string;
      body?: any;
      headers: Record<string, string>;
      timeout: number;
    }
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout);

    try {
      const response = await fetch(url, {
        method: options.method,
        headers: {
          ...DEFAULT_HEADERS,
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: ApiErrorResponse = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }

        throw new HttpClientError(
          response.status,
          errorData,
          `HTTP ${response.status}: ${errorData.message || response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof HttpClientError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Failed to connect to server');
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${options.timeout}ms`);
      }

      throw error;
    }
  }

  /**
   * Determine cache TTL based on endpoint
   */
  private getCacheTtl(endpoint: string): number {
    if (endpoint.includes('/animals')) return 7 * 24 * 60 * 60 * 1000; // 7 days
    if (endpoint.includes('/progress')) return 60 * 60 * 1000; // 1 hour
    if (endpoint.includes('/questions')) return 24 * 60 * 60 * 1000; // 1 day
    return 60 * 1000; // 1 minute default
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
  }
}

/**
 * Singleton HTTP client instance
 */
export const httpClient = new HttpClient();

export default httpClient;
