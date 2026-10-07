/**
 * API Configuration
 * Centralized configuration for backend API communication
 */

export const API_CONFIG = {
  // API Base URL - adjust based on environment
  BASE_URL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080/api',

  // Default request timeout (ms)
  TIMEOUT: 30000,

  // Retry configuration
  RETRY: {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2,
  },

  // Cache configuration
  CACHE: {
    enabled: true,
    ttl: {
      animals: 7 * 24 * 60 * 60 * 1000, // 7 days
      progress: 60 * 60 * 1000, // 1 hour
      questions: 24 * 60 * 60 * 1000, // 1 day
    },
  },
};

/**
 * HTTP Headers
 */
export const DEFAULT_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * API Endpoints
 */
export const ENDPOINTS = {
  // Game Management
  games: {
    start: '/games/start',
    get: (sessionId: number) => `/games/${sessionId}`,
    end: (sessionId: number) => `/games/${sessionId}/end`,
  },

  // Questions
  questions: {
    next: '/questions/next',
    answer: '/games/answer',
  },

  // Progress
  progress: {
    get: (childId: number) => `/progress/${childId}`,
    analyze: '/progress/analyze',
  },

  // Animals
  animals: {
    list: '/animals',
    get: (id: number) => `/animals/${id}`,
  },
} as const;
