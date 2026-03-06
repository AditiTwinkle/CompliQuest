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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="duo-card">
          <p className="text-[var(--duo-text-secondary)] text-lg font-bold">Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--duo-text-primary)] mb-2">
            🎯 Compliance Challenges
          </h1>
          <p className="text-lg text-[var(--duo-text-secondary)] font-medium">Choose your next adventure!</p>
        </div>

        {error && (
          <div className="duo-error-box mb-6 text-center">
            <p className="font-bold text-red-600">{error}</p>
          </div>
        )}

        {/* Create Form Toggle */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={showCreateForm ? 'duo-button-outline' : 'duo-button-secondary'}
          >
            {showCreateForm ? '✕ Cancel' : '➕ New Challenge'}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateProject} className="duo-card mb-8 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-[var(--duo-text-primary)] mb-6 text-center">Create New Challenge</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--duo-text-secondary)] mb-2">Challenge Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., AWS Security Compliance"
                  required
                  className="w-full duo-input"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--duo-text-secondary)] mb-2">Framework</label>
                <select
                  value={formData.frameworkId}
                  onChange={(e) => setFormData({ ...formData, frameworkId: e.target.value })}
                  required
                  className="w-full duo-input"
                >
                  <option value="">Select framework</option>
                  <option value="gdpr">🌍 GDPR</option>
                  <option value="hipaa">🏥 HIPAA</option>
                  <option value="pci-dss">💳 PCI-DSS</option>
                  <option value="nist">🔒 NIST</option>
                </select>
              </div>

              <button type="submit" className="w-full duo-button-primary">
                🚀 Create Challenge
              </button>
            </div>
          </form>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-20 duo-card max-w-md mx-auto">
            <div className="mb-8">
              <LSEGlingAvatar state="neutral" size="large" />
            </div>
            <h3 className="text-xl font-bold text-[var(--duo-text-primary)] mb-4">No challenges yet!</h3>
            <p className="text-[var(--duo-text-secondary)] mb-6 font-medium">Create your first challenge to get started.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="duo-button-primary"
            >
              🎮 Start Your Journey
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="duo-card group cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--duo-text-primary)]">{project.name}</h3>
                    <div className="duo-badge-blue text-xs mt-2">
                      <span>📋</span>
                      <span>{project.frameworkId.toUpperCase()}</span>
                    </div>
                  </div>
                  <span className="text-4xl group-hover:scale-110 transition-transform">🎯</span>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-[var(--duo-text-secondary)]">Progress</span>
                    <span className="text-2xl font-bold text-[var(--duo-primary)]">{project.complianceScore}%</span>
                  </div>
                  <div className="duo-progress-bar">
                    <div
                      className="duo-progress-fill"
                      style={{ width: `${project.complianceScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-[var(--duo-text-secondary)] mt-2 font-medium">
                    {project.compliantControls}/{project.totalControls} completed
                  </p>
                </div>

                <div className="space-y-2">
                  <Link
                    to={`/projects/${project.id}/questionnaire`}
                    className="block w-full duo-button-primary text-center"
                  >
                    🎮 Start Challenge
                  </Link>
                  <Link
                    to={`/projects/${project.id}`}
                    className="block w-full duo-button-outline text-center"
                  >
                    📊 View Details
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