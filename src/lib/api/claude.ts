import { ChatMessage } from '../../types/chat';

export async function sendChatMessage(messages: ChatMessage[]) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
      'anthropic-version': '2024-02-29'
    },
    body: JSON.stringify({
      model: 'claude-3-opus-20240229',
      messages: messages.map(msg => ({
        role: msg.role,
        content: [{
          type: 'text',
          text: msg.content
        }]
      })),
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send message: ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
} 