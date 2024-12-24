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

    const body = await request.json();
    const msg = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
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