/**
 * Host Line Service
 * Azure audio for the host's lines on the toddler level ("Правильно! Корова!", "תגידו שוב: חגב!").
 * Browsers often have no voice for them (Chrome has no Hebrew voice at all).
 */

import { ENDPOINTS } from './api-config';
import { httpClient } from './http-client';

interface HostLinesResponse {
  /** Line text exactly as the host says it -> audio URL */
  lines: Record<string, string>;
}

/** Audio URLs for every host line with these card words; empty map on any error (browser voice is used then). */
export async function fetchHostLineAudio(language: string, words: readonly string[]): Promise<Record<string, string>> {
  try {
    const response = await httpClient.post<HostLinesResponse>(
      ENDPOINTS.audio.hostLines,
      { language, words },
      { timeout: 4000, retries: 0 },
    );
    return response.lines ?? {};
  } catch (error) {
    console.warn('[audio] host lines are not available:', error);
    return {};
  }
}
