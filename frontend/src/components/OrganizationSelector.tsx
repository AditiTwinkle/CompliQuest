import { useState, useEffect } from 'react';
import apiClient from '../utils/api';

interface Organization {
  id: string;
  name: string;
  description?: string;
}

interface OrganizationSelectorProps {
  onSelect: (orgId: string) => void;
  selectedId?: string;
}

export default function OrganizationSelector({ onSelect, selectedId }: OrganizationSelectorProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await apiClient.get('/organizations');
      setOrganizations(response.data.organizations);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-gray-500">Loading organizations...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Organization</label>
      <select
        value={selectedId || ''}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        <option value="">Select an organization</option>
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
    </div>
  );
}
