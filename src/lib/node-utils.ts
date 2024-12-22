import type { Node } from 'reactflow';
import type { InfraNode, ServiceType } from '../types';

let nodeId = 1;

export function createNode(type: ServiceType, position: { x: number; y: number }): Node<InfraNode> {
  // Ensure type is a string and create a readable label
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