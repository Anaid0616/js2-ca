/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js,ts,mjs}", "!./node_modules/**/*"],

  theme: {
    extend: {
      fontFamily: {
        bodyfont: ["Inter", "sans-serif"],
      },
    },
    plugins: [require("@tailwindcss/aspect-ratio")],
  },
};
