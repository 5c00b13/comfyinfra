import { ChatMessage } from '../../types/chat';

const WORKER_URL = import.meta.env.VITE_WORKER_URL;

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  try {
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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    try {
      const data = await response.json();
      if (!data.content || !Array.isArray(data.content) || !data.content[0]?.text) {
        throw new Error('Invalid response format from API');
      }
      return data.content[0].text;
    } catch (parseError) {
      console.error('Failed to parse API response:', parseError);
      throw new Error('Invalid response format from API');
    }
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
} 