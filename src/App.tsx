
import InfrastructureCanvas from './components/InfrastructureCanvas';
import { ReactFlowProvider } from 'reactflow';
import { ChatProvider } from './contexts/ChatContext';

function App() {
  return (
    <ChatProvider>
      <ReactFlowProvider>
        <div className="min-h-screen bg-gray-900">
          <InfrastructureCanvas />
        </div>
      </ReactFlowProvider>
    </ChatProvider>
  );
}

export default App;