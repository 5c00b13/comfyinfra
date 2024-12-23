import { useState, useEffect } from 'react';
import { CoolifyService } from '../services/coolify';

interface DeploymentConfigFormProps {
  onSubmit: (config: any) => void;
  onCancel: () => void;
}

const coolifyService = new CoolifyService();

export function DeploymentConfigForm({ onSubmit, onCancel }: DeploymentConfigFormProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    project_uuid: '',
    server_uuid: '',
    environment_name: 'production'
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [projectsData, serversData] = await Promise.all([
          coolifyService.listProjects(),
          coolifyService.listServers()
        ]);
        setProjects(projectsData);
        setServers(serversData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading configuration options...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Deployment Configuration</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Project
            </label>
            <select
              className="w-full bg-gray-700 rounded border border-gray-600 p-2"
              value={formData.project_uuid}
              onChange={(e) => setFormData(prev => ({ ...prev, project_uuid: e.target.value }))}
              required
            >
              <option value="">Select a project</option>
              {projects.map(project => (
                <option key={project.uuid} value={project.uuid}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Server
            </label>
            <select
              className="w-full bg-gray-700 rounded border border-gray-600 p-2"
              value={formData.server_uuid}
              onChange={(e) => setFormData(prev => ({ ...prev, server_uuid: e.target.value }))}
              required
            >
              <option value="">Select a server</option>
              {servers.map(server => (
                <option key={server.uuid} value={server.uuid}>
                  {server.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Environment
            </label>
            <input
              type="text"
              className="w-full bg-gray-700 rounded border border-gray-600 p-2"
              value={formData.environment_name}
              onChange={(e) => setFormData(prev => ({ ...prev, environment_name: e.target.value }))}
              placeholder="production"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 