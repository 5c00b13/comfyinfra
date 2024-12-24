import { ChatMessage } from '../../types/chat';

const WORKER_URL = import.meta.env.VITE_WORKER_URL;

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await fetch(`${WORKER_URL}/api/claude`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
} 