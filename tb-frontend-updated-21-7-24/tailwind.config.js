/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#122620',
        secondary: '#1E2D2B',
        accent: '#8AC9A7',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};