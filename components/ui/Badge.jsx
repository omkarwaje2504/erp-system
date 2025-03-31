import React from 'react';

const Badge = ({ 
children, 
variant = 'default', 
size = 'md',
className = '',
...props 
}) => {
// Base classes for all badges
const baseClasses = 'inline-flex items-center font-medium rounded-full';

// Size-specific classes
const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
};

// Variant-specific classes
const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
};

// Combine all classes
const badgeClasses = `
    ${baseClasses} 
    ${sizeClasses[size] || sizeClasses.md} 
    ${variantClasses[variant] || variantClasses.default}
    ${className}
`.trim();

return (
    <span className={badgeClasses} {...props}>
    {children}
    </span>
);
};

export default Badge;

