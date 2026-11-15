/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F4F7F5',
          100: '#EAF0EC',
          200: '#D5E2D8',
          300: '#ADC6B3',
          400: '#86AA90',
          500: '#648E70',
          600: '#4D7257',
          700: '#3D5B45',
          800: '#324A38',
          900: '#2A3D2F',
        },
        ivory: {
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F5F0EA',
          300: '#EFE7DE',
          400: '#E2D4C5',
          500: '#CFC0AE',
        },
        mutedblue: {
          50: '#F2F6F9',
          100: '#E4EDF3',
          200: '#CDDCE7',
          300: '#A7C2D5',
          400: '#7B9FB8',
          500: '#5A7F9A',
          600: '#45667E',
          700: '#395368',
        },
        coral: {
          50: '#FDF4F2',
          100: '#FCE7E4',
          200: '#F9D1CA',
          300: '#F3B0A3',
          400: '#EA8673',
          500: '#DD634D',
          600: '#C74A34',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -1px rgba(61, 91, 69, 0.06), 0 1px 3px -1px rgba(61, 91, 69, 0.04)',
        'soft': '0 4px 16px -2px rgba(61, 91, 69, 0.08), 0 2px 6px -2px rgba(61, 91, 69, 0.05)',
        'soft-lg': '0 12px 28px -4px rgba(61, 91, 69, 0.10), 0 4px 12px -2px rgba(61, 91, 69, 0.06)',
        'soft-xl': '0 20px 40px -6px rgba(61, 91, 69, 0.12), 0 8px 16px -4px rgba(61, 91, 69, 0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
