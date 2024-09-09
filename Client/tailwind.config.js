/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      white: "ffffff"
      
    },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'source-sans': ['Source Sans Pro', 'Arial','sans-serif'],
        'montserrat': ['Montserrat', 'Arial','sans-serif'],
      },
    plugins: []
  }
}
