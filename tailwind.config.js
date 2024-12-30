/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/admin/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-primeui')],
}

