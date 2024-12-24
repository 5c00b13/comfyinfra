import { useEffect, useState } from 'react';
import { ServiceButton } from './ServiceButton';
import { cn } from '../../../lib/utils';
import type { ServiceType } from '../../../types';
import { fetchTemplates } from '../../../lib/api/pocketbase';
import type { Template } from '../../../lib/types/template';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { ErrorMessage } from '../../ui/ErrorMessage';

interface NodeToolbarProps {
  onAddNode: (type: ServiceType) => void;
}

export function NodeToolbar({ onAddNode }: NodeToolbarProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTemplates() {
      try {
        setLoading(true);
        const data = await fetchTemplates(controller.signal);
        if (!controller.signal.aborted) {
          // Filter out templates with invalid types
          const validTemplates = data.filter(template => {
            if (!template.type) {
              console.warn(`Template ${template.id} has no type`);
              return false;
            }
            return true;
          });
          setTemplates(validTemplates);
          setError(null);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Failed to load templates:', err);
          setError('Failed to load service templates. Please try again later.');
          setTemplates([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadTemplates();

    return () => controller.abort();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading templates..." />;
  }

  const handleAddNode = (template: Template) => {
    if (!template.type) {
      console.error('Template has no type:', template);
      return;
    }
    onAddNode(template.type as ServiceType);
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-10">
      <div className={cn(
        'flex gap-2 p-4 rounded-lg',
        'bg-gray-900/90 backdrop-blur-sm shadow-xl',
        'border border-gray-800'
      )}>
        {error ? (
          <ErrorMessage message={error} />
        ) : templates.length > 0 ? (
          templates.map((template) => (
            <ServiceButton
              key={template.id}
              label={template.name}
              iconUrl={template.icon}
              onClick={() => handleAddNode(template)}
            />
          ))
        ) : (
          <div className="text-gray-400 text-sm">
            No templates available
          </div>
        )}
      </div>
    </div>
  );
}