export class CoolifyService {
  private baseUrl: string;
  private email: string;
  private password: string;
  private token: string | null = null;

  constructor() {
    const coolifyUrl = import.meta.env.VITE_COOLIFY_URL;
    if (!coolifyUrl) {
      console.error('VITE_COOLIFY_URL is not set');
    }
    
    this.baseUrl = import.meta.env.DEV ? '/api/coolify' : coolifyUrl;
    this.email = import.meta.env.VITE_COOLIFY_EMAIL;
    this.password = import.meta.env.VITE_COOLIFY_PASSWORD;
    
    console.log('CoolifyService initialized with baseUrl:', this.baseUrl);
  }

  private async handleResponse(response: Response, errorContext: string) {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      // Handle non-200 responses
      try {
        if (contentType?.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(`${errorContext}: ${errorData.message || response.statusText}`);
        } else {
          const text = await response.text();
          console.error('Non-JSON error response:', text);
          throw new Error(`${errorContext}: ${response.statusText}`);
        }
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error(`${errorContext}: Unknown error`);
      }
    }

    // Handle successful responses
    try {
      if (contentType?.includes('application/json')) {
        return await response.json();
      }
      const text = await response.text();
      console.error('Unexpected non-JSON response:', text);
      throw new Error('Server returned non-JSON response');
    } catch (error) {
      console.error('Response parsing error:', error);
      throw new Error(`Failed to parse response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async authenticate() {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        console.log('Attempting authentication...', { attempt: retryCount + 1 });
        
        const proxyUrl = import.meta.env.VITE_API_PROXY_URL || '/api/coolify';
        const response = await fetch(`${proxyUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Target-URL': this.baseUrl.replace(/\/+$/, ''),
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.token) {
          throw new Error('No token received in authentication response');
        }

        this.token = data.token;
        console.log('Authentication successful');
        return data;
      } catch (error) {
        retryCount++;
        console.error('Authentication attempt failed:', error);
        
        if (retryCount === maxRetries) {
          console.error('Authentication failed after max retries:', error);
          throw error;
        }
        
        console.warn(`Authentication attempt ${retryCount} failed, retrying in ${retryCount}s...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
  }

  async deployService(nodeId: string, serviceConfig: any) {
    try {
      if (!this.token) {
        await this.authenticate();
      }

      console.log('Deploying service:', { nodeId, config: serviceConfig });

      const proxyUrl = import.meta.env.VITE_API_PROXY_URL || '/api/coolify';
      const response = await fetch(`${proxyUrl}/services/deploy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Target-URL': this.baseUrl.replace(/\/+$/, ''),
        },
        body: JSON.stringify({
          nodeId,
          ...serviceConfig,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Deployment successful:', data);
      return data;
    } catch (error) {
      console.error('Deployment error:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      await this.handleResponse(response, 'Connection test failed');
      return true;
    } catch (error) {
      console.error('Connection test error:', error);
      return false;
    }
  }
} 