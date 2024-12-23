import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Message } from '../Message';
import { sendChatMessage } from '../../lib/api/claude';
import type { ChatMessage } from '../../types/chat';

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: "Hello! I'm your infrastructure assistant. How can I help you today?",
    timestamp: new Date().toISOString()
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage([
        {
          role: 'system',
          content: 'You are an AI assistant helping with infrastructure management. You can help with creating and managing infrastructure nodes, deployment configurations, and general infrastructure questions.',
          timestamp: new Date().toISOString()
        },
        ...messages,
        userMessage
      ]);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Sorry, there was an error processing your request. Please try again later.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "fixed bottom-0 right-4 w-96 bg-gray-900 rounded-t-lg shadow-xl border border-gray-800 flex flex-col",
      "transition-all duration-300 ease-in-out",
      isMinimized ? "h-12" : "h-[600px]"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center cursor-pointer"
           onClick={() => setIsMinimized(!isMinimized)}>
        <h3 className="text-lg font-semibold text-gray-200">Infrastructure Assistant</h3>
        <button className="text-gray-400 hover:text-gray-200 transition-colors">
          {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
        </button>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((message, index) => (
              <Message key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center text-gray-400 space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your infrastructure..."
                className={cn(
                  'flex-1 bg-gray-800 text-gray-200 rounded-lg px-4 py-2',
                  'border border-gray-700 focus:border-gray-600',
                  'focus:outline-none focus:ring-1 focus:ring-gray-600'
                )}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={cn(
                  'p-2 rounded-lg',
                  'bg-blue-600 hover:bg-blue-500',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-colors'
                )}
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
} 