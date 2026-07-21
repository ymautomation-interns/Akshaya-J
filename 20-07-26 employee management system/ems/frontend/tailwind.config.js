/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand - deep signal emerald. Doubles as the "present / active" status color,
        // so the same hue that represents the company also represents "people at work".
        primary: {
          50: '#EAF7F1',
          100: '#CFEEDF',
          200: '#9EDCC0',
          300: '#6BC89F',
          400: '#3AB37F',
          500: '#12A874',
          600: '#0C8C5F',
          700: '#096F4C',
          800: '#08573D',
          900: '#064530',
        },
        // Ink - the control-panel navy used for the sidebar and dark surfaces.
        ink: {
          DEFAULT: '#0C1424',
          soft: '#16213A',
          softer: '#202D49',
          border: '#243352',
          muted: '#8A97B5',
        },
        // Accent - warm amber signal for "on break / pending" states and secondary emphasis.
        accent: {
          50: '#FDF6E9',
          100: '#FBEACB',
          300: '#F3C773',
          400: '#EFB34D',
          500: '#E8A33D',
          600: '#C98726',
          700: '#A66C1B',
        },
        canvas: '#F3F5F8',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(12, 20, 36, 0.04), 0 1px 3px 0 rgba(12, 20, 36, 0.06)',
        'card-hover': '0 4px 10px -2px rgba(12, 20, 36, 0.08), 0 2px 6px -2px rgba(12, 20, 36, 0.06)',
        panel: '0 8px 24px -6px rgba(12, 20, 36, 0.35)',
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.45 },
        },
      },
    },
  },
  plugins: [],
};
