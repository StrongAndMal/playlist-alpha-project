import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

type MessageType = 'success' | 'error' | 'info' | 'warning';

interface FeedbackMessageProps {
  type: MessageType;
  message: string;
  duration?: number; // in milliseconds, 0 for no auto-dismiss
  onDismiss?: () => void;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  type,
  message,
  duration = 5000, // 5 seconds default
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Reset visibility when message changes
    setIsVisible(true);
    
    // Set up auto-dismiss timer if duration > 0
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [message, duration, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!isVisible) return null;

  const typeConfig = {
    success: {
      bgColor: 'bg-green-600',
      bgOpacity: 'bg-opacity-10',
      borderColor: 'border-green-500',
      textColor: 'text-green-600',
      icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    },
    error: {
      bgColor: 'bg-red-600',
      bgOpacity: 'bg-opacity-10',
      borderColor: 'border-red-500',
      textColor: 'text-red-600',
      icon: <ExclamationCircleIcon className="h-5 w-5 text-red-500" />,
    },
    info: {
      bgColor: 'bg-blue-600',
      bgOpacity: 'bg-opacity-10',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-600',
      icon: <CheckCircleIcon className="h-5 w-5 text-blue-500" />,
    },
    warning: {
      bgColor: 'bg-yellow-600',
      bgOpacity: 'bg-opacity-10',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-600',
      icon: <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />,
    },
  };

  const config = typeConfig[type];

  return (
    <div className={`${config.bgColor} ${config.bgOpacity} border-l-4 ${config.borderColor} p-4 mb-4 rounded`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {config.icon}
        </div>
        <div className={`ml-3 flex-1 ${config.textColor}`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={handleDismiss}
              className={`inline-flex ${config.textColor} rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-${type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'info' ? 'blue' : 'yellow'}-500`}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackMessage; 