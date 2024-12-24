import { ChatMessage } from '../../types/chat';

const WORKER_URL = import.meta.env.VITE_WORKER_URL?.replace(/\/$/, '') || '';

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  if (!WORKER_URL) {
    throw new Error('VITE_WORKER_URL environment variable is not configured');
  }

  try {
    const response = await fetch(`${WORKER_URL}/api/claude`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
    return data.content;
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
} 