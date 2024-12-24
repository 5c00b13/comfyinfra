import type { Node } from 'reactflow';
import type { InfraNode, ServiceType } from '../types';

let nodeId = 1;

export function createNode(type: ServiceType, position: { x: number; y: number }): Node<InfraNode> {
  // Ensure type is a valid string
  if (!type) {
    console.error('Invalid node type:', type);
    type = 'postgres' as ServiceType; // Default to postgres if type is invalid
  }

  // Create a readable label from the type
  const label = type.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    id: `${type}-${nodeId++}`,
    type: 'custom',
    position,
    data: {
      id: `${type}-${nodeId}`,
      type,
      label: `${label} ${nodeId}`,
      status: 'healthy',
      config: {}
    },
  };
}