import React from 'react';
import { cn } from '../../../lib/utils';

interface ServiceButtonProps {
  label: string;
  iconUrl: string;
  onClick: () => void;
}

export function ServiceButton({ label, iconUrl, onClick }: ServiceButtonProps) {
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
      <img 
        src={iconUrl} 
        alt={label} 
        className="w-8 h-8 object-contain"
      />
      <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}