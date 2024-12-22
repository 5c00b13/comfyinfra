import type { Node } from 'reactflow';
import type { InfraNode } from '../types';

let nodeId = 1;

export function createNode(type: InfraNode['type'], position: { x: number; y: number }): Node<InfraNode> {
  return {
    id: `${type}-${nodeId++}`,
    type: 'custom',
    position,
    data: {
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodeId}`,
      status: 'healthy',
      config: {},
    },
  };
}