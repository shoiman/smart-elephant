/**
 * Stars Service
 * The child's "My stars" screen: today's stars and the album
 */

import { ENDPOINTS } from './api-config';
import { httpClient } from './http-client';
import type { StarsResponse } from './api-types';

/** The device's IANA time zone ("Asia/Jerusalem"); "today" starts at midnight there. */
function deviceTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export class StarsService {
  /**
   * GET /children/{childId}/stars?tz=...
   */
  static async getStars(childId: number): Promise<StarsResponse> {
    const tz = encodeURIComponent(deviceTimeZone());
    return httpClient.get<StarsResponse>(`${ENDPOINTS.children.stars(childId)}?tz=${tz}`, { cache: false });
  }
}
