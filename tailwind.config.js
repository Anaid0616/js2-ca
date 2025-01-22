/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{html,js,ts,mjs}', '!./node_modules/**/*'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
    plugins: [],
  },
};
