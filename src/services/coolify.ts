interface Project {
  uuid: string;
  name: string;
  description?: string;
}

interface Server {
  uuid: string;
  name: string;
}

export class CoolifyService {
  private token: string;
  private baseUrl: string;

  constructor() {
    this.token = import.meta.env.VITE_COOLIFY_API_TOKEN;
    if (!this.token) {
      throw new Error('VITE_COOLIFY_API_TOKEN is not configured');
    }
    
    this.baseUrl = import.meta.env.VITE_COOLIFY_URL || 'http://localhost:8000';
  }

  async listProjects(): Promise<Project[]> {
    try {
      const baseUrl = this.baseUrl.replace(/\/+$/, '');
      const response = await fetch(`${baseUrl}/api/v1/projects`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async listServers(): Promise<Server[]> {
    try {
      const baseUrl = this.baseUrl.replace(/\/+$/, '');
      const response = await fetch(`${baseUrl}/api/v1/servers`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch servers: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching servers:', error);
      throw error;
    }
  }

  async deployService(nodeId: string, serviceConfig: any) {
    try {
      console.log('Deploying service:', { nodeId, config: serviceConfig });

      // Ensure the URL has the correct format with /api/v1
      const baseUrl = this.baseUrl.replace(/\/+$/, ''); // Remove trailing slashes
      const apiUrl = `${baseUrl}/api/v1`;
      
      // Log the request details
      console.log('Request details:', {
        url: `${apiUrl}/services`,
        token: this.token ? 'Present' : 'Missing',
        serviceConfig
      });

      const response = await fetch(`${apiUrl}/services`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          type: serviceConfig.type,
          name: serviceConfig.name || `${serviceConfig.type}-${nodeId}`,
          description: serviceConfig.description,
          project_uuid: serviceConfig.project_uuid,
          environment_name: serviceConfig.environment_name,
          server_uuid: serviceConfig.server_uuid,
          destination_uuid: serviceConfig.destination_uuid,
          instant_deploy: true
        }),
      });

      // Log response details
      console.log('Response details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        console.error('Response headers:', Object.fromEntries(response.headers.entries()));
        throw new Error(`Deployment failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Deployment successful:', data);
      return data;
    } catch (error) {
      console.error('Deployment error:', error);
      throw error;
    }
  }
} 