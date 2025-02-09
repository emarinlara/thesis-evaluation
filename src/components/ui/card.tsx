import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className = '', children, ...props }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader: React.FC<CardProps> = ({ className = '', children, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<CardProps> = ({ className = '', children, ...props }) => (
  <h2 className={`text-2xl font-bold ${className}`} {...props}>
    {children}
  </h2>
);

export const CardContent: React.FC<CardProps> = ({ className = '', children, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);
