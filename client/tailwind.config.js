/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        // Light Green Modern UI Theme (Fresh, Clean, Vibrant)
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // fresh emerald
          600: '#16a34a', // modern accent
          700: '#15803d', // bold green
          800: '#166534',
          900: '#14532d', // button anchor
          950: '#052e16',
        },
        mint: {
          50: '#f2fcf6',
          100: '#e1f8ec',
          200: '#c3f1d9',
          300: '#95e4bd',
          400: '#5cd19c',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        sage: {
          50: '#f4fbf7',
          100: '#e6f7ef',
          200: '#d0f0e0',
          300: '#aee4cb',
          400: '#83d3b0',
          500: '#5cbf95',
          600: '#40a27a',
          700: '#328163',
        },
        stone: {
          50: '#fafcfb',  // crisp luminous off-white
          100: '#f1f5f3', // modern clean light
          200: '#e2eae5', // delicate green-stone border
          300: '#cbd7d0',
          400: '#94a39b',
          500: '#64746d',
          600: '#47554f',
          700: '#33413a',
          800: '#1e2923',
          900: '#0f1713',
        },
        // Alias primary to modern light green
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card-nature': '0 4px 16px -2px rgba(22, 163, 74, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card-nature-hover': '0 16px 32px -6px rgba(22, 163, 74, 0.16), 0 6px 12px -2px rgba(0, 0, 0, 0.05)',
        'forest-glow': '0 0 20px rgba(74, 222, 128, 0.35)',
        'green-glow': '0 0 25px rgba(34, 197, 94, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'pulse-subtle': 'pulseSubtle 2.5s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
