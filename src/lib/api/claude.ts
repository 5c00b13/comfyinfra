import { ChatMessage } from '../../types/chat';

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  if (!CLAUDE_API_KEY) {
    throw new Error('VITE_CLAUDE_API_KEY is not configured');
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2024-02-29'
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (!data.content || !Array.isArray(data.content) || !data.content[0]?.text) {
      throw new Error('Invalid response format from API');
    }
    return data.content[0].text;
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
} 