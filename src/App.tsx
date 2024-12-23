import InfrastructureCanvas from './components/InfrastructureCanvas';
import { ReactFlowProvider } from 'reactflow';
import { ChatProvider } from './contexts/ChatContext';
import { ChatInterface } from './components/ChatInterface';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <ChatProvider>
      <ReactFlowProvider>
        <div className="relative min-h-screen bg-gray-950">
          <InfrastructureCanvas />
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-4 right-4 p-3 bg-blue-600 rounded-full shadow-lg hover:bg-blue-500 transition-colors"
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </button>
          {isChatOpen && <ChatInterface onClose={() => setIsChatOpen(false)} />}
        </div>
      </ReactFlowProvider>
    </ChatProvider>
  );
}

export default App;