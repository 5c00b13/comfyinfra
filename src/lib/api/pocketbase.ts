import PocketBase from 'pocketbase';
import { retry } from '../utils/retry';
import type { Template } from '../types/template';

const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL;
if (!POCKETBASE_URL) {
  throw new Error('VITE_POCKETBASE_URL is not configured in environment variables');
}

const pb = new PocketBase(POCKETBASE_URL);

interface PocketBaseTemplate {
  id: string;
  name: string;
  icon: string;
  type: string;
  created: string;
  updated: string;
}

export async function fetchTemplates(signal?: AbortSignal): Promise<Template[]> {
  try {
    const records = await retry<PocketBaseTemplate[]>(
      () => pb.collection('templates').getFullList<PocketBaseTemplate>({
        sort: 'name',
        requestKey: null
      }),
      {
        retries: 3,
        signal
      }
    );

    return records.map(record => ({
      id: record.id,
      name: record.name,
      icon: record.icon ? pb.files.getUrl(record, record.icon) : '',
      type: record.type
    }));
  } catch (error) {
    console.error('Template fetch error:', error);
    throw error;
  }
}