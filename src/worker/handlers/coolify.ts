import { corsHeaders } from '../utils/cors.js';

export async function handleCoolifyRequest(request: Request): Promise<Response> {
  const coolifyToken = process.env.VITE_COOLIFY_API_TOKEN;
  const coolifyUrl = process.env.VITE_COOLIFY_URL;

  if (!coolifyToken || !coolifyUrl) {
    return new Response('Coolify configuration missing', { 
      status: 500,
      headers: corsHeaders 
    });
  }

  try {
    const url = new URL(request.url);
    const targetUrl = `${coolifyUrl}${url.pathname.replace('/api/coolify', '')}`;

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Authorization': `Bearer ${coolifyToken}`,
        'Content-Type': 'application/json'
      },
      body: request.body
    });

    const responseData = await response.json();
    return new Response(JSON.stringify(responseData), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Coolify API error:', error);
    return new Response(
      JSON.stringify({ error: 'Coolify API error' }), 
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