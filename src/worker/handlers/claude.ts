import { corsHeaders } from '../utils/cors.js';
import Anthropic from '@anthropic-ai/sdk';

export async function handleClaudeRequest(request: Request): Promise<Response> {
  const apiKey = process.env.VITE_CLAUDE_API_KEY;
  if (!apiKey) {
    return new Response('VITE_CLAUDE_API_KEY is not configured', { 
      status: 500,
      headers: corsHeaders 
    });
  }

  try {
    const anthropic = new Anthropic({
      apiKey: apiKey
    });

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid request body - must be valid JSON' }), 
        { 
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    if (!body.messages || !Array.isArray(body.messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request format - messages array is required' }), 
        { 
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: body.messages
    });

    return new Response(JSON.stringify({ content: msg.content[0].text }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Claude API error:', error);
    
    // Check if it's an Anthropic API error
    if (error instanceof Anthropic.APIError) {
      return new Response(
        JSON.stringify({ 
          error: 'Claude API error',
          details: error.message,
          status: error.status
        }), 
        { 
          status: error.status || 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
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