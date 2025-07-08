import React from 'react';

export const Checkbox = React.forwardRef(({
    checked,
    onCheckedChange,
    className = '',
    id,
    ...props
}, ref) => {
    const baseClasses = 'h-4 w-4 shrink-0 rounded-sm border border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-teal-600 checked:text-white';

    return (
        <input
            ref={ref}
            type="checkbox"
            id={id}
            checked={checked}
            onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
            className={`${baseClasses} ${className}`}
            {...props}
        />
    );
});

Checkbox.displayName = 'Checkbox';