/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./shared/**/*.{js,ts,jsx,tsx}",
    "./entities/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
    "./widgets/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#083863",
        },
      },
    },
  },
  plugins: [],
}
