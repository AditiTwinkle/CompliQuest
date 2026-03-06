import { useNavigate } from 'react-router-dom';

export default function Presentation() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Presentation</h1>
                <p className="text-gray-600 mb-6">Welcome to the presentation page.</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700"
                >
                    Demo
                </button>
            </div>
        </div>
    );
}
