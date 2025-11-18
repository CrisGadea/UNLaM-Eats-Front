/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        unlam: {
          green: {
            50: '#e6f4ec',
            100: '#cdebdc',
            200: '#9ed7bb',
            300: '#6fc39a',
            400: '#3faf79',
            500: '#0f9b58',
            600: '#0b5f3a',
            700: '#005a32',
            800: '#004627',
            900: '#00321c',
          },
          accent: '#22c55e',
          white: '#ffffff',
        },
      },
      fontFamily: {
        sans: [
          'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'Noto Sans', 'Liberation Sans', 'sans-serif'
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,.06)',
      },
      borderRadius: {
        xl: '12px',
      }
    },
  },
  plugins: [],
};
