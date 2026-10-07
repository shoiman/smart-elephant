/**
 * Game Service
 * API calls for game management (start, end, get status)
 */

import { httpClient } from './http-client';
import { ENDPOINTS } from './api-config';
import type {
  GameStartRequest,
  GameStartResponse,
  GameSessionResponse,
  GameEndResponse,
} from './api-types';

export class GameService {
  /**
   * Start a new game session for a child
   *
   * POST /games/start
   */
  static async startGame(request: GameStartRequest): Promise<GameStartResponse> {
    return httpClient.post<GameStartResponse>(ENDPOINTS.games.start, request);
  }

  /**
   * Get current game session status
   *
   * GET /games/{sessionId}
   */
  static async getGameSession(sessionId: number): Promise<GameSessionResponse> {
    return httpClient.get<GameSessionResponse>(ENDPOINTS.games.get(sessionId));
  }

  /**
   * End a game session
   *
   * POST /games/{sessionId}/end
   */
  static async endGame(sessionId: number): Promise<GameEndResponse> {
    return httpClient.post<GameEndResponse>(ENDPOINTS.games.end(sessionId));
  }
}

export default GameService;
