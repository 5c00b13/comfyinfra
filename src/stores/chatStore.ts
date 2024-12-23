import { create } from 'zustand';
import type { ChatMessage } from '../types/chat';

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isOpen: false,
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  clearMessages: () => set({ messages: [] }),
  setIsOpen: (isOpen) => set({ isOpen }),
})); 