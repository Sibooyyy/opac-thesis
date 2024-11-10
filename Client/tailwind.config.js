/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { 
        'poppins': ['Poppins', 'sans-serif'], 
        'source-sans': ['Source Sans Pro', 'Arial', 'sans-serif'], 
        'montserrat': ['Montserrat', 'Arial', 'sans-serif']
      },
      backgroundImage: {
        'custom-bg': "url('/Client/assets/output.png')",
      },
      boxShadow: {
          '3xl': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}