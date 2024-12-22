import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { serviceCategories } from './NodeToolbar/service-categories';
import { cn } from '../../lib/utils';
import type { InfraNode } from '../../types';
import { Trash2, Play, Loader2 } from 'lucide-react';
import { CoolifyService } from '../../services/coolify';

const coolifyService = new CoolifyService();

const CustomNode = memo(({ data, id }: NodeProps<InfraNode>) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const service = serviceCategories
    .flatMap(category => category.services)
    .find(s => s.type === data.type);
  
  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      await coolifyService.deployService(id, {
        type: data.type,
        config: data.config
      });
      // Update node status to indicate successful deployment
      const event = new CustomEvent('updateNodeStatus', { 
        detail: { nodeId: id, status: 'healthy' } 
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Deployment failed:', error);
      // Update node status to indicate error
      const event = new CustomEvent('updateNodeStatus', { 
        detail: { nodeId: id, status: 'error' } 
      });
      window.dispatchEvent(event);
    } finally {
      setIsDeploying(false);
    }
  };
  
  return (
    <div className={cn(
      'px-4 py-2 shadow-lg rounded-lg border-2',
      'bg-gray-800 border-gray-700',
      'transition-all duration-200 relative group',
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
        <div className="flex items-center gap-1 ml-auto">
          <button 
            onClick={handleDeploy}
            disabled={isDeploying}
            className={cn(
              'p-1 rounded-full transition-all duration-200',
              'opacity-0 group-hover:opacity-100',
              'hover:bg-green-500/20 active:bg-green-500/30',
              isDeploying && 'cursor-not-allowed opacity-50'
            )}
            title="Deploy service"
          >
            {isDeploying ? (
              <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
            ) : (
              <Play className="w-4 h-4 text-green-400" />
            )}
          </button>
          <button 
            onClick={() => {
              const event = new CustomEvent('deleteNode', { detail: { nodeId: id } });
              window.dispatchEvent(event);
            }}
            className={cn(
              'p-1 rounded-full transition-all duration-200',
              'opacity-0 group-hover:opacity-100',
              'hover:bg-red-500/20 active:bg-red-500/30'
            )}
            title="Delete node"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;