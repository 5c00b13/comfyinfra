import React from 'react';
import InfrastructureCanvas from './components/InfrastructureCanvas';
import { ReactFlowProvider } from 'reactflow';

function App() {
  return (
    <ReactFlowProvider>
      <div className="min-h-screen bg-gray-900">
        <InfrastructureCanvas />
      </div>
    </ReactFlowProvider>
  );
}

export default App;