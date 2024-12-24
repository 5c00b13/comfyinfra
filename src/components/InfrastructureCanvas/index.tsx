import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Connection,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';

const defaultViewport = { x: 0, y: 0, zoom: 1 };

export default function InfrastructureCanvas() {
  const [nodes] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="w-full h-screen bg-gray-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        defaultViewport={defaultViewport}
        fitView
        className="w-full h-full"
      >
        <Background className="bg-gray-900" />
        <Controls className="bg-gray-800 border-gray-700" />
      </ReactFlow>
    </div>
  );
}