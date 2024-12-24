import PocketBase from 'pocketbase';
import { retry } from '../utils/retry';
import type { Template } from '../types/template';

const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL;
if (!POCKETBASE_URL) {
  throw new Error('VITE_POCKETBASE_URL is not configured in environment variables');
}

const pb = new PocketBase(POCKETBASE_URL);

export async function fetchTemplates(signal?: AbortSignal): Promise<Template[]> {
  try {
    const records = await retry(
      () => pb.collection('templates').getFullList({
        sort: 'name',
        requestKey: null
      }),
      {
        retries: 3,
        signal
      }
    );
    return records as Template[];
  } catch (error) {
    console.error('Template fetch error:', error);
    throw error;
  }
}