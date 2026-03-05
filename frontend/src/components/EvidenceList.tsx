import { useState, useEffect } from 'react';
import apiClient from '../utils/api';

interface Evidence {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: number;
  uploadedBy: string;
}

interface EvidenceListProps {
  controlId: string;
}

export default function EvidenceList({ controlId }: EvidenceListProps) {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvidence();
  }, [controlId]);

  const fetchEvidence = async () => {
    try {
      const response = await apiClient.get(`/evidence/control/${controlId}`);
      setEvidence(response.data.evidence);
    } catch (error) {
      console.error('Failed to fetch evidence:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) return <div className="text-gray-500 text-sm">Loading evidence...</div>;

  if (evidence.length === 0) {
    return <p className="text-gray-500 text-sm">No evidence uploaded yet</p>;
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Uploaded Evidence</h4>
      <div className="space-y-2">
        {evidence.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">📎</span>
              <div>
                <p className="font-medium text-gray-900">{item.fileName}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(item.fileSize)} • {formatDate(item.uploadedAt)}
                </p>
              </div>
            </div>
            <button className="text-indigo-600 hover:text-indigo-700 text-xs font-medium">Download</button>
          </div>
        ))}
      </div>
    </div>
  );
}
