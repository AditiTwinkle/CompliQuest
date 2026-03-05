import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LSEGlingAvatar from '../components/LSEGlingAvatar';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: string;
  status: string;
}

interface Project {
  id: string;
  name: string;
  framework: string;
  complianceScore: number;
  totalControls: number;
  compliantControls: number;
  nonCompliantControls: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    complianceScore: 0,
    totalControls: 0,
    compliantControls: 0,
    nonCompliantControls: 0,
  });
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Mock data for hackathon demo
    const mockAlerts: Alert[] = [
      {
        id: 'alert-1',
        title: 'Malnutrition',
        message: 'Missing food',
        severity: 'high',
        status: 'active',
      },
      {
        id: 'alert-2',
        title: 'Shelter',
        message: 'Missing shelter',
        severity: 'high',
        status: 'active',
      },
    ];

    const mockProjects: Project[] = [
      {
        id: 'proj-1',
        name: 'GDPR Compliance Challenge',
        framework: 'GDPR',
        complianceScore: 45,
        totalControls: 10,
        compliantControls: 4,
        nonCompliantControls: 6,
      },
      {
        id: 'proj-2',
        name: 'HIPAA Security Challenge',
        framework: 'HIPAA',
        complianceScore: 60,
        totalControls: 10,
        compliantControls: 6,
        nonCompliantControls: 4,
      },
    ];

    setAlerts(mockAlerts);
    setProjects(mockProjects);

    const totalControls = mockProjects.reduce((sum: number, p: any) => sum + (p.totalControls || 0), 0);
    const compliantControls = mockProjects.reduce((sum: number, p: any) => sum + (p.compliantControls || 0), 0);
    const nonCompliantControls = mockProjects.reduce((sum: number, p: any) => sum + (p.nonCompliantControls || 0), 0);
    const score = totalControls > 0 ? Math.round((compliantControls / totalControls) * 100) : 0;

    setStats({
      complianceScore: score,
      totalControls,
      compliantControls,
      nonCompliantControls,
    });

    setLoading(false);
  };

  const urgentAlerts = alerts.filter((a) => a.severity === 'critical' || a.severity === 'high');

  // Mock recent activity data
  const recentActivity = [
    { type: 'food', label: 'Bought food', user: 'Jane Smith', icon: '🍔' },
    { type: 'action', label: 'Helped team to comply with new EU AI regulation!', icon: '✅' },
  ];

  const nextCarouselItem = () => {
    setCarouselIndex((prev) => (prev + 1) % recentActivity.length);
  };

  const prevCarouselItem = () => {
    setCarouselIndex((prev) => (prev - 1 + recentActivity.length) % recentActivity.length);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold text-gray-900">CompliQuest</h1>
            <p className="text-gray-600 text-lg mt-1">Regulation Compliance for every team</p>
          </div>
          <button className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700">
            View Presentation
          </button>
        </div>

        {/* Alert Section - Turquoise */}
        {urgentAlerts.length > 0 && (
          <div className="bg-cyan-400 rounded-3xl p-8 shadow-xl border-4 border-cyan-500">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your LSEGling needs your attention!!</h2>
            <div className="flex items-center justify-between gap-8">
              {/* LSEGling with Remediation Badge */}
              <div className="flex-shrink-0 relative flex justify-center">
                <div className="relative">
                  <LSEGlingAvatar state="urgent" size="large" />
                  <div className="absolute -top-6 -left-6 bg-red-500 text-white rounded-full px-6 py-3 font-bold text-sm text-center shadow-lg transform -rotate-12">
                    <div>Remediation</div>
                    <div>required</div>
                  </div>
                </div>
              </div>

              {/* Alert Items */}
              <div className="flex-1 space-y-4">
                {urgentAlerts.slice(0, 2).map((alert, idx) => (
                  <div key={alert.id} className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="bg-gray-800 text-white px-4 py-2 rounded font-bold text-sm">
                        {idx === 0 ? 'Malnutrition' : 'Shelter'}
                      </div>
                      <span className="text-gray-700 font-semibold text-lg">
                        {idx === 0 ? 'Missing food' : 'Missing shelter'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity Carousel */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-gray-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 bg-gray-800 text-white p-3 rounded-lg text-center">Recent activity</h2>
          <div className="flex items-center justify-between gap-6">
            {/* Previous Button */}
            <button
              onClick={prevCarouselItem}
              className="text-5xl font-bold text-gray-800 hover:text-gray-600 flex-shrink-0 transition-colors"
            >
              ◀
            </button>

            {/* Carousel Items */}
            <div className="flex-1 flex gap-6 justify-center items-center">
              {/* Food Icon */}
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-300 flex items-center justify-center w-32 h-32 shadow-md">
                <span className="text-6xl">🍔</span>
              </div>

              {/* Activity Card */}
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-300 flex-1 flex items-center justify-center min-h-32 shadow-md">
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-lg">
                    {recentActivity[carouselIndex].label}
                  </p>
                  {recentActivity[carouselIndex].user && (
                    <p className="text-gray-600 mt-2 font-semibold">{recentActivity[carouselIndex].user}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={nextCarouselItem}
              className="text-5xl font-bold text-gray-800 hover:text-gray-600 flex-shrink-0 transition-colors"
            >
              ▶
            </button>
          </div>
        </div>

        {/* Gap Detection Section - Pink */}
        {projects.length > 0 && (
          <div className="bg-pink-300 rounded-3xl p-8 shadow-xl border-4 border-pink-400">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">CompliQuest found a gap:</h2>
            <div className="space-y-4">
              {projects.slice(0, 1).map((project) => (
                <div key={project.id} className="flex items-center gap-6 bg-white rounded-2xl p-6 shadow-md border-2 border-gray-200">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="text-6xl">☂️</div>
                  </div>

                  {/* Gap Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{project.name}</h3>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-4 rounded-full transition-all ${
                            project.complianceScore >= 75
                              ? 'bg-green-500'
                              : project.complianceScore >= 50
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${project.complianceScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 w-12">{project.complianceScore}%</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      !
                    </div>
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-3 py-1 font-bold text-xs whitespace-nowrap shadow-lg">
                      Shelter lost!
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate(`/projects/${project.id}/questionnaire`)}
                    className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700 whitespace-nowrap shadow-md"
                  >
                    Buy shelter
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completion Section - Magenta */}
        {stats.complianceScore >= 75 && (
          <div className="bg-pink-500 rounded-3xl p-8 shadow-xl border-4 border-pink-600 text-white">
            <p className="text-lg font-semibold text-center mb-4">
              You're automatically compliant to rest of 95 controls for the new EU AI regulation.
            </p>
            <p className="text-center mb-4 font-semibold">
              Open to see list of other regulations you're compliant with:
            </p>
            <p className="text-center text-sm font-semibold">
              (Open accordion)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
