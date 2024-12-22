import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface NodeButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

export function NodeButton({ icon: Icon, label, onClick }: NodeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center',
        'min-w-[80px] p-3 gap-2',
        'rounded-lg bg-gray-800/50',
        'hover:bg-gray-700/50 active:bg-gray-600/50',
        'transition-all duration-200',
        'group'
      )}
    >
      <Icon className="w-6 h-6 text-gray-400 group-hover:text-gray-200 transition-colors" />
      <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}