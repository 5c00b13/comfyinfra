import { useState } from 'react';
import { cn } from '../../../lib/utils';
import { Box } from 'lucide-react';

interface ServiceButtonProps {
  label: string;
  iconUrl: string;
  onClick: () => void;
}

export function ServiceButton({ label, iconUrl, onClick }: ServiceButtonProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center',
        'p-3 gap-2',
        'rounded-lg bg-gray-800/50',
        'hover:bg-gray-700/50 active:bg-gray-600/50',
        'transition-all duration-200',
        'group min-w-[100px]'
      )}
    >
      {!imageError && iconUrl ? (
        <img 
          src={iconUrl} 
          alt={label}
          onError={() => setImageError(true)}
          className="w-8 h-8 object-contain"
        />
      ) : (
        <Box className="w-8 h-8 text-gray-400" />
      )}
      <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}