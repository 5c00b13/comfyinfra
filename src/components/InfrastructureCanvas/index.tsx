import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Connection,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { NodeToolbar } from './NodeToolbar';
import { useVoiceCommands } from '../../hooks/useVoiceCommands';
import { createNode } from '../../lib/node-utils';
import { cn } from '../../lib/utils';
import type { InfraNode } from '../../types';

const nodeTypes = {
  custom: CustomNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 1 };

export default function InfrastructureCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { isListening, startListening } = useVoiceCommands();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleAddNode = useCallback((type: InfraNode['type']) => {
    const position = {
      x: Math.random() * (window.innerWidth / 2) + 100,
      y: Math.random() * (window.innerHeight / 2) + 100,
    };
    const newNode = createNode(type, position);
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  useEffect(() => {
    const handleDeleteNode = (event: CustomEvent<{ nodeId: string }>) => {
      const { nodeId } = event.detail;
      setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
      setEdges((edges) => edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ));
    };

    window.addEventListener('deleteNode', handleDeleteNode as EventListener);
    return () => {
      window.removeEventListener('deleteNode', handleDeleteNode as EventListener);
    };
  }, [setNodes, setEdges]);

  return (
    <div className="w-full h-screen bg-gray-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultViewport={defaultViewport}
        fitView
        className="w-full h-full"
      >
        <Background className="bg-gray-900" />
        <Controls className="bg-gray-800 border-gray-700" />
        <Panel position="top-left" className="bg-transparent border-none">
          <NodeToolbar onAddNode={handleAddNode} />
        </Panel>
      </ReactFlow>
      
      <div className="absolute bottom-4 right-4">
        <button
          onClick={startListening}
          className={cn(
            'px-4 py-2 rounded-full',
            'bg-gray-800 text-gray-200',
            'hover:bg-gray-700 transition-colors',
            isListening && 'bg-green-600 hover:bg-green-700'
          )}
        >
          {isListening ? 'Listening...' : 'Start Voice Commands'}
        </button>
      </div>
    </div>
  );
}