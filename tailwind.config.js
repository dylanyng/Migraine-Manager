/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./public/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        midnight: 'rgb(17, 24, 39)',
        deadnight: '#0C111C'
      },
      screens: {
        'xs': '375px',  // Target iPhone SE and other small devices
      },
    },
  },
  plugins: [],
}