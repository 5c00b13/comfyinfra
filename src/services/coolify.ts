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

      const proxyUrl = import.meta.env.VITE_API_PROXY_URL || '/api/coolify';
      
      // Log the request details
      console.log('Request details:', {
        url: `${proxyUrl}/services`,
        targetUrl: this.baseUrl,
        token: this.token ? 'Present' : 'Missing',
        serviceConfig
      });

      const response = await fetch(`${proxyUrl}/services`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Target-URL': this.baseUrl,
        },
        body: JSON.stringify({
          type: serviceConfig.type,
          name: `${serviceConfig.type}-${nodeId}`,
          project_uuid: serviceConfig.project_uuid,
          environment_name: serviceConfig.environment_name || 'production',
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

      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        console.error('Unexpected content type:', contentType);
        console.error('Response body:', text);
        throw new Error(`Expected JSON but got ${contentType}`);
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