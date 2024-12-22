import React from 'react';
import { cn } from '../../lib/utils';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-10 bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg text-red-400">
      {message}
    </div>
  );
}