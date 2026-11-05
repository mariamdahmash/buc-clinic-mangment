/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { cairo: ['Cairo', 'sans-serif'] },
      colors: {
        brand: {
          50: '#eff9ff',
          100: '#d9f0ff',
          200: '#b9e4ff',
          300: '#86d2ff',
          400: '#4bb8f5',
          500: '#2198d5',
          600: '#1178b4',
          700: '#105f91',
          800: '#124f77',
          900: '#123f60'
        }
      },
      boxShadow: {
        soft: '0 18px 55px rgba(17, 91, 137, 0.12)'
      }
    }
  },
  plugins: [],
}