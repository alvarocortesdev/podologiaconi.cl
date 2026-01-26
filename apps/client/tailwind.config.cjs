/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        sans: ["Source Sans 3", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        primary: "#194c50",
        secondary: "#ffbe7d",
        background: "#f4ede6",
      },
    },
  },
  plugins: [],
};
