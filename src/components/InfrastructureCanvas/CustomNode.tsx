import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { serviceCategories } from './NodeToolbar/service-categories';
import { cn } from '../../lib/utils';
import type { InfraNode } from '../../types';

const CustomNode = memo(({ data }: NodeProps<InfraNode>) => {
  const service = serviceCategories
    .flatMap(category => category.services)
    .find(s => s.type === data.type);
  
  return (
    <div className={cn(
      'px-4 py-2 shadow-lg rounded-lg border-2',
      'bg-gray-800 border-gray-700',
      'transition-all duration-200',
      data.status === 'healthy' && 'border-green-500',
      data.status === 'warning' && 'border-yellow-500',
      data.status === 'error' && 'border-red-500',
      data.status === 'deploying' && 'border-blue-500 animate-pulse'
    )}>
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="flex items-center gap-2">
        <img 
          src={service?.iconUrl} 
          alt={data.label}
          className="w-5 h-5 object-contain"
        />
        <span className="text-sm font-medium text-gray-200">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;