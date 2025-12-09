/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        shape: {
          black: '#1f2937',
          gray: '#6b7280',
          white: '#ffffff',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      boxShadow: {
        'shape': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'shape-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'correct': '0 0 20px rgba(34, 197, 94, 0.4)',
        'wrong': '0 0 20px rgba(239, 68, 68, 0.4)',
        'selected': '0 0 20px rgba(59, 130, 246, 0.4)',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
  safelist: [
    // Ensure all shape-related classes are included
    'rotate-45',
    'rotate-90',
    'rotate-180',
    'rotate-270',
    'animate-pulse',
    'animate-bounce',
    'animate-spin',
    'ring-4',
    'ring-blue-400',
    'ring-green-400',
    'ring-red-400',
    'ring-opacity-60',
    'scale-105',
    'scale-95',
    'hover:scale-110',
    'transform',
    'transition-all',
    'duration-300',
    'shadow-lg',
    'shadow-green-200',
    'shadow-red-200',
    'shadow-blue-200',
  ],
};