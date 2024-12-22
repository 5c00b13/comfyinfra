/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0F172A',
        foreground: '#E2E8F0',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};