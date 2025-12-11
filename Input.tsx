import React from 'react';
import { InputProps } from '../types';

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`
            block w-full px-4 py-3.5 
            bg-white border border-gray-200 rounded-xl 
            text-gray-900 placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
            transition duration-200 ease-in-out
            shadow-sm
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};