import React from 'react';

export default function Layout({ children, className = '' }) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-8xl mx-auto">
        {children}
      </div>
    </div>
  );
} 