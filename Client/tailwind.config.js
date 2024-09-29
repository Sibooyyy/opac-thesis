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
        'custom-bg': "url('/assets/output.png')",
      },
    },
  },
  plugins: [],
}