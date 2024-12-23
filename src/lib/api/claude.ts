import { ChatMessage } from '../../types/chat';

const WORKER_URL = import.meta.env.VITE_WORKER_URL;

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  if (!WORKER_URL) {
    throw new Error('VITE_WORKER_URL is not configured');
  }

  try {
    console.log('Sending request to:', `${WORKER_URL}/messages`);
    console.log('Request payload:', JSON.stringify({
      model: 'claude-3-opus-20240229',
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    }, null, 2));

    const response = await fetch(`${WORKER_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 1024,
      }),
    });

    // Log response details for debugging
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    try {
      const data = JSON.parse(responseText);
      if (!data.content || !Array.isArray(data.content) || !data.content[0]?.text) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response format from API');
      }
      return data.content[0].text;
    } catch (parseError) {
      console.error('Failed to parse API response:', parseError);
      console.error('Response text:', responseText);
      throw new Error('Invalid response format from API');
    }
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
} 