/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ✅ Enables toggle-based dark mode
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ Scans all your React files for classes
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // ✅ Adds the professional Inter font
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out forwards', // ✅ Custom animation
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}