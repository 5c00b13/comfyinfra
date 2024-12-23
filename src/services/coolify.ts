export class CoolifyService {
  private baseUrl: string;
  private email: string;
  private password: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env.DEV ? '/api/coolify' : import.meta.env.VITE_COOLIFY_URL;
    this.email = import.meta.env.VITE_COOLIFY_EMAIL;
    this.password = import.meta.env.VITE_COOLIFY_PASSWORD;
    
    console.log('CoolifyService initialized with baseUrl:', this.baseUrl);
  }

  private async authenticate() {
    try {
      console.log('Attempting authentication...');
      
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

      console.log('Auth response status:', response.status);
      console.log('Auth response headers:', Object.fromEntries(response.headers));

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Authentication failed: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      if (!data.token) {
        throw new Error('No token received in authentication response');
      }

      this.token = data.token;
      console.log('Authentication successful');
    } catch (error: unknown) {
      console.error('Coolify authentication error:', error);
      if (error instanceof Error) {
        throw new Error(`Authentication failed: ${error.message}`);
      }
      throw new Error('Authentication failed: Unknown error');
    }
  }

  async deployService(nodeId: string, serviceConfig: any) {
    try {
      if (!this.token) {
        console.log('No token found, authenticating first...');
        await this.authenticate();
      }

      console.log('Deploying service:', { nodeId, ...serviceConfig });

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

      console.log('Deploy response status:', response.status);
      
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Deployment failed: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('Deployment successful:', data);
      return data;
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