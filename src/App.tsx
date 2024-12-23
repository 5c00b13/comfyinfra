import InfrastructureCanvas from './components/InfrastructureCanvas';
import { ReactFlowProvider } from 'reactflow';
import { ChatProvider } from './contexts/ChatContext';
import { ChatInterface } from './components/ChatInterface';

function App() {
  return (
    <ChatProvider>
      <ReactFlowProvider>
        <div className="relative min-h-screen bg-gray-950">
          <InfrastructureCanvas />
          <ChatInterface />
        </div>
      </ReactFlowProvider>
    </ChatProvider>
  );
}

export default App;