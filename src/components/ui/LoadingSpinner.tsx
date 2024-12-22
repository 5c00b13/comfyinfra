import React from 'react';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-10 bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg text-gray-200">
      <div className="flex items-center gap-2">
        <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-gray-200 rounded-full" />
        {message}
      </div>
    </div>
  );
}