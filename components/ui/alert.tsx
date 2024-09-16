import React from 'react';
import { cn } from '@/lib/utils'; // Utility function for merging classes, if you have one

interface AlertProps {
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
  className?: string;
}

interface AlertTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  children,
  className = '',
}) => {
  const variantClasses =
    variant === 'destructive'
      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';

  return (
    <div className={cn('p-4 rounded-md flex items-start space-x-2', variantClasses, className)}>
      {children}
    </div>
  );
};

export const AlertTitle: React.FC<AlertTitleProps> = ({ children, className = '' }) => {
  return (
    <h2 className={cn('font-bold text-sm', className)}>
      {children}
    </h2>
  );
};

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ children, className = '' }) => {
  return (
    <p className={cn('text-sm', className)}>
      {children}
    </p>
  );
};
