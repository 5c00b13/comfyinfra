import { handleCoolifyRequest } from './handlers/coolify.js';
import { corsHeaders } from './utils/cors.js';
import http from 'http';

interface ProxyRequest extends Request {
  headers: Headers;
}

async function handleRequest(request: ProxyRequest): Promise<Response> {
  try {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

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

// Create HTTP server
const server = http.createServer(async (req, res) => {
  try {
    // Convert Node.js request to Fetch API Request
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      const request = new Request(url.toString(), {
        method: req.method,
        headers: new Headers(req.headers as Record<string, string>),
        body: body || undefined
      }) as ProxyRequest;

      const response = await handleRequest(request);
      
      // Convert Fetch API Response to Node.js response
      res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
      
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(decoder.decode(value));
        }
      }
      
      res.end();
    });
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json', ...corsHeaders });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Worker listening on port ${port}`);
});

// Export for testing purposes
export default {
  fetch: (request: Request): Promise<Response> => handleRequest(request as ProxyRequest)
}; 