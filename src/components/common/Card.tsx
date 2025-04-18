import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  className = '',
  variant = 'default',
  padding = 'md',
  onClick,
}) => {
  // Base card styles
  const baseStyles = 'rounded-lg overflow-hidden transition-all duration-200';
  
  // Variant-specific styles
  const variantStyles = {
    default: 'bg-white dark:bg-gray-800 shadow',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl',
    outlined: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
  };
  
  // Padding styles
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };
  
  // Interactive styles
  const interactiveStyles = onClick ? 'cursor-pointer hover:translate-y-[-2px]' : '';
  
  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${interactiveStyles} ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card; 