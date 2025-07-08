import React from 'react';

export const Badge = ({ children, className = '', variant = 'default', ...props }) => {
    const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2';

    const variants = {
        default: 'border-transparent bg-teal-600 text-white hover:bg-teal-700',
        secondary: 'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200',
        destructive: 'border-transparent bg-red-600 text-white hover:bg-red-700',
        outline: 'text-gray-900 border-gray-300',
    };

    return (
        <div
            className={`${baseClasses} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};