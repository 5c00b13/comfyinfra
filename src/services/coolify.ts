export class CoolifyService {
  private baseUrl: string;
  private email: string;
  private password: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = '/api/coolify';
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
        const errorText = await response.text();
        throw new Error(`Authentication failed: ${errorText}`);
      }

      const data = await response.json();
      this.token = data.token;
    } catch (error: unknown) {
      console.error('Coolify authentication error:', error);
      if (error instanceof Error) {
        throw new Error(`Authentication failed: ${error.message}`);
      }
      throw new Error('Authentication failed: Unknown error');
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
        const errorText = await response.text();
        throw new Error(`Deployment failed: ${errorText}`);
      }

      return await response.json();
    } catch (error: unknown) {
      console.error('Service deployment error:', error);
      if (error instanceof Error) {
        throw new Error(`Deployment failed: ${error.message}`);
      }
      throw new Error('Deployment failed: Unknown error');
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
        const errorText = await response.text();
        throw new Error(`Connection test failed: ${errorText}`);
      }
      
      return await response.json();
    } catch (error: unknown) {
      console.error('Coolify connection error:', error);
      if (error instanceof Error) {
        throw new Error(`Connection test failed: ${error.message}`);
      }
      throw new Error('Connection test failed: Unknown error');
    }
  }

  async deleteNode(nodeId: string) {
    if (!this.token) {
      await this.authenticate();
    }

    try {
      const response = await fetch(`${this.baseUrl}/nodes/${nodeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete node: ${errorText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Node deletion error:', error);
      throw error;
    }
  }
} 