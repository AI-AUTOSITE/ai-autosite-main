/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom animations
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        spin: 'spin 1s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      // Keyframes for animations
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },

      // Background gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      // Custom colors (if needed)
      colors: {
        // You can add custom colors here if needed
      },

      // Typography
      fontSize: {
        // Custom font sizes if needed
      },

      // Spacing
      spacing: {
        // Custom spacing if needed
      },
    },
  },

  // Important: Add safelist for dynamically generated classes
  safelist: [
    // Colors that might be dynamically generated
    'text-green-400',
    'text-red-400',
    'text-purple-400',
    'text-cyan-400',
    'text-pink-400',
    'text-yellow-400',
    'text-blue-400',
    'bg-green-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-cyan-500',
    'bg-pink-500',

    // Select dropdown styles (for dark theme)
    '[&>option]:bg-gray-800',
    '[&>option]:text-white',
  ],

  plugins: [],
}
