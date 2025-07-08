/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                teal: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                }
            },
            animation: {
                'tree-sway': 'tree-sway 3s ease-in-out infinite',
                'leaf-cycle': 'leaf-cycle 4s ease-in-out infinite',
            },
            keyframes: {
                'tree-sway': {
                    '0%, 100%': { transform: 'translateX(-50%) rotate(0deg)' },
                    '50%': { transform: 'translateX(-50%) rotate(2deg)' },
                },
                'leaf-cycle': {
                    '0%': { opacity: '1', transform: 'translateY(0px) rotate(0deg) scale(1)' },
                    '25%': { opacity: '0.7', transform: 'translateY(10px) rotate(45deg) scale(0.9)' },
                    '50%': { opacity: '0', transform: 'translateY(50px) rotate(180deg) scale(0.3)' },
                    '75%': { opacity: '0.3', transform: 'translateY(20px) rotate(270deg) scale(0.6)' },
                    '100%': { opacity: '1', transform: 'translateY(0px) rotate(360deg) scale(1)' },
                }
            }
        },
    },
    plugins: [],
}