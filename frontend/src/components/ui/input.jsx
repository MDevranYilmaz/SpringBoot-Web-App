import React from 'react';

export const Input = React.forwardRef(({
    type = 'text',
    className = '',
    ...props
}, ref) => {
    const baseClasses = 'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    return (
        <input
            ref={ref}
            type={type}
            className={`${baseClasses} ${className}`}
            {...props}
        />
    );
});

Input.displayName = 'Input';