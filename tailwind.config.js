/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#21252b",
        secondary: "#c678dd",
        border: "rgb(248 250 252 / 0.16)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
