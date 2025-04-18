import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    leftIcon, 
    rightIcon, 
    className = '',
    fullWidth = true,
    ...props 
  }, ref) => {
    const inputClasses = `
      bg-white dark:bg-gray-800 
      border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} 
      text-gray-900 dark:text-white 
      rounded-lg 
      focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'} 
      focus:border-transparent
      block 
      w-full 
      p-2.5 
      ${leftIcon ? 'pl-10' : ''} 
      ${rightIcon ? 'pr-10' : ''}
      ${className}
    `;

    const containerClasses = `
      ${fullWidth ? 'w-full' : 'w-auto'}
      mb-4
    `;

    return (
      <div className={containerClasses}>
        {label && (
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={inputClasses}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 