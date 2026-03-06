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
    <div className="duo-card">
      <div className="mb-4">
        <label htmlFor="response" className="block text-sm font-bold text-[var(--duo-text-primary)] mb-2">
          Your Response
        </label>
        <textarea
          id="response"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={isLoading}
          className="w-full duo-input resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          rows={6}
          maxLength={2000}
        />
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-[var(--duo-text-secondary)] font-medium">
            {charCount} / 2000 characters
          </span>
        </div>
      </div>

      {validationErrors.length > 0 && (
        <div className="mb-4 duo-error-box">
          <p className="text-sm font-bold text-red-600 mb-2">Validation Errors:</p>
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((error, idx) => (
              <li key={idx} className="text-sm text-red-600 font-medium">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={isLoading || !value.trim()}
        className="w-full duo-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Submitting...' : 'Submit Response'}
      </button>
    </div>
  );
};

export default UserResponseInput;