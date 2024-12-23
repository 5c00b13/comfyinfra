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
        console.error('Claude API key not configured');
        return new Response(
          JSON.stringify({ error: 'Claude API key not configured' }), 
          { 
            status: 500,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      try {
        const requestBody = await request.json();
        console.log('Claude API request:', requestBody);

        const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': claudeApiKey,
            'anthropic-version': '2024-02-29'
          },
          body: JSON.stringify(requestBody)
        });

        console.log('Claude API response status:', claudeResponse.status);
        const responseText = await claudeResponse.text();
        console.log('Claude API response:', responseText);

        if (!claudeResponse.ok) {
          return new Response(
            JSON.stringify({ 
              error: `Claude API error: ${responseText}`,
              status: claudeResponse.status 
            }), 
            { 
              status: claudeResponse.status,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
              }
            }
          );
        }

        try {
          const responseData = JSON.parse(responseText);
          return new Response(JSON.stringify(responseData), {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          });
        } catch (parseError) {
          console.error('Failed to parse Claude response:', parseError);
          return new Response(
            JSON.stringify({ 
              error: 'Invalid response from Claude API',
              details: responseText
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
      } catch (error) {
        console.error('Error processing Claude request:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Error processing Claude request',
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