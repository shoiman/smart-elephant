/**
 * Progress Service
 * The parent's progress screen
 */

import { ENDPOINTS } from './api-config';
import { httpClient } from './http-client';
import type { ProgressPeriod, ProgressResponse } from './api-types';

export class ProgressService {
  /**
   * GET /progress/{childId}?period=week|month|all&tz=...
   * tz = the device's zone, so "today" and the days of the week are the family's own
   */
  static async getProgress(childId: number, period: ProgressPeriod): Promise<ProgressResponse> {
    const tz = encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone);
    return httpClient.get<ProgressResponse>(`${ENDPOINTS.progress.get(childId)}?period=${period}&tz=${tz}`, {
      cache: false,
    });
  }
}

export default ProgressService;
