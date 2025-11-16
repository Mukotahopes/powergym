/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#A2D5C6", // твій фірмовий зелений
          dark: "#000000",
          light: "#ffffff",
        },
      },
    },
    plugins: [],
  }