interface ProxyRequest extends Request {
  headers: Headers;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Target-URL',
  'Access-Control-Max-Age': '86400',
};

async function handleOptions(): Promise<Response> {
  // Handle CORS preflight requests
  return new Response(null, {
    headers: corsHeaders,
  });
}

async function handleRequest(request: ProxyRequest): Promise<Response> {
  try {
    // Handle OPTIONS requests
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    // Special handling for Claude API requests
    if (request.url.includes('/messages')) {
      const claudeApiKey = process.env.CLAUDE_API_KEY;
      if (!claudeApiKey) {
        throw new Error('Claude API key not configured');
      }

      const requestBody = await request.json();
      
      const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': claudeApiKey,
          'anthropic-version': '2024-02-29'
        },
        body: JSON.stringify(requestBody)
      });

      if (!claudeResponse.ok) {
        const errorText = await claudeResponse.text();
        return new Response(
          JSON.stringify({ error: `Claude API error: ${errorText}` }), 
          { 
            status: claudeResponse.status,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      const responseData = await claudeResponse.json();
      return new Response(JSON.stringify(responseData), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Get the target URL from headers
    const targetUrl = request.headers.get('X-Target-URL');
    if (!targetUrl) {
      return new Response('Missing target URL', { status: 400 });
    }

    // Forward the request to the target URL
    const url = new URL(request.url);
    const targetFullUrl = `${targetUrl}${url.pathname}${url.search}`;
    
    // Create new headers without the custom header
    const headers = new Headers(request.headers);
    headers.delete('X-Target-URL');
    
    // Ensure Authorization header is forwarded
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      headers.set('Authorization', authHeader);
    }
    
    const response = await fetch(targetFullUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
    });

    // Add CORS headers to the response
    const responseHeaders = new Headers(response.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });
    
    // If the response is not OK, try to get more detailed error information
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Proxy error response:', {
        status: response.status,
        body: errorBody
      });
    }
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: `Proxy error: ${errorMessage}` }), 
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

// Export for Cloudflare Workers
export default {
  async fetch(
    request: Request
  ): Promise<Response> {
    return handleRequest(request as ProxyRequest);
  },
};

// Add type safety for addEventListener in non-module workers
declare global {
  interface WorkerGlobalScope {
    addEventListener(
      type: 'fetch',
      listener: (event: FetchEvent) => void
    ): void;
  }

  interface FetchEvent extends Event {
    request: Request;
    respondWith(response: Promise<Response> | Response): void;
  }
}

// For non-module workers, uncomment this:
/*
addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request as ProxyRequest));
});
*/ 