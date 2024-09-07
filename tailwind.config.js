/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./public/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        gray: colors.neutral,
        indigo: colors.indigo,
        red: colors.rose,
        yellow: colors.amber,
      }
    },
    extend: {},
  },
  plugins: [],
}