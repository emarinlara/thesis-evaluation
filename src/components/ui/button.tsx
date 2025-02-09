import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ className = '', children, ...props }) => (
  <button
    className={`px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  >
    {children}
  </button>
);
