import { corsHeaders } from '../utils/cors';

export async function handleClaudeRequest(request: Request): Promise<Response> {
  const claudeApiKey = process.env.VITE_CLAUDE_API_KEY;
  if (!claudeApiKey) {
    return new Response('VITE_CLAUDE_API_KEY is not configured', { 
      status: 500,
      headers: corsHeaders 
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2024-02-29'
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
    console.error('Claude API error:', error);
    return new Response(
      JSON.stringify({ error: 'Claude API error' }), 
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