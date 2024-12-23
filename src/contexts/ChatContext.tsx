import { createContext, useContext, ReactNode } from 'react';
import { useChatStore } from '../stores/chatStore';
import { chatService } from '../services/chat';
import type { ChatMessage } from '../types/chat';

interface ChatContextType {
  sendMessage: (content: string) => Promise<void>;
  messages: ChatMessage[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { messages, addMessage, isOpen, setIsOpen } = useChatStore();

  const sendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);

    try {
      const response = await chatService.sendMessage([...messages, userMessage]);
      
      if (response.error) {
        addMessage({
          role: 'system',
          content: response.error,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      addMessage({
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      addMessage({
        role: 'system',
        content: 'Failed to send message. Please try again.',
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <ChatContext.Provider value={{ sendMessage, messages, isOpen, setIsOpen }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 