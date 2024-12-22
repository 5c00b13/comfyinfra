export class CoolifyService {
  private baseUrl: string;
  private email: string;
  private password: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_COOLIFY_URL;
    this.email = import.meta.env.VITE_COOLIFY_EMAIL;
    this.password = import.meta.env.VITE_COOLIFY_PASSWORD;
  }

  private async authenticate() {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      this.token = data.token;
    } catch (error) {
      console.error('Coolify authentication error:', error);
      throw error;
    }
  }

  async deployService(nodeId: string, serviceConfig: any) {
    if (!this.token) {
      await this.authenticate();
    }

    try {
      const response = await fetch(`${this.baseUrl}/services/deploy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId,
          ...serviceConfig,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to deploy service');
      }

      return await response.json();
    } catch (error) {
      console.error('Service deployment error:', error);
      throw error;
    }
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

  async deleteNode(nodeId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/nodes/${nodeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete node');
      }
      
      return true;
    } catch (error) {
      console.error('Node deletion error:', error);
      throw error;
    }
  }
} 