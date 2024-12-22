import PocketBase from 'pocketbase';
import { CONFIG } from '../config';
import { retry } from '../utils/retry';
import type { Template } from '../types/template';

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
      const records = await pb.collection('templates').getFullList<Template>({
        sort: 'name',
        timeout: CONFIG.API_TIMEOUT,
        signal,
      });
      
      return records || [];
    } catch (error: any) {
      if (signal?.aborted) {
        return [];
      }
      
      const errorDetails = {
        message: error.message || 'Unknown error',
        status: error.status || 0,
        data: error.data || {},
        url: error.url || ''
      };
      
      console.error('Template fetch error details:', errorDetails);
      
      // Only retry on network errors or server errors (500+)
      if (error.status >= 500 || !error.status) {
        throw error;
      }
      
      return [];
    }
  }, CONFIG.RETRY_ATTEMPTS, CONFIG.RETRY_DELAY);
}