import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import apiClient from '../utils/api';
import { RootState } from '../store';

export default function UserProfile() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiClient.put(`/users/${user?.id}`, formData);
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="glass-strong rounded-3xl px-8 py-6 mb-8 hover-lift">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            User Profile
          </h1>
        </div>

        {success && (
          <div className="glass-strong border-2 border-green-400 text-green-700 px-6 py-4 rounded-2xl mb-6 font-semibold animate-slide-up">
            {success}
          </div>
        )}
        {error && (
          <div className="glass-strong border-2 border-red-300 text-red-700 px-6 py-4 rounded-2xl mb-6 font-semibold animate-slide-up">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-strong rounded-3xl shadow-2xl p-8 space-y-6 hover-lift">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-3 glass-strong rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-5 py-3 glass-strong rounded-2xl bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <p className="text-sm text-gray-500 mt-2 font-light">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
            <input
              type="text"
              value={user?.role || ''}
              disabled
              className="w-full px-5 py-3 glass-strong rounded-2xl bg-gray-100 text-gray-500 capitalize cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full liquid-gradient text-white py-4 rounded-2xl font-bold hover:opacity-90 disabled:opacity-50 transition-all duration-300 shadow-xl hover-lift"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
