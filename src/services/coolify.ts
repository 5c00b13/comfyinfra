
export class CoolifyService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_COOLIFY_URL;
  }

  async testConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to connect to Coolify');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Coolify connection error:', error);
      throw error;
    }
  }
} 