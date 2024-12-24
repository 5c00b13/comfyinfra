import { handleClaudeRequest } from './handlers/claude';
import { handleCoolifyRequest } from './handlers/coolify';
import { corsHeaders } from './utils/cors';

interface ProxyRequest extends Request {
  headers: Headers;
}

async function handleRequest(request: ProxyRequest): Promise<Response> {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // Route requests based on path
    if (url.pathname.startsWith('/api/claude')) {
      return handleClaudeRequest(request);
    }

    if (url.pathname.startsWith('/api/coolify')) {
      return handleCoolifyRequest(request);
    }

    return new Response('Not Found', { status: 404 });
  } catch (error) {
    console.error('Worker error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Worker error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

export default {
  async fetch(request: Request): Promise<Response> {
    return handleRequest(request as ProxyRequest);
  },
}; 