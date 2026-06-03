/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx,vue}"
  ],
  corePlugins: {  
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        surface: "#fbf9f5",
        primary: "#181919",
        secondary: "#4e635a",
        tertiary: "#201616",
        background: "#fbf9f5"
      },
      fontFamily: {
        serif: ["EB Garamond", "serif"],
        sans: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
}