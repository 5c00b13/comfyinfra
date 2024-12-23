import { ChatMessage } from '../../types/chat';

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

if (!CLAUDE_API_KEY) {
  console.error('VITE_CLAUDE_API_KEY is not set in environment variables');
}

export async function sendChatMessage(messages: ChatMessage[]) {
  const response = await fetch('/api/claude/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  const data = await response.json();
  return data.content;
} 