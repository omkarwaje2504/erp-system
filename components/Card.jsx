import React from 'react';

export default function Card({ children, className = '', title }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {title && (
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
} 