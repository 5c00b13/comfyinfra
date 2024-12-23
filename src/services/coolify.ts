export class CoolifyService {
  private token: string;
  private baseUrl: string;

  constructor() {
    this.token = import.meta.env.VITE_COOLIFY_API_TOKEN;
    if (!this.token) {
      throw new Error('VITE_COOLIFY_API_TOKEN is not configured');
    }
    
    // The base URL should point to the Coolify API
    this.baseUrl = import.meta.env.VITE_COOLIFY_URL || 'http://localhost:8000/api/v1';
  }

  async deployService(nodeId: string, serviceConfig: any) {
    try {
      console.log('Deploying service:', { nodeId, config: serviceConfig });

      // Ensure the URL has the correct format with /api
      const baseUrl = this.baseUrl.replace(/\/+$/, ''); // Remove trailing slashes
      const apiUrl = `${baseUrl}/api`;
      
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