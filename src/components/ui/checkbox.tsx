import React from 'react';

export const Checkbox = ({ className = '', ...props }) => (
  <input
    type="checkbox"
    className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${className}`}
    {...props}
  />
);
