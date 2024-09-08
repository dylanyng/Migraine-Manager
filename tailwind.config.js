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
      },
    },
  },
  plugins: [],
}