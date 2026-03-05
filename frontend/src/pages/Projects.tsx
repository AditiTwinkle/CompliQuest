import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../utils/api';
import { LSEGlingAvatar } from '../components/LSEGlingAvatar';

interface Project {
  id: string;
  name: string;
  frameworkId: string;
  status: string;
  complianceScore: number;
  totalControls: number;
  compliantControls: number;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    frameworkId: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await apiClient.get('/projects');
      setProjects(response.data.projects);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/projects', {
        organizationId: 'org-1',
        name: formData.name,
        frameworkId: formData.frameworkId,
      });
      setProjects([...projects, response.data.project]);
      setFormData({ name: '', frameworkId: '' });
      setShowCreateForm(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create project');
    }
  };

  if (loading) return <div className="p-6">Loading challenges...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">🎮 Compliance Challenges</h1>
            <p className="text-lg text-gray-600 mt-2">Help LSEGling complete these quests to protect your community!</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            {showCreateForm ? '✕ Cancel' : '➕ New Challenge'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 font-semibold">
            {error}
          </div>
        )}

        {showCreateForm && (
          <form onSubmit={handleCreateProject} className="bg-white rounded-lg shadow-lg p-6 mb-8 space-y-4 border-2 border-indigo-200">
            <h2 className="text-xl font-bold text-gray-900">Create a New Challenge</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Challenge Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., AWS Security Compliance"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compliance Framework</label>
              <select
                value={formData.frameworkId}
                onChange={(e) => setFormData({ ...formData, frameworkId: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a framework</option>
                <option value="gdpr">🌍 GDPR</option>
                <option value="hipaa">🏥 HIPAA</option>
                <option value="pci-dss">💳 PCI-DSS</option>
                <option value="nist">🔒 NIST</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
            >
              🚀 Start Challenge
            </button>
          </form>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-lg">
            <div className="mb-6">
              <LSEGlingAvatar state="neutral" />
            </div>
            <p className="text-xl text-gray-600 mb-6">No challenges yet. Help LSEGling by creating one!</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-bold text-lg"
            >
              🎮 Create Your First Challenge
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition p-6 border-l-4 border-indigo-500 hover:scale-105 transform"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                    <p className="text-sm text-indigo-600 font-semibold mt-1">
                      {project.frameworkId.toUpperCase()} Challenge
                    </p>
                  </div>
                  <span className="text-2xl">🎯</span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">Progress</span>
                    <span className="text-2xl font-bold text-indigo-600">{project.complianceScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all"
                      style={{ width: `${project.complianceScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    {project.compliantControls}/{project.totalControls} controls completed
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/projects/${project.id}/questionnaire`}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-center font-bold text-sm"
                  >
                    🎮 Play Challenge
                  </Link>
                  <Link
                    to={`/projects/${project.id}`}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-center font-bold text-sm"
                  >
                    📊 Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
