import { ChatMessage } from '../../types/chat';

interface MessageProps {
  message: ChatMessage;
}

export function Message({ message }: MessageProps) {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
        message.role === 'user' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-800 text-gray-200'
      }`}>
        {message.content}
      </div>
    </div>
  );
} 