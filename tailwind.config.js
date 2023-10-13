/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#21252b",
        secondary: "#c678dd",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
