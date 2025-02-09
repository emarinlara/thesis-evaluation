import React from 'react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ className = '', children, ...props }) => (
  <div
    className={`p-4 rounded-md bg-blue-50 border border-blue-200 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const AlertTitle: React.FC<AlertProps> = ({ className = '', children, ...props }) => (
  <h3 className={`font-bold text-lg ${className}`} {...props}>
    {children}
  </h3>
);

export const AlertDescription: React.FC<AlertProps> = ({ className = '', children, ...props }) => (
  <div className={`mt-2 text-sm ${className}`} {...props}>
    {children}
  </div>
);
