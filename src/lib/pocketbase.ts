import PocketBase from 'pocketbase';

const DEFAULT_URL = 'http://pocketbase-x0ok4kwc80k80gkk8g48cco0.74.208.197.138.sslip.io';

// Create PocketBase instance with fallback and error handling
const createPocketBaseClient = () => {
  const url = import.meta.env.VITE_POCKETBASE_URL || DEFAULT_URL;
  return new PocketBase(url);
};

export const pb = createPocketBaseClient();

export interface Template {
  id: string;
  name: string;
  icon: string;
  type: string;
}

export async function fetchTemplates(): Promise<Template[]> {
  try {
    const records = await pb.collection('templates').getFullList<Template>({
      sort: 'name',
      timeout: 10000
    });
    
    // Return empty array if no templates found
    if (!records?.length) {
      console.warn('No templates found in the database');
      return [];
    }
    
    return records;
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
}