import React from 'react';

export const Textarea = React.forwardRef(({
    className = '',
    ...props
}, ref) => {
    const baseClasses = 'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    return (
        <textarea
            ref={ref}
            className={`${baseClasses} ${className}`}
            {...props}
        />
    );
});

Textarea.displayName = 'Textarea';