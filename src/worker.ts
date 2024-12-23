interface ProxyRequest extends Request {
  headers: Headers;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

async function handleOptions(): Promise<Response> {
  return new Response(null, {
    headers: corsHeaders,
  });
}

async function handleRequest(request: ProxyRequest): Promise<Response> {
  try {
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    // Get the target URL from headers
    const targetUrl = request.headers.get('X-Target-URL');
    if (!targetUrl) {
      return new Response('Missing target URL', { status: 400 });
    }

    // Forward the request to Coolify
    const url = new URL(request.url);
    const targetFullUrl = `${targetUrl}${url.pathname}${url.search}`;
    
    const headers = new Headers(request.headers);
    headers.delete('X-Target-URL');
    
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      headers.set('Authorization', authHeader);
    }
    
    const response = await fetch(targetFullUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
    });

    const responseHeaders = new Headers(response.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Proxy error:', {
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