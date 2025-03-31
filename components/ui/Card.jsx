import React from 'react';

const Card = ({ className, children, ...props }) => {
return (
    <div 
    className={`bg-white rounded-lg shadow-md overflow-hidden ${className || ''}`} 
    {...props}
    >
    {children}
    </div>
);
};

const CardHeader = ({ className, children, ...props }) => {
return (
    <div 
    className={`px-6 py-4 border-b border-gray-200 ${className || ''}`}
    {...props}
    >
    {children}
    </div>
);
};

const CardTitle = ({ className, children, ...props }) => {
return (
    <h3 
    className={`text-xl font-bold text-gray-800 ${className || ''}`}
    {...props}
    >
    {children}
    </h3>
);
};

const CardDescription = ({ className, children, ...props }) => {
return (
    <p 
    className={`mt-1 text-sm text-gray-600 ${className || ''}`}
    {...props}
    >
    {children}
    </p>
);
};

const CardContent = ({ className, children, ...props }) => {
return (
    <div 
    className={`px-6 py-4 ${className || ''}`}
    {...props}
    >
    {children}
    </div>
);
};

const CardFooter = ({ className, children, ...props }) => {
return (
    <div 
    className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${className || ''}`}
    {...props}
    >
    {children}
    </div>
);
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

