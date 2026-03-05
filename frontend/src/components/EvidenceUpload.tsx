import { useState, useRef } from 'react';
import apiClient from '../utils/api';

interface EvidenceUploadProps {
  controlId: string;
  projectId: string;
  onUploadSuccess?: () => void;
}

export default function EvidenceUpload({ controlId, projectId, onUploadSuccess }: EvidenceUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      // In a real app, you'd upload to S3 first and get the s3Key
      // For now, we'll simulate it
      const s3Key = `evidence/${projectId}/${controlId}/${Date.now()}-${file.name}`;

      await apiClient.post('/evidence', {
        controlId,
        projectId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        s3Key,
        description: `Uploaded ${file.name}`,
      });

      setSuccess('Evidence uploaded successfully');
      onUploadSuccess?.();

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload evidence');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Upload Evidence</label>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">{success}</div>}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id="evidence-upload"
        />
        <label htmlFor="evidence-upload" className="cursor-pointer">
          <div className="text-3xl mb-2">📄</div>
          <p className="text-sm font-medium text-gray-700">
            {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, XLS, XLSX up to 10MB</p>
        </label>
      </div>
    </div>
  );
}
