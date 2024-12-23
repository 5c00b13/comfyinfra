import type { ChatMessage, ChatResponse } from '../types/chat';
import { sendChatMessage } from '../lib/api/claude';

export class ChatService {
  private static instance: ChatService;
  
  private constructor() {}
  
  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async sendMessage(messages: ChatMessage[]): Promise<ChatResponse> {
    try {
      const response = await sendChatMessage(messages);
      return {
        message: response,
      };
    } catch (error) {
      console.error('Chat service error:', error);
      return {
        message: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export const chatService = ChatService.getInstance(); 