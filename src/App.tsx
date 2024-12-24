import InfrastructureCanvas from './components/InfrastructureCanvas';
import { ReactFlowProvider } from 'reactflow';

function App() {
  return (
    <ReactFlowProvider>
      <div className="relative min-h-screen bg-gray-950">
        <InfrastructureCanvas />
      </div>
    </ReactFlowProvider>
  );
}

export default App;