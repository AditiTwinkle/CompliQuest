import React, { useState } from 'react';

interface UserResponseInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  placeholder?: string;
  validationErrors?: string[];
}

export const UserResponseInput: React.FC<UserResponseInputProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = 'Enter your response to this compliance requirement...',
  validationErrors = [],
}) => {
  const [charCount, setCharCount] = useState(value.length);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setCharCount(newValue.length);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <label htmlFor="response" className="block text-sm font-semibold text-gray-900 mb-2">
          Your Response
        </label>
        <textarea
          id="response"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          rows={6}
          maxLength={2000}
        />
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {charCount} / 2000 characters
          </span>
        </div>
      </div>

      {validationErrors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-semibold text-red-800 mb-2">Validation Errors:</p>
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((error, idx) => (
              <li key={idx} className="text-sm text-red-700">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={isLoading || !value.trim()}
        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Submitting...' : 'Submit Response'}
      </button>
    </div>
  );
};

export default UserResponseInput;
