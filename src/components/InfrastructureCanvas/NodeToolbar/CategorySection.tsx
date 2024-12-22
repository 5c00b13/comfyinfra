import React from 'react';
import { ServiceButton } from './ServiceButton';
import type { ServiceCategory } from './service-categories';
import type { ServiceType } from '../../../types';
import { cn } from '../../../lib/utils';

interface CategorySectionProps {
  category: ServiceCategory;
  onAddNode: (type: ServiceType) => void;
}

export function CategorySection({ category, onAddNode }: CategorySectionProps) {
  return (
    <div className="flex-none">
      <div className="flex flex-col gap-2 min-w-[200px]">
        <h3 className="text-sm font-medium text-gray-400 px-2">
          {category.name}
        </h3>
        <div className={cn(
          'grid grid-cols-2 gap-2 p-2',
          'bg-gray-800/30 rounded-lg',
          'border border-gray-800'
        )}>
          {category.services.map((service) => (
            <ServiceButton
              key={service.type}
              label={service.label}
              iconUrl={service.iconUrl}
              onClick={() => onAddNode(service.type)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}