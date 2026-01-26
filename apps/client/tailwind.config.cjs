/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#194c50",
        secondary: "#ffbe7d",
        background: "#f4ede6",
      },
    },
  },
  plugins: [],
};
