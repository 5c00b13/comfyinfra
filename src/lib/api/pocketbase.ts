import PocketBase from 'pocketbase';
import { CONFIG } from '../config';
import { retry } from '../utils/retry';
import type { Template } from '../types/template';
import type { ServiceType } from '../../types';
import type { TemplatesResponse } from '../../types/pocketbase-types';

// Singleton PocketBase client
class PocketBaseClient {
  private static instance: PocketBase | null = null;
  
  static getInstance(): PocketBase {
    if (!this.instance) {
      const url = CONFIG.POCKETBASE_URL;
      if (!url) {
        throw new Error('POCKETBASE_URL is not configured');
      }
      this.instance = new PocketBase(url);
    }
    return this.instance;
  }
}

export async function fetchTemplates(signal?: AbortSignal): Promise<Template[]> {
  if (signal?.aborted) {
    return [];
  }

  return retry(async () => {
    try {
      const pb = PocketBaseClient.getInstance();
      const records = await pb.collection('templates').getFullList<TemplatesResponse>({
        sort: 'name',
        timeout: CONFIG.API_TIMEOUT,
        signal,
      });
      
      // Map PocketBase records to our Template interface
      return records.map(record => ({
        id: record.id,
        name: record.name || '',
        icon: record.icon || '',
        type: record.name?.toLowerCase().replace(/\s+/g, '-') as ServiceType // Convert name to type format
      }));
    } catch (error: any) {
      if (signal?.aborted) {
        return [];
      }
      
      console.error('Template fetch error:', error);
      return [];
    }
  }, CONFIG.RETRY_ATTEMPTS, CONFIG.RETRY_DELAY);
}