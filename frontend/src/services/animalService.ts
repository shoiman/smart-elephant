/**
 * Animal Service
 * API calls for animal data and facts
 */

import { httpClient } from './http-client';
import { ENDPOINTS } from './api-config';
import type { Animal, AnimalListResponse } from './api-types';

export class AnimalService {
  /**
   * Get all animals
   *
   * GET /animals
   */
  static async getAllAnimals(page: number = 1, limit: number = 50): Promise<AnimalListResponse> {
    const endpoint = `${ENDPOINTS.animals.list}?page=${page}&limit=${limit}`;
    return httpClient.get<AnimalListResponse>(endpoint);
  }

  /**
   * Get single animal by ID
   *
   * GET /animals/{id}
   */
  static async getAnimal(id: number): Promise<Animal> {
    return httpClient.get<Animal>(ENDPOINTS.animals.get(id));
  }

  /**
   * Get multiple animals by IDs
   */
  static async getAnimals(ids: number[]): Promise<Animal[]> {
    const requests = ids.map((id) => this.getAnimal(id));
    return Promise.all(requests);
  }
}

export default AnimalService;
