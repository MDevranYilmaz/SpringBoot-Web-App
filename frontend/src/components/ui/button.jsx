import React from 'react';

export const Button = React.forwardRef(({
    children,
    variant = 'default',
    size = 'default',
    className = '',
    type = 'button',
    disabled = false,
    onClick,
    ...props
}, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        default: 'bg-teal-600 text-white hover:bg-teal-700',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900',
        ghost: 'hover:bg-gray-100 hover:text-gray-900',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    };

    const sizes = {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={classes}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';