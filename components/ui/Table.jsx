import React from 'react';

const Table = ({ className, children, ...props }) => {
return (
    <div className="w-full overflow-x-auto">
    <table 
        className={`min-w-full divide-y divide-gray-200 ${className || ''}`}
        {...props}
    >
        {children}
    </table>
    </div>
);
};

const TableCaption = ({ className, children, ...props }) => {
return (
    <caption 
    className={`p-5 text-left text-sm text-gray-500 ${className || ''}`}
    {...props}
    >
    {children}
    </caption>
);
};

const TableHeader = ({ className, children, ...props }) => {
return (
    <thead 
    className={`bg-gray-50 ${className || ''}`}
    {...props}
    >
    {children}
    </thead>
);
};

const TableBody = ({ className, children, ...props }) => {
return (
    <tbody 
    className={`bg-white divide-y divide-gray-200 ${className || ''}`}
    {...props}
    >
    {children}
    </tbody>
);
};

const TableFooter = ({ className, children, ...props }) => {
return (
    <tfoot 
    className={`bg-gray-50 ${className || ''}`}
    {...props}
    >
    {children}
    </tfoot>
);
};

const TableRow = ({ className, children, ...props }) => {
return (
    <tr 
    className={`hover:bg-gray-50 ${className || ''}`}
    {...props}
    >
    {children}
    </tr>
);
};

const TableHead = ({ className, children, ...props }) => {
return (
    <th 
    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className || ''}`}
    {...props}
    >
    {children}
    </th>
);
};

const TableCell = ({ className, children, ...props }) => {
return (
    <td 
    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${className || ''}`}
    {...props}
    >
    {children}
    </td>
);
};

export { Table, TableCaption, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell };

