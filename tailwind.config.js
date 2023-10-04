/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "home-lg": "200px auto 200px",
        "home-md": "50px auto 50px",
        "home-sm": "30px auto 30px",
      },
    },
  },
  plugins: [],
};
