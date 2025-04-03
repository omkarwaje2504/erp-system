import React from 'react';

export default function Button({
  children,
  label,
  type = 'button',
  onClick,
  isLoading = false,
  className = '',
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center px-4 py-2
        border border-transparent rounded-lg
        text-sm font-medium
        transition-colors duration-200
        ${isLoading || disabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'
        }
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {label || children}
        </>
      ) : (
        label || children
      )}
    </button>
  );
}
