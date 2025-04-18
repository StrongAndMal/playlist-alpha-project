import React, { useState } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface AccountResetProps {
  onReset: () => Promise<void>;
  onCancel: () => void;
}

const AccountReset: React.FC<AccountResetProps> = ({ onReset, onCancel }) => {
  const [resetStep, setResetStep] = useState<'confirm' | 'processing' | 'complete'>('confirm');
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    setResetStep('processing');
    setError(null);
    
    try {
      await onReset();
      setResetStep('complete');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setResetStep('confirm');
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full mx-auto shadow-xl">
      {resetStep === 'confirm' && (
        <>
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-white">Reset Your Account</h3>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-300 mb-4">
              This will reset your account to its initial state. The following data will be cleared:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              <li>Profile customizations (banner, avatar, theme)</li>
              <li>Followers and following connections</li>
              <li>Activity history</li>
              <li>Social media links</li>
              <li>Privacy settings (reset to default)</li>
            </ul>
            <p className="text-gray-300 mt-4">
              <strong>Your playlists and account credentials will be preserved.</strong>
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded text-red-200 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
            >
              Reset Account
            </button>
          </div>
        </>
      )}
      
      {resetStep === 'processing' && (
        <div className="text-center py-8">
          <ArrowPathIcon className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-white text-lg">Resetting your account...</p>
          <p className="text-gray-400 mt-2">This may take a moment</p>
        </div>
      )}
      
      {resetStep === 'complete' && (
        <>
          <div className="text-center py-6">
            <div className="bg-green-100 rounded-full p-3 mx-auto w-fit mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Account Reset Complete</h3>
            <p className="text-gray-300 mb-6">
              Your account has been reset to its initial state. You'll now see the welcome tutorial for new users.
            </p>
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Continue to Profile
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountReset; 