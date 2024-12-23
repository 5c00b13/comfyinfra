export interface Env {
  CLAUDE_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version',
        },
      });
    }

    const anthropicUrl = 'https://api.anthropic.com/v1/messages';

    const modifiedRequest = new Request(anthropicUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.CLAUDE_API_KEY,
        'anthropic-version': '2024-02-29',
      },
      body: request.body,
    });

    const response = await fetch(modifiedRequest);
    const newResponse = new Response(response.body, response);

    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    return newResponse;
  },
}; 